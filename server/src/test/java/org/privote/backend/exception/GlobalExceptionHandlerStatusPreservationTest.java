package org.privote.backend.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.ErrorResponseException;
import org.springframework.web.context.request.ServletWebRequest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;

class GlobalExceptionHandlerStatusPreservationTest
{
    private final TestableGlobalExceptionHandler handler = new TestableGlobalExceptionHandler();

    private static ServletWebRequest webRequest(String path)
    {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", path);
        return new ServletWebRequest(request);
    }

    @Test
    void handleErrorResponseExceptionPreservesFrameworkStatus()
    {
        HttpStatusCode frameworkStatus = HttpStatusCode.valueOf(429);
        ErrorResponseException ex = new ErrorResponseException(frameworkStatus);
        ex.setDetail("Rate limit exceeded");

        ResponseEntity<Object> response = handler.invokeHandleErrorResponseException(
                ex,
                frameworkStatus,
                webRequest("/api/test")
        );

        assertEquals(429, response.getStatusCode().value());
        ProblemDetail body = assertInstanceOf(ProblemDetail.class, response.getBody());
        assertEquals(429, body.getStatus());
    }

    @Test
    void handleExceptionInternalPreservesFrameworkStatus()
    {
        HttpStatusCode frameworkStatus = HttpStatusCode.valueOf(415);
        Exception ex = new Exception("Unsupported media type");

        ResponseEntity<Object> response = handler.invokeHandleExceptionInternal(
                ex,
                frameworkStatus,
                webRequest("/api/upload")
        );

        assertEquals(415, response.getStatusCode().value());
        ProblemDetail body = assertInstanceOf(ProblemDetail.class, response.getBody());
        assertEquals(415, body.getStatus());
    }

    private static final class TestableGlobalExceptionHandler extends GlobalExceptionHandler
    {
        private TestableGlobalExceptionHandler()
        {
            this(new ExceptionContextResolver());
        }

        private TestableGlobalExceptionHandler(ExceptionContextResolver contextResolver)
        {
            super(
                    new ExceptionProblemDetailFactory(contextResolver),
                    new ExceptionLogService(contextResolver)
            );
        }

        ResponseEntity<Object> invokeHandleErrorResponseException(
                ErrorResponseException ex,
                HttpStatusCode status,
                ServletWebRequest request
        )
        {
            return super.handleErrorResponseException(ex, HttpHeaders.EMPTY, status, request);
        }

        ResponseEntity<Object> invokeHandleExceptionInternal(
                Exception ex,
                HttpStatusCode status,
                ServletWebRequest request
        )
        {
            return super.handleExceptionInternal(ex, null, HttpHeaders.EMPTY, status, request);
        }
    }
}
