# -------------------------------------------------------------------
# Stage 1: Build JAR with Maven & OpenJDK 17
# -------------------------------------------------------------------
FROM maven:3.9.8-eclipse-temurin-17-alpine AS builder

WORKDIR /build

# Pre-cache Maven dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build production JAR (skipping unit tests)
COPY src ./src
RUN mvn clean package -DskipTests -B

# -------------------------------------------------------------------
# Stage 2: Minimal Secure Runtime Image
# -------------------------------------------------------------------
FROM eclipse-temurin:17-jre-alpine AS runner

WORKDIR /app

# Security: Create non-root system user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy compiled JAR from builder stage
COPY --from=builder /build/target/*.jar app.jar

# Assign ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to unprivileged user
USER appuser

# Dynamic port binding for Render (default 8080)
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=postgres

EXPOSE 8080

# Production JVM container optimizations
ENTRYPOINT ["sh", "-c", "java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom -Dserver.port=${PORT} -jar app.jar"]
