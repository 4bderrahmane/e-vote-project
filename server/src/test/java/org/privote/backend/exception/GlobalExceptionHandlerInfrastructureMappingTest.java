package org.privote.backend.exception;

import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.transaction.CannotCreateTransactionException;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.ServletRequestBindingException;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import static org.junit.jupiter.api.Assertions.*;

class GlobalExceptionHandlerInfrastructureMappingTest
{
    private final TestableGlobalExceptionHandler handler = new TestableGlobalExceptionHandler();

    private static MockHttpServletRequest request(String method, String path)
    {
        return new MockHttpServletRequest(method, path);
    }

    private static ServletWebRequest webRequest(String method, String path)
    {
        return new ServletWebRequest(request(method, path));
    }

    @Test
    void dataIntegrityViolationMapsToConflict()
    {
        ResponseEntity<ProblemDetail> response = handler.handleDataIntegrityViolationException(
                new DataIntegrityViolationException("duplicate key"),
                request("POST", "/api/parties")
        );

        assertEquals(409, response.getStatusCode().value());
        ProblemDetail body = response.getBody();
        assertNotNull(body);
        assertEquals("DATA_CONFLICT", body.getProperties().get("errorCode"));
    }

    @Test
    void optimisticLockingFailureMapsToConflict()
    {
        ResponseEntity<ProblemDetail> response = handler.handleOptimisticLockingFailureException(
                new OptimisticLockingFailureException("row version changed"),
                request("PATCH", "/api/elections")
        );

        assertEquals(409, response.getStatusCode().value());
        ProblemDetail body = response.getBody();
        assertNotNull(body);
        assertEquals("DATA_CONFLICT", body.getProperties().get("errorCode"));
    }

    @Test
    void transactionFailuresMapToInternalServerError()
    {
        ResponseEntity<ProblemDetail> systemResponse = handler.handleTransactionFailureException(
                new TransactionSystemException("commit failed"),
                request("POST", "/api/votes")
        );
        ResponseEntity<ProblemDetail> createResponse = handler.handleTransactionFailureException(
                new CannotCreateTransactionException("connection unavailable"),
                request("POST", "/api/votes")
        );

        assertEquals(500, systemResponse.getStatusCode().value());
        assertEquals(500, createResponse.getStatusCode().value());
        ProblemDetail systemBody = systemResponse.getBody();
        ProblemDetail createBody = createResponse.getBody();
        assertNotNull(systemBody);
        assertNotNull(createBody);
        assertEquals("INTERNAL_SERVER_ERROR", systemBody.getProperties().get("errorCode"));
        assertEquals("INTERNAL_SERVER_ERROR", createBody.getProperties().get("errorCode"));
    }

    @Test
    void unsupportedMediaTypeUsesDedicatedMapping()
    {
        ResponseEntity<Object> response = handler.invokeHandleHttpMediaTypeNotSupported(
                new HttpMediaTypeNotSupportedException("application/xml"),
                HttpStatusCode.valueOf(415),
                webRequest("POST", "/api/upload")
        );

        assertEquals(415, response.getStatusCode().value());
        ProblemDetail body = assertInstanceOf(ProblemDetail.class, response.getBody());
        assertEquals("VALIDATION_ERROR", body.getProperties().get("errorCode"));
        assertEquals("Unsupported media type.", body.getDetail());
    }

    @Test
    void notAcceptableUsesDedicatedMapping()
    {
        ResponseEntity<Object> response = handler.invokeHandleHttpMediaTypeNotAcceptable(
                new HttpMediaTypeNotAcceptableException("not acceptable"),
                HttpStatusCode.valueOf(406),
                webRequest("GET", "/api/elections")
        );

        assertEquals(406, response.getStatusCode().value());
        ProblemDetail body = assertInstanceOf(ProblemDetail.class, response.getBody());
        assertEquals("VALIDATION_ERROR", body.getProperties().get("errorCode"));
        assertEquals("Requested representation is not acceptable.", body.getDetail());
    }

    @Test
    void servletRequestBindingUsesDedicatedMapping()
    {
        ResponseEntity<Object> response = handler.invokeHandleServletRequestBindingException(
                new ServletRequestBindingException("Missing request header 'X-Request-Id'"),
                HttpStatusCode.valueOf(400),
                webRequest("GET", "/api/elections")
        );

        assertEquals(400, response.getStatusCode().value());
        ProblemDetail body = assertInstanceOf(ProblemDetail.class, response.getBody());
        assertEquals("VALIDATION_ERROR", body.getProperties().get("errorCode"));
        assertEquals("Missing request header 'X-Request-Id'", body.getDetail());
    }

    @Test
    void maxUploadSizeUsesDedicatedMapping()
    {
        ResponseEntity<Object> response = handler.invokeHandleMaxUploadSizeExceededException(
                new MaxUploadSizeExceededException(1024),
                HttpStatusCode.valueOf(413),
                webRequest("POST", "/api/upload")
        );

        assertEquals(413, response.getStatusCode().value());
        ProblemDetail body = assertInstanceOf(ProblemDetail.class, response.getBody());
        assertEquals("VALIDATION_ERROR", body.getProperties().get("errorCode"));
        assertEquals("Uploaded payload exceeds the maximum allowed size.", body.getDetail());
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

        ResponseEntity<Object> invokeHandleHttpMediaTypeNotSupported(
                HttpMediaTypeNotSupportedException ex,
                HttpStatusCode status,
                ServletWebRequest request
        )
        {
            return super.handleHttpMediaTypeNotSupported(ex, HttpHeaders.EMPTY, status, request);
        }

        ResponseEntity<Object> invokeHandleHttpMediaTypeNotAcceptable(
                HttpMediaTypeNotAcceptableException ex,
                HttpStatusCode status,
                ServletWebRequest request
        )
        {
            return super.handleHttpMediaTypeNotAcceptable(ex, HttpHeaders.EMPTY, status, request);
        }

        ResponseEntity<Object> invokeHandleServletRequestBindingException(
                ServletRequestBindingException ex,
                HttpStatusCode status,
                ServletWebRequest request
        )
        {
            return super.handleServletRequestBindingException(ex, HttpHeaders.EMPTY, status, request);
        }

        ResponseEntity<Object> invokeHandleMaxUploadSizeExceededException(
                MaxUploadSizeExceededException ex,
                HttpStatusCode status,
                ServletWebRequest request
        )
        {
            return super.handleMaxUploadSizeExceededException(ex, HttpHeaders.EMPTY, status, request);
        }
    }
}
