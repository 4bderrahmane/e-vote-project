package com.privote.mobile.network.dto;

import java.util.UUID;

public class ElectionDto
{
    public UUID publicId;
    public String title;
    public String description;
    public String startTime;
    public String endTime;
    public String phase;           // REGISTRATION | VOTING | TALLY
    public String contractAddress;
    public String createdAt;
    public String updatedAt;
}
