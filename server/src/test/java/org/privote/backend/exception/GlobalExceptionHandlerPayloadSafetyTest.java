package org.privote.backend.exception;

import jakarta.ws.rs.WebApplicationException;
import org.junit.jupiter.api.Test;
import org.privote.backend.infrastructure.logging.RequestCorrelationFilter;
import org.slf4j.MDC;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class GlobalExceptionHandlerPayloadSafetyTest
{
    private final GlobalExceptionHandler handler = createHandler();

    private static GlobalExceptionHandler createHandler()
    {
        ExceptionContextResolver contextResolver = new ExceptionContextResolver();
        return new GlobalExceptionHandler(
                new ExceptionProblemDetailFactory(contextResolver),
                new ExceptionLogService(contextResolver)
        );
    }

    private static MockHttpServletRequest request(String method, String path)
    {
        return new MockHttpServletRequest(method, path);
    }

    @Test
    void resourceNotFoundPayloadOmitsRejectedValueAndExceptionMetadata()
    {
        ResourceNotFoundException ex = new ResourceNotFoundException("Citizen", "cin", "AB123456");

        ResponseEntity<ProblemDetail> response = handler.handleResourceNotFoundException(
                ex,
                request("GET", "/api/citizens")
        );

        assertEquals(404, response.getStatusCode().value());
        ProblemDetail body = response.getBody();
        assertNotNull(body);
        assertEquals("Citizen not found", body.getDetail());

        Map<String, Object> properties = body.getProperties();
        assertNotNull(properties);
        assertEquals("RESOURCE_NOT_FOUND", properties.get("errorCode"));
        assertFalse(properties.containsKey("resource"));
        assertFalse(properties.containsKey("field"));
        assertFalse(properties.containsKey("value"));
        assertFalse(properties.containsKey("exception"));
    }

    @Test
    void keycloakPayloadUsesSafeMessageWithoutUpstreamContextLeakage()
    {
        KeycloakAdminException ex = KeycloakAdminException.from(
                new WebApplicationException("upstream timeout", 504),
                "user-123",
                "Reset password failed for user-123 due to upstream timeout"
        );

        ResponseEntity<ProblemDetail> response = handler.handleKeycloakAdminException(
                ex,
                request("POST", "/api/admin/users/reset")
        );

        assertEquals(504, response.getStatusCode().value());
        ProblemDetail body = response.getBody();
        assertNotNull(body);
        assertEquals("Identity service request timed out", body.getDetail());

        Map<String, Object> properties = body.getProperties();
        assertNotNull(properties);
        assertEquals("TIMEOUT_OCCURRED", properties.get("errorCode"));
        assertFalse(properties.containsKey("userId"));
        assertFalse(properties.containsKey("upstreamStatus"));
        assertFalse(properties.containsKey("exception"));
    }

    @Test
    void instanceDoesNotIncludeQueryString()
    {
        MockHttpServletRequest request = request("GET", "/api/profile");
        request.setQueryString("token=secret&email=user@example.com");

        ResponseEntity<ProblemDetail> response = handler.handleBaseException(
                new RequestValidationException("Invalid input"),
                request
        );

        ProblemDetail body = response.getBody();
        assertNotNull(body);
        assertEquals("/api/profile", body.getInstance().toString());
    }

    @Test
    void validationPayloadStillContainsFieldErrors()
    {
        BeanPropertyBindingResult bindingResult = new BeanPropertyBindingResult(new Object(), "payload");
        bindingResult.addError(new FieldError("payload", "email", "must be a well-formed email address"));
        BindException ex = new BindException(bindingResult);

        ResponseEntity<Object> response = handler.handleBindException(ex, request("POST", "/api/profile"));
        ProblemDetail body = assertInstanceOf(ProblemDetail.class, response.getBody());

        Map<String, Object> properties = body.getProperties();
        assertNotNull(properties);
        assertTrue(properties.containsKey("errors"));
        Map<?, ?> errors = assertInstanceOf(Map.class, properties.get("errors"));
        List<?> emailErrors = assertInstanceOf(List.class, errors.get("email"));
        assertEquals(List.of("must be a well-formed email address"), emailErrors);
        assertFalse(properties.containsKey("exception"));
    }

    @Test
    void validationPayloadPreservesMultipleMessagesPerField()
    {
        BeanPropertyBindingResult bindingResult = new BeanPropertyBindingResult(new Object(), "payload");
        bindingResult.addError(new FieldError("payload", "email", "must not be blank"));
        bindingResult.addError(new FieldError("payload", "email", "must be a well-formed email address"));
        BindException ex = new BindException(bindingResult);

        ResponseEntity<Object> response = handler.handleBindException(ex, request("POST", "/api/profile"));
        ProblemDetail body = assertInstanceOf(ProblemDetail.class, response.getBody());

        Map<String, Object> properties = body.getProperties();
        assertNotNull(properties);
        Map<?, ?> errors = assertInstanceOf(Map.class, properties.get("errors"));
        List<?> emailErrors = assertInstanceOf(List.class, errors.get("email"));
        assertEquals(2, emailErrors.size());
        assertEquals("must not be blank", emailErrors.get(0));
        assertEquals("must be a well-formed email address", emailErrors.get(1));
    }

    @Test
    void responsePayloadIncludesRequestIdFromMdcWhenPresent()
    {
        MDC.put("requestId", "req-123");
        try
        {
            ResponseEntity<ProblemDetail> response = handler.handleBaseException(
                    new RequestValidationException("Invalid input"),
                    request("GET", "/api/profile")
            );

            ProblemDetail body = response.getBody();
            assertNotNull(body);
            Map<String, Object> properties = body.getProperties();
            assertNotNull(properties);
            assertEquals("req-123", properties.get("requestId"));
        } finally
        {
            MDC.remove("requestId");
        }
    }

    @Test
    void responsePayloadFallsBackToRequestHeaderWhenMdcMissing()
    {
        MockHttpServletRequest request = request("GET", "/api/profile");
        request.addHeader(RequestCorrelationFilter.REQUEST_ID_HEADER, "edge-proxy-req-99");

        ResponseEntity<ProblemDetail> response = handler.handleBaseException(
                new RequestValidationException("Invalid input"),
                request
        );

        ProblemDetail body = response.getBody();
        assertNotNull(body);
        Map<String, Object> properties = body.getProperties();
        assertNotNull(properties);
        assertEquals("edge-proxy-req-99", properties.get("requestId"));
    }
}
