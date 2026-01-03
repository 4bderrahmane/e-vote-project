package org.krino.voting_system.infrastructure.iam;

public interface KeycloakAdminGateway
{
    void disableUser(String userId);

    void logoutUser(String userId);

    void deleteUser(String userId);
}
