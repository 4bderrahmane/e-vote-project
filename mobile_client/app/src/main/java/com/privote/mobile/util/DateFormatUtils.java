package com.privote.mobile.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

public final class DateFormatUtils
{
    private static final String[] INPUT_PATTERNS = {
            "yyyy-MM-dd'T'HH:mm:ss.SSSX",
            "yyyy-MM-dd'T'HH:mm:ssX",
            "yyyy-MM-dd HH:mm:ss",
            "yyyy-MM-dd"
    };

    private DateFormatUtils()
    {
    }

    public static String dateTime(String value)
    {
        if (value == null || value.trim().isEmpty())
        {
            return "-";
        }

        Date date = parse(value.trim());
        if (date == null)
        {
            return value;
        }

        return new SimpleDateFormat("MMM d, yyyy HH:mm", Locale.getDefault()).format(date);
    }

    public static String date(String value)
    {
        if (value == null || value.trim().isEmpty())
        {
            return "-";
        }

        Date date = parse(value.trim());
        if (date == null)
        {
            return value;
        }

        return new SimpleDateFormat("MMM d, yyyy", Locale.getDefault()).format(date);
    }

    private static Date parse(String value)
    {
        for (String pattern : INPUT_PATTERNS)
        {
            try
            {
                SimpleDateFormat format = new SimpleDateFormat(pattern, Locale.US);
                format.setLenient(false);
                if (value.endsWith("Z") || value.contains("+") || value.matches(".*-\\d{2}:?\\d{2}$"))
                {
                    format.setTimeZone(TimeZone.getTimeZone("UTC"));
                }
                return format.parse(value);
            } catch (ParseException ignored)
            {
                // TODO
                // the next supported backend date representation.
            }
        }
        return null;
    }
}
