package com.privote.mobile.crypto;

import android.util.Base64;

import com.privote.mobile.exception.ElectionPayloadEncryptionException;

import org.bouncycastle.crypto.digests.SHA256Digest;
import org.bouncycastle.crypto.generators.HKDFBytesGenerator;
import org.bouncycastle.crypto.params.HKDFParameters;
import org.bouncycastle.math.ec.rfc7748.X25519;
import org.json.JSONException;
import org.json.JSONObject;

import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Locale;
import java.util.UUID;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;

public final class ElectionPayloadEncryptor
{
    private static final int PAYLOAD_VERSION_CONTEXT_BOUND = 2;
    private static final int X25519_PUBLIC_KEY_BYTES = 32;
    private static final int X25519_PRIVATE_KEY_BYTES = 32;
    private static final int SHARED_SECRET_BYTES = 32;
    private static final int PAYLOAD_SALT_BYTES = 16;
    private static final int AES_GCM_IV_BYTES = 12;
    private static final int AES_GCM_KEY_BYTES = 32;
    private static final int PAYLOAD_CONTEXT_HASH_BYTES = 32;
    private static final int PAYLOAD_HEADER_V1_BYTES =
            1 + X25519_PUBLIC_KEY_BYTES + PAYLOAD_SALT_BYTES + AES_GCM_IV_BYTES;
    private static final int PAYLOAD_HEADER_V2_BYTES =
            PAYLOAD_HEADER_V1_BYTES + PAYLOAD_CONTEXT_HASH_BYTES;
    private static final String PAYLOAD_INFO_V2_PREFIX = "privote-election-payload-v2";
    private static final String PAYLOAD_CONTEXT_LABEL = "privote-election-payload-context-v2";
    private static final String DEFAULT_PAYLOAD_PROTOCOL_DOMAIN = "privote:election-ballot";

    private static final SecureRandom RANDOM = new SecureRandom();

    private ElectionPayloadEncryptor()
    {
    }

    public static byte[] encryptCandidateSelection(
            UUID candidatePublicId,
            UUID electionPublicId,
            String electionPublicKeyBase64
    ) throws ElectionPayloadEncryptionException
    {
        String plaintext = buildCandidateSelectionPlaintext(candidatePublicId);
        byte[] publicKey = decodePublicKey(electionPublicKeyBase64);
        byte[] fingerprint = publicKeyFingerprint(publicKey);
        if (electionPublicId == null)
        {
            throw new ElectionPayloadEncryptionException("Election public ID is required", null);
        }

        byte[] contextHash = payloadContextHash(
                electionPublicId.toString(),
                toHex(fingerprint)
        );
        return encrypt(
                plaintext.getBytes(StandardCharsets.UTF_8),
                publicKey,
                contextHash
        );
    }

    private static byte[] encrypt(byte[] plaintext, byte[] recipientPublicKey, byte[] contextHash)
            throws ElectionPayloadEncryptionException
    {
        byte[] ephemeralPrivateKey = new byte[X25519_PRIVATE_KEY_BYTES];
        byte[] ephemeralPublicKey = new byte[X25519_PUBLIC_KEY_BYTES];
        byte[] sharedSecret = new byte[SHARED_SECRET_BYTES];
        byte[] salt = new byte[PAYLOAD_SALT_BYTES];
        byte[] iv = new byte[AES_GCM_IV_BYTES];

        try
        {
            X25519.generatePrivateKey(RANDOM, ephemeralPrivateKey);
            X25519.generatePublicKey(ephemeralPrivateKey, 0, ephemeralPublicKey, 0);
            if (!X25519.calculateAgreement(
                    ephemeralPrivateKey,
                    0,
                    recipientPublicKey,
                    0,
                    sharedSecret,
                    0
            ))
            {
                throw new IllegalArgumentException("Invalid X25519 shared secret");
            }

            RANDOM.nextBytes(salt);
            RANDOM.nextBytes(iv);

            byte[] header = buildPayloadHeaderV2(ephemeralPublicKey, salt, iv, contextHash);
            byte[] payloadInfo = concat(
                    PAYLOAD_INFO_V2_PREFIX.getBytes(StandardCharsets.UTF_8),
                    contextHash
            );
            byte[] aesKey = hkdfSha256(sharedSecret, salt, payloadInfo, AES_GCM_KEY_BYTES);
            byte[] encrypted = aesGcmEncrypt(plaintext, aesKey, iv, header);
            return concat(header, encrypted);
        }
        catch (GeneralSecurityException | IllegalArgumentException e)
        {
            throw new ElectionPayloadEncryptionException("Failed to encrypt payload", e);
        }
        finally
        {
            zero(ephemeralPrivateKey);
            zero(ephemeralPublicKey);
            zero(sharedSecret);
            zero(salt);
            zero(iv);
        }
    }

    private static byte[] decodePublicKey(String value)
            throws ElectionPayloadEncryptionException
    {
        if (value == null || value.trim().isEmpty())
        {
            throw new ElectionPayloadEncryptionException("Election encryption public key is missing", null);
        }

        String normalized = value.trim();
        if (containsWhitespace(normalized))
        {
            throw new ElectionPayloadEncryptionException(
                    "Election encryption public key must be Base64 without whitespace",
                    null
            );
        }

        byte[] decoded;
        try
        {
            decoded = Base64.decode(normalized, Base64.NO_WRAP);
        }
        catch (IllegalArgumentException e)
        {
            throw new ElectionPayloadEncryptionException("Election encryption public key is invalid Base64", e);
        }

        if (decoded.length != X25519_PUBLIC_KEY_BYTES)
        {
            throw new ElectionPayloadEncryptionException("Election encryption public key must be 32 bytes", null);
        }
        return decoded;
    }

