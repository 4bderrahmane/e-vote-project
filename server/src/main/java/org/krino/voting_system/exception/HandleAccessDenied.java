package org.krino.voting_system.exception;

public class HandleAccessDenied extends RuntimeException
{
    public HandleAccessDenied(String message)
    {
        super(message);
    }
}
