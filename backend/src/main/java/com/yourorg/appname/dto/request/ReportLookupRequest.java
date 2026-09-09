package com.yourorg.appname.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportLookupRequest {

    @NotBlank(message = "Identifier (UHID or Mobile Number) is required")
    private String identifier;
}
