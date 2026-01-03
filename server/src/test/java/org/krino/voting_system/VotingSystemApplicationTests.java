package org.krino.voting_system;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb;MODE=PostgreSQL;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "sync.secret=test-secret",
        "web3j.private-key=0000000000000000000000000000000000000000000000000000000000000001",
        "web3j.election-factory-address=0x0000000000000000000000000000000000000000",
        "web3j.client-address=http://127.0.0.1:8545"
})
class VotingSystemApplicationTests {

    @Test
    void contextLoads() {
    }

}
