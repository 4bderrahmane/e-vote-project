package org.krino.voting_system.exception;

public class VoteAlreadyCastException extends RuntimeException
{
    public VoteAlreadyCastException(String message)
    {
        super(message);
    }
}
