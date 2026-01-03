package org.krino.voting_system.dto.election;

import lombok.Data;
import org.krino.voting_system.entity.enums.ElectionPhase;

import java.time.LocalDateTime;

@Data
public class ElectionCreateDto
{
    private String title;

    private String description;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private ElectionPhase status;
}
