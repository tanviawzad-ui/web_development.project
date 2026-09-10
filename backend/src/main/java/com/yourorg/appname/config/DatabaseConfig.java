package com.yourorg.appname.config;

import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

/**
 * Smart Cloud Database Configuration for Render.com PostgreSQL.
 * Automatically parses Render's injected DATABASE_URL (postgres://user:pass@host:port/db)
 * and constructs a production-ready HikariDataSource with SSL enabled.
 */
@Configuration
@Profile("postgres")
@Slf4j
public class DatabaseConfig {

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        // Render or other cloud providers often inject DATABASE_URL
        String rawUrl = databaseUrl;
        if (rawUrl == null || rawUrl.isBlank()) {
            rawUrl = System.getenv("DATABASE_URL");
        }

        if (rawUrl != null && !rawUrl.isBlank()) {
            log.info("Detected cloud DATABASE_URL environment variable. Adapting to PostgreSQL JDBC format...");
            try {
                // Normalize prefix so java.net.URI can parse userinfo, host, port, path
                String uriString = rawUrl.trim();
                if (uriString.startsWith("postgres://")) {
                    uriString = "http://" + uriString.substring("postgres://".length());
                } else if (uriString.startsWith("postgresql://")) {
                    uriString = "http://" + uriString.substring("postgresql://".length());
                } else if (!uriString.startsWith("http://") && !uriString.startsWith("https://")) {
                    uriString = "http://" + uriString;
                }

                URI uri = new URI(uriString);

                String username = "";
                String password = "";
                if (uri.getUserInfo() != null) {
                    String[] userParts = uri.getUserInfo().split(":", 2);
                    username = userParts[0];
                    if (userParts.length > 1) {
                        password = userParts[1];
                    }
                }

                String host = uri.getHost();
                int port = uri.getPort() != -1 ? uri.getPort() : 5432;
                String path = uri.getPath(); // includes leading slash e.g. /medicare_db

                StringBuilder jdbcUrlBuilder = new StringBuilder("jdbc:postgresql://")
                        .append(host)
                        .append(":")
                        .append(port)
                        .append(path);

                if (uri.getQuery() != null && !uri.getQuery().isBlank()) {
                    jdbcUrlBuilder.append("?").append(uri.getQuery());
                    if (!uri.getQuery().contains("sslmode")) {
                        jdbcUrlBuilder.append("&sslmode=require");
                    }
                } else {
                    jdbcUrlBuilder.append("?sslmode=require");
                }

                String jdbcUrl = jdbcUrlBuilder.toString();
                log.info("Configured PostgreSQL JDBC connection: jdbc:postgresql://{}:{}{} (user: {})", host, port, path, username);

                HikariDataSource dataSource = new HikariDataSource();
                dataSource.setDriverClassName("org.postgresql.Driver");
                dataSource.setJdbcUrl(jdbcUrl);
                dataSource.setUsername(username);
                dataSource.setPassword(password);

                // Production connection pool tuning for Render Free Tier
                dataSource.setPoolName("MedicarePostgresHikariPool");
                dataSource.setMaximumPoolSize(5);
                dataSource.setMinimumIdle(2);
                dataSource.setIdleTimeout(300000);
                dataSource.setConnectionTimeout(20000);
                dataSource.setMaxLifetime(1200000);

                return dataSource;
            } catch (URISyntaxException e) {
                log.error("Failed to parse DATABASE_URL: {}. Falling back to default datasource configuration.", e.getMessage());
            }
        }

        log.info("No DATABASE_URL found. Initializing standard datasource properties.");
        return properties.initializeDataSourceBuilder().type(HikariDataSource.class).build();
    }
}
