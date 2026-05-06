package com.privote.mobile.mopro;

import android.content.Context;

import org.bouncycastle.jcajce.provider.digest.Keccak;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.math.BigInteger;
import java.util.List;

import uniffi.mopro.SemaphoreMoproException;
import uniffi.mopro.SemaphoreProofResult;

public final class SemaphoreProver
{
    private static final String ZKEY_ASSET_PATH = "zk/semaphore_20.zkey";
    private static final String ZKEY_DESTINATION = "zk/semaphore_20.zkey";

    private final Context appContext;
    private volatile File cachedZkeyFile;

    public SemaphoreProver(Context context)
    {
        this.appContext = context.getApplicationContext();
    }

    /**
     * Generate a Semaphore-20 proof for an encrypted ballot.
     *
     * @param identitySecretDecimal     Voter Semaphore identity secret as canonical decimal string.
     * @param merkleProofLengthDecimal  Effective merkle depth as canonical decimal string.
     * @param merkleLeafIndexDecimal    Voter's merkle tree leaf index as canonical decimal string.
     * @param merkleSiblingsDecimal     Sibling hashes from leaf to root, each as canonical decimal string.
     * @param ciphertext                Raw encrypted ballot bytes (matches what is sent to the server).
     * @param externalNullifierDecimal  Election external nullifier (scope) as canonical decimal string.
     */
    public SemaphoreProofResult proveVote(
            String identitySecretDecimal,
            String merkleProofLengthDecimal,
            String merkleLeafIndexDecimal,
            List<String> merkleSiblingsDecimal,
            byte[] ciphertext,
            String externalNullifierDecimal
    ) throws SemaphoreMoproException, IOException
    {
        String messageDecimal = hashFieldToSemaphoreSignalDecimal(
                hashCiphertextToFieldDecimal(ciphertext)
        );
        String scopeDecimal = hashFieldToSemaphoreSignalDecimal(externalNullifierDecimal);

        String inputsJson = MoproSemaphore.buildSemaphore20InputsJson(
                identitySecretDecimal,
                merkleProofLengthDecimal,
                merkleLeafIndexDecimal,
                merkleSiblingsDecimal,
                messageDecimal,
                scopeDecimal
        );

        File zkeyFile = ensureZkeyAvailable();
        return MoproSemaphore.proveSemaphore20(zkeyFile.getAbsolutePath(), inputsJson);
    }

    /**
     * Mirrors the Solidity contract's {@code uint256(keccak256(ciphertext)) >> 8}
     * and the web client's {@code hashCiphertextToField}.
     */
    public static String hashCiphertextToFieldDecimal(byte[] ciphertext)
    {
        Keccak.Digest256 digest = new Keccak.Digest256();
        byte[] hash = digest.digest(ciphertext);
        return new BigInteger(1, hash).shiftRight(8).toString();
    }

    /**
     * Mirrors the contract's {@code uint256(keccak256(abi.encodePacked(value))) >> 8}
     * for Semaphore public signal hashing.
     */
    public static String hashFieldToSemaphoreSignalDecimal(String fieldDecimal)
    {
        Keccak.Digest256 digest = new Keccak.Digest256();
        byte[] hash = digest.digest(decimalToBytes32(fieldDecimal));
        return new BigInteger(1, hash).shiftRight(8).toString();
    }

    private static byte[] decimalToBytes32(String fieldDecimal)
    {
        BigInteger value = new BigInteger(fieldDecimal);
        if (value.signum() < 0)
        {
            throw new IllegalArgumentException("field value must be non-negative");
        }

        byte[] raw = value.toByteArray();
        byte[] out = new byte[32];
        int copyLength = Math.min(raw.length, 32);
        System.arraycopy(raw, raw.length - copyLength, out, 32 - copyLength, copyLength);
        return out;
    }

    private File ensureZkeyAvailable() throws IOException
    {
        File local = cachedZkeyFile;
        if (local != null && local.isFile() && local.length() > 0)
        {
            return local;
        }

        synchronized (this)
        {
            File current = cachedZkeyFile;
            if (current != null && current.isFile() && current.length() > 0)
            {
                return current;
            }

            File destination = new File(appContext.getFilesDir(), ZKEY_DESTINATION);
            File parent = destination.getParentFile();
            if (parent != null && !parent.exists() && !parent.mkdirs())
            {
                throw new IOException("Unable to create directory " + parent.getAbsolutePath());
            }

            if (!destination.isFile() || destination.length() == 0)
            {
                copyAssetToFile(destination);
            }

            cachedZkeyFile = destination;
            return destination;
        }
    }

    private void copyAssetToFile(File destination) throws IOException
    {
        try (InputStream in = appContext.getAssets().open(SemaphoreProver.ZKEY_ASSET_PATH);
             OutputStream out = new FileOutputStream(destination))
        {
            byte[] buffer = new byte[64 * 1024];
            int read;
            while ((read = in.read(buffer)) != -1)
            {
                out.write(buffer, 0, read);
            }
            out.flush();
        }
    }
}
