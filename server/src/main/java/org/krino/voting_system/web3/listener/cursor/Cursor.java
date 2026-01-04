package org.krino.voting_system.web3.listener.cursor;

import java.math.BigInteger;

public record Cursor(BigInteger nextBlock, BigInteger nextLogIndex)
{
}