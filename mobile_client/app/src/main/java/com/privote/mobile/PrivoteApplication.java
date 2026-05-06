package com.privote.mobile;

import android.app.Application;

import com.privote.mobile.exception.GlobalExceptionHandler;

public class PrivoteApplication extends Application
{
    @Override
    public void onCreate()
    {
        super.onCreate();
        GlobalExceptionHandler.install();
    }
}
