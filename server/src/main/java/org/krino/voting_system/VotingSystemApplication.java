package org.krino.voting_system;

import org.krino.voting_system.infrastructure.iam.config.KeycloakAdminProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@EnableConfigurationProperties(KeycloakAdminProperties.class)
@SpringBootApplication
@ConfigurationPropertiesScan
public class VotingSystemApplication
{

    public static void main(String[] args)
    {
        SpringApplication.run(VotingSystemApplication.class, args);
    }

}