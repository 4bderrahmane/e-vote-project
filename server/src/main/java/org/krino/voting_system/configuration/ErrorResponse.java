package org.krino.voting_system.configuration;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import org.krino.voting_system.utilities.ErrorCode;

import java.time.Instant;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "UTC")
        Instant timestamp,
        int status,
        String message,
        String path,
        ErrorCode errorCode,
        Map<String, Object> details
)
{

}
