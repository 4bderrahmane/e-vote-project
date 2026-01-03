package org.krino.voting_system.exception;

import lombok.Getter;
import org.krino.voting_system.utilities.ErrorCode;

@Getter
public abstract class BaseException extends RuntimeException
{
    private final ErrorCode errorCode;

    protected BaseException(ErrorCode errorCode, String message)
    {
        super(message);
        this.errorCode = errorCode;
    }

}
