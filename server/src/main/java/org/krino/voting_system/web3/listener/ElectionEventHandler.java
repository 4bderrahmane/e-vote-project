package org.krino.voting_system.web3.listener;

import org.krino.voting_system.web3.listener.events.ElectionDeployedEvent;

public interface ElectionEventHandler
{
    void onElectionDeployed(ElectionDeployedEvent event);
}
