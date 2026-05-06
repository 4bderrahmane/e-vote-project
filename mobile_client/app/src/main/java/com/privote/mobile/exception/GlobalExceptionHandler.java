package com.privote.mobile.exception;

import android.util.Log;

public class GlobalExceptionHandler implements Thread.UncaughtExceptionHandler
{
    private static final String TAG = "GlobalExceptionHandler";

    private final Thread.UncaughtExceptionHandler defaultHandler;

    public GlobalExceptionHandler(Thread.UncaughtExceptionHandler defaultHandler)
    {
        this.defaultHandler = defaultHandler;
    }

    public static void install()
    {
        Thread.UncaughtExceptionHandler currentHandler = Thread.getDefaultUncaughtExceptionHandler();
        if (!(currentHandler instanceof GlobalExceptionHandler))
        {
            Thread.setDefaultUncaughtExceptionHandler(new GlobalExceptionHandler(currentHandler));
        }
    }

    @Override
    public void uncaughtException(Thread thread, Throwable throwable)
    {
        Log.e(TAG, "Uncaught exception", throwable);
        if (defaultHandler != null)
        {
            defaultHandler.uncaughtException(thread, throwable);
            return;
        }

        android.os.Process.killProcess(android.os.Process.myPid());
        System.exit(10);
    }
}