    private static byte[] publicKeyFingerprint(byte[] publicKey)
            throws ElectionPayloadEncryptionException
    {
        byte[] digest = sha256(publicKey);
        byte[] fingerprint = new byte[16];
        System.arraycopy(digest, 0, fingerprint, 0, fingerprint.length);
        return fingerprint;
    }

    private static byte[] payloadContextHash(String electionId, String publicKeyFingerprintHex)
            throws ElectionPayloadEncryptionException
    {
        try
        {
            String aad = structuredAad(PAYLOAD_CONTEXT_LABEL,
                    "protocolDomain", DEFAULT_PAYLOAD_PROTOCOL_DOMAIN,
                    "electionId", electionId.trim(),
                    "publicKeyFingerprint", publicKeyFingerprintHex.trim().toLowerCase(Locale.ROOT)
            );
            return sha256(aad.getBytes(StandardCharsets.UTF_8));
        }
        catch (IllegalArgumentException e)
        {
            throw new ElectionPayloadEncryptionException("Failed to build payload context", e);
        }
    }

    private static String structuredAad(String label, String... fields)
    {
        if (label == null)
        {
            throw new IllegalArgumentException("AAD label is required");
        }

        if (fields == null || fields.length % 2 != 0)
        {
            throw new IllegalArgumentException("AAD fields must be key/value pairs");
        }

        StringBuilder builder = new StringBuilder(label);
        for (int i = 0; i < fields.length; i += 2)
        {
            String key = fields[i];
            String value = fields[i + 1];
            if (key == null || value == null)
            {
                throw new IllegalArgumentException("AAD field keys and values are required");
            }

            builder.append('|')
                    .append(utf8Length(key))
                    .append(':')
                    .append(key)
                    .append(':')
                    .append(utf8Length(value))
                    .append(':')
                    .append(value);
        }
        return builder.toString();
    }

    private static String buildCandidateSelectionPlaintext(UUID candidatePublicId)
            throws ElectionPayloadEncryptionException
    {
        if (candidatePublicId == null)
        {
            throw new ElectionPayloadEncryptionException("Candidate public ID is required", null);
        }

        try
        {
            JSONObject payload = new JSONObject();
            payload.put("candidatePublicId", candidatePublicId.toString());
            return payload.toString();
        }
        catch (JSONException e)
        {
            throw new ElectionPayloadEncryptionException("Failed to build ballot payload", e);
        }
    }

    private static boolean containsWhitespace(String value)
    {
        for (int i = 0; i < value.length(); i++)
        {
            if (Character.isWhitespace(value.charAt(i)))
            {
                return true;
            }
        }
        return false;
    }

    private static int utf8Length(String value)
    {
        return value.getBytes(StandardCharsets.UTF_8).length;
    }

    private static byte[] buildPayloadHeaderV2(
            byte[] ephemeralPublicKey,
            byte[] salt,
            byte[] iv,
            byte[] contextHash
    )
    {
        byte[] header = new byte[PAYLOAD_HEADER_V2_BYTES];
        int offset = 0;
        header[offset] = (byte) PAYLOAD_VERSION_CONTEXT_BOUND;
        offset += 1;
        System.arraycopy(ephemeralPublicKey, 0, header, offset, X25519_PUBLIC_KEY_BYTES);
        offset += X25519_PUBLIC_KEY_BYTES;
        System.arraycopy(salt, 0, header, offset, PAYLOAD_SALT_BYTES);
        offset += PAYLOAD_SALT_BYTES;
        System.arraycopy(iv, 0, header, offset, AES_GCM_IV_BYTES);
        offset += AES_GCM_IV_BYTES;
        System.arraycopy(contextHash, 0, header, offset, PAYLOAD_CONTEXT_HASH_BYTES);
        return header;
    }

    private static byte[] hkdfSha256(byte[] ikm, byte[] salt, byte[] info, int length)
    {
        HKDFBytesGenerator hkdf = new HKDFBytesGenerator(new SHA256Digest());
        hkdf.init(new HKDFParameters(ikm, salt, info));
        byte[] out = new byte[length];
        hkdf.generateBytes(out, 0, out.length);
        return out;
    }

    private static byte[] aesGcmEncrypt(byte[] plaintext, byte[] key, byte[] iv, byte[] aad)
            throws GeneralSecurityException
    {
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(
                Cipher.ENCRYPT_MODE,
                new SecretKeySpec(key, "AES"),
                new GCMParameterSpec(128, iv)
        );
        cipher.updateAAD(aad);
        return cipher.doFinal(plaintext);
    }

    private static byte[] sha256(byte[] input)
            throws ElectionPayloadEncryptionException
    {
        try
        {
            return MessageDigest.getInstance("SHA-256").digest(input);
        } catch (GeneralSecurityException e)
        {
            throw new ElectionPayloadEncryptionException("SHA-256 not available", e);
        }
    }

    private static byte[] concat(byte[] left, byte[] right)
    {
        byte[] out = new byte[left.length + right.length];
        System.arraycopy(left, 0, out, 0, left.length);
        System.arraycopy(right, 0, out, left.length, right.length);
        return out;
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
