package org.krino.voting_system.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.krino.voting_system.utilities.ErrorCode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.jspecify.annotations.Nullable;
import jakarta.validation.constraints.NotNull;

import java.net.URI;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Map;
import java.time.Instant;
import java.util.HashMap;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler
{
    private static final Logger LOG = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private static final String PATH = "path";
    private static final String METHOD = "method";
    //    private static final String TRACE_ID = "traceId";
    private static final String ERRORS = "errors";
    private static final String TIMESTAMP = "timestamp";
    private static final String ERROR_CODE = "errorCode";

    private static void setPropertyIfAbsent(ProblemDetail pd, String key, @Nullable Object value)
    {
        if (value == null) return;

        Map<String, Object> props = pd.getProperties();
        if (props != null && props.containsKey(key)) return;

        pd.setProperty(key, value);
    }

    /**
     * Generic ProblemDetail factory.
     *
     * @param errorCode Your domain error code (drives HTTP status)
     * @param detail    Human-readable error message
     * @param request   Current request (used for path/method/instance)
     * @param errors    Optional structured errors (e.g., field validation list)
     * @param extras    Optional extra properties to attach
     * @param ex        Optional exception (only used to attach exception type, not stack trace)
     */

    protected ProblemDetail createProblemDetail(
            ErrorCode errorCode,
            String detail,
            @Nullable HttpServletRequest request,
            @Nullable Object errors,
            @Nullable Map<String, ?> extras,
            @Nullable Throwable ex
    )
    {
        HttpStatus status = HttpStatus.valueOf(errorCode.httpStatus());
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(status, detail);

        pd.setTitle(status.getReasonPhrase());
        pd.setType(URI.create("urn:problem-type:" + errorCode.name().toLowerCase().replace("_", "-")));

        if (request != null)
        {
            String instance = request.getRequestURI();
            if (request.getQueryString() != null)
            {
                instance += "?" + request.getQueryString();
            }
            pd.setInstance(URI.create(instance));
            pd.setProperty(PATH, request.getRequestURI());
            pd.setProperty(METHOD, request.getMethod());
        }

        pd.setProperty(TIMESTAMP, OffsetDateTime.now(ZoneOffset.UTC));
        pd.setProperty(ERROR_CODE, errorCode.name());

        if (errors != null)
        {
            pd.setProperty(ERRORS, errors);
        }

        if (extras != null && !extras.isEmpty())
        {
            extras.forEach((k, v) -> setPropertyIfAbsent(pd, k, v));
        }

        return pd;
    }

//    @ExceptionHandler(BaseException.class)
//    public ProblemDetail handleBaseException(BaseException ex)
//    {
//        LOG.warn("Business exception occurred: {}", ex.getMessage());
//
//        ProblemDetail pd = createProblemDetail(ex.getErrorCode().getStatus(), ex.getErrorCode(), ex.getMessage(), null);
//
//        pd.setProperty(TIMESTAMP, Instant.now());
//        pd.setProperty(ERROR_CODE, ex.getErrorCode());
////        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(ex.getErrorCode().getStatus()), ex.getMessage());
//
////        problemDetail.setTitle(ex.getErrorCode().name());
////        problemDetail.setType(URI.create("errors/" + ex.getErrorCode().name().toLowerCase()));
////
//
//        return pd;
//    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleUnknownException(Exception ex)
    {
        LOG.error("Unhandled exception occurred", ex);

//        ProblemDetail pd = createProblemDetail()
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred. Please contact support.");

        problemDetail.setTitle("Internal Server Error");
        problemDetail.setProperty(ERROR_CODE, ErrorCode.INTERNAL_SERVER_ERROR);
        problemDetail.setProperty(TIMESTAMP, Instant.now());

        return problemDetail;
    }

    @Override
    public @NotNull ResponseEntity<@NotNull Object> handleMethodArgumentNotValid(@NotNull MethodArgumentNotValidException ex, @NotNull HttpHeaders headers, @NotNull HttpStatusCode status, @NotNull WebRequest request)
    {
        Map<String, String> errorMap = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> errorMap.put(error.getField(), error.getDefaultMessage()));

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Validation failed for one or more fields.");

        problemDetail.setTitle("Validation Error");
        problemDetail.setType(URI.create("errors/validation-error"));
        problemDetail.setProperty(ERROR_CODE, ErrorCode.VALIDATION_ERROR);
        problemDetail.setProperty(TIMESTAMP, Instant.now());
        problemDetail.setProperty(ERRORS, errorMap); // <--- Vital for Frontend

        return ResponseEntity.of(problemDetail).build();
    }

    @Override
    protected @NotNull ResponseEntity<@NotNull Object> handleExceptionInternal(Exception ex, @Nullable Object body, @NotNull HttpHeaders headers, @NotNull HttpStatusCode statusCode, @NotNull WebRequest request)
    {

        ProblemDetail problemDetail = super.createProblemDetail(ex, statusCode, ex.getMessage(), null, null, request);
        problemDetail.setTitle(ex.getClass().getSimpleName());
        problemDetail.setType(URI.create("errors/" + ex.getClass().getSimpleName().toLowerCase()));

        ErrorCode errorCode = mapStatusToErrorCode(statusCode);

        problemDetail.setProperty(ERROR_CODE, errorCode);
        problemDetail.setProperty(TIMESTAMP, Instant.now());

        return new ResponseEntity<>(problemDetail, headers, statusCode);
    }


    private ErrorCode mapStatusToErrorCode(HttpStatusCode status)
    {
        return switch (status.value())
        {
            case 404 -> ErrorCode.RESOURCE_NOT_FOUND;
            case 400 -> ErrorCode.VALIDATION_ERROR;
            case 403 -> ErrorCode.ACCESS_DENIED;
            case 401 -> ErrorCode.UNAUTHORIZED;
            default -> ErrorCode.INTERNAL_SERVER_ERROR;
        };

    }
}
