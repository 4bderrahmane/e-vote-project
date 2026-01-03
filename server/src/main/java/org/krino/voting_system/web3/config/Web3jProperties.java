package org.krino.voting_system.web3.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "web3j")
public class Web3jProperties
{
    private String clientAddress;
    private long chainId;
    private String privateKey;
    private String electionFactoryAddress;

}
