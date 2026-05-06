package com.privote.mobile.mopro;

import org.bouncycastle.crypto.generators.Argon2BytesGenerator;
import org.bouncycastle.crypto.params.Argon2Parameters;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Locale;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import uniffi.mopro.SemaphoreIdentity;
import uniffi.mopro.SemaphoreMoproException;

/**
 * Deterministic Semaphore-v4 identity derivation from a user passphrase.
 *
 * <p>Mirrors the web client's password-based key derivation: Argon2id over the
 * passphrase produces a master secret, an HMAC-SHA256 step domain-separates by
 * election, and the resulting seed is fed into the mopro FFI to compute the
 * Baby Jubjub identity (secret scalar + commitment).
 *
 * <p>The same passphrase + same user id + same election always produces the
 * same identity, so the user can re-derive at registration and vote time
 * without persisting anything secret on the device.
 */
public final class IdentityDeriver
{
    private static final int ARGON2_ITERATIONS = 3;
    private static final int ARGON2_MEMORY_KIB = 64 * 1024;
    private static final int ARGON2_PARALLELISM = 1;
    private static final int MASTER_SECRET_BYTES = 32;
    private static final String HMAC_ALGORITHM = "HmacSHA256";
    private static final String SALT_PREFIX = "privote-mobile-identity-v1:user:";
    private static final String SCOPE_PREFIX = "semaphore-election:externalNullifier:";

    private IdentityDeriver()
    {
    }

    public static SemaphoreIdentity derive(
            String passphrase,
            String userId,
            String electionExternalNullifierDecimal
    ) throws SemaphoreMoproException
    {
        if (passphrase == null || passphrase.isEmpty())
        {
            throw new IllegalArgumentException("passphrase must not be empty");
        }
        if (userId == null || userId.isEmpty())
        {
            throw new IllegalArgumentException("userId must not be empty");
        }
        if (electionExternalNullifierDecimal == null || electionExternalNullifierDecimal.isEmpty())
        {
            throw new IllegalArgumentException("election external nullifier must not be empty");
        }

        byte[] masterSecret = null;
        byte[] electionSeed = null;
        try
        {
            masterSecret = argon2id(
                    passphrase.getBytes(StandardCharsets.UTF_8),
                    (SALT_PREFIX + userId).getBytes(StandardCharsets.UTF_8)
            );
            byte[] scope = (SCOPE_PREFIX + normalizeDecimal(electionExternalNullifierDecimal))
                    .getBytes(StandardCharsets.UTF_8);
            electionSeed = hmacSha256(masterSecret, scope);
            return MoproSemaphore.deriveSemaphoreIdentity(toHex(electionSeed));
        }
        finally
        {
            if (masterSecret != null) zero(masterSecret);
            if (electionSeed != null) zero(electionSeed);
        }
    }

    private static byte[] argon2id(byte[] password, byte[] salt)
    {
        Argon2Parameters params = new Argon2Parameters.Builder(Argon2Parameters.ARGON2_id)
                .withVersion(Argon2Parameters.ARGON2_VERSION_13)
                .withIterations(ARGON2_ITERATIONS)
                .withMemoryAsKB(ARGON2_MEMORY_KIB)
                .withParallelism(ARGON2_PARALLELISM)
                .withSalt(salt)
                .build();

        Argon2BytesGenerator generator = new Argon2BytesGenerator();
        generator.init(params);
        byte[] out = new byte[MASTER_SECRET_BYTES];
        generator.generateBytes(password, out);
        return out;
    }

    private static byte[] hmacSha256(byte[] key, byte[] data)
    {
        try
        {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            mac.init(new SecretKeySpec(key, HMAC_ALGORITHM));
            return mac.doFinal(data);
        }
        catch (Exception e)
        {
            throw new IllegalStateException("HMAC-SHA256 unavailable", e);
        }
    }

    private static String normalizeDecimal(String value)
    {
        String trimmed = value.trim();
        if (!trimmed.matches("\\d+"))
        {
            throw new IllegalArgumentException("external nullifier must be a decimal string");
        }
        return trimmed.replaceFirst("^0+(?=\\d)", "");
    }

    private static String toHex(byte[] bytes)
    {
        StringBuilder builder = new StringBuilder(bytes.length * 2);
        for (byte value : bytes)
        {
            builder.append(String.format(Locale.ROOT, "%02x", value & 0xff));
        }
        return builder.toString();
    }

    private static void zero(byte[] bytes)
    {
        Arrays.fill(bytes, (byte) 0);
    }
}
