package org.krino.voting_system.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import org.krino.voting_system.entity.enums.SystemLogActionStatus;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "system_logs")
public class SystemLog
{
    @Id
    private Long id;

    private Long adminId;

    private SystemLogActionStatus actionStatus;
}