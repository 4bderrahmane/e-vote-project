package com.privote.mobile.mopro;

import java.util.List;

import uniffi.mopro.MoproKt;
import uniffi.mopro.SemaphoreIdentity;
import uniffi.mopro.SemaphoreMoproException;
import uniffi.mopro.SemaphoreProofResult;

public final class MoproSemaphore
{
    private MoproSemaphore()
    {
    }

    public static String buildSemaphore20InputsJson(
            String secret,
            String merkleProofLength,
            String merkleProofIndex,
            List<String> merkleProofSiblings,
            String message,
            String scope
    ) throws SemaphoreMoproException
    {
        return MoproKt.buildSemaphore20InputsJson(
                secret,
                merkleProofLength,
                merkleProofIndex,
                merkleProofSiblings,
                message,
                scope
        );
    }

    public static SemaphoreProofResult proveSemaphore20(
            String zkeyPath,
            String circuitInputsJson
    ) throws SemaphoreMoproException
    {
        return MoproKt.proveSemaphore20(zkeyPath, circuitInputsJson);
    }

    public static boolean verifySemaphore20(
            String zkeyPath,
            String proofJson
    ) throws SemaphoreMoproException
    {
        return MoproKt.verifySemaphore20(zkeyPath, proofJson);
    }

    public static SemaphoreIdentity deriveSemaphoreIdentity(String seed) throws SemaphoreMoproException
    {
        return MoproKt.deriveSemaphoreIdentity(seed);
    }
}
