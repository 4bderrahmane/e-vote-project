package com.privote.mobile.exception;

public class AppError
{
    public enum Kind
    {
        NETWORK,
        HTTP,
        VALIDATION,
        CRYPTO,
        PROOF,
        UNKNOWN
    }

    public final Kind kind;
    public final String message;
    public final Throwable cause;

    private AppError(Kind kind, String message, Throwable cause)
    {
        this.kind = kind;
        this.message = message;
        this.cause = cause;
    }

    public static AppError network(String operation, Throwable cause)
    {
        return new AppError(Kind.NETWORK, operation + " failed: " + userMessage(cause), cause);
    }

    public static AppError http(String operation, int statusCode)
    {
        return new AppError(Kind.HTTP, operation + " failed: HTTP " + statusCode, null);
    }

    public static AppError validation(String message)
    {
        return new AppError(Kind.VALIDATION, message, null);
    }

    public static AppError crypto(String operation, Throwable cause)
    {
        return new AppError(Kind.CRYPTO, operation + " failed: " + userMessage(cause), cause);
    }

    public static AppError proof(String operation, Throwable cause)
    {
        return new AppError(Kind.PROOF, operation + " failed: " + userMessage(cause), cause);
    }

    public static AppError unknown(String operation, Throwable cause)
    {
        return new AppError(Kind.UNKNOWN, operation + " failed: " + userMessage(cause), cause);
    }

    public static String userMessage(Throwable throwable)
    {
        if (throwable == null)
        {
            return "Unknown error";
        }

        String message = throwable.getMessage();
        if (message == null || message.trim().isEmpty())
        {
            return throwable.getClass().getSimpleName();
        }
        return message;
    }
}
