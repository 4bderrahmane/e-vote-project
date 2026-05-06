package com.privote.mobile.ui.auth;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.privote.mobile.MainActivity;
import com.privote.mobile.auth.AuthManager;
import com.privote.mobile.databinding.ActivityLoginBinding;

public class LoginActivity extends AppCompatActivity
{

    private static final int RC_AUTH = 100;

    private ActivityLoginBinding binding;
    private AuthManager authManager;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        binding = ActivityLoginBinding.inflate(getLayoutInflater());
        authManager = AuthManager.getInstance(this);
        setContentView(binding.getRoot());

        binding.btnCreateAccount.setOnClickListener(v -> startLogin());
        binding.btnLogin.setOnClickListener(v -> startLogin());
    }

    private void startLogin()
    {
        binding.btnCreateAccount.setEnabled(false);
        binding.btnLogin.setEnabled(false);
        binding.progressBar.setVisibility(View.VISIBLE);
        authManager.startLoginFlow(this, RC_AUTH, new AuthManager.AuthCallback()
        {
            @Override
            public void onSuccess()
            {
                // Success is handled after redirect + token exchange in onActivityResult.
            }

            @Override
            public void onError(String message)
            {
                runOnUiThread(() ->
                {
                    Toast.makeText(LoginActivity.this, "Login failed: " + message, Toast.LENGTH_LONG).show();
                    resetUi();
                });
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data)
    {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != RC_AUTH || data == null)
        {
            resetUi();
            return;
        }

        authManager.handleAuthorizationResponse(data, new AuthManager.AuthCallback()
        {
            @Override
            public void onSuccess()
            {
                runOnUiThread(() ->
                {
                    startActivity(new Intent(LoginActivity.this, MainActivity.class));
                    finish();
                });
            }

            @Override
            public void onError(String message)
            {
                runOnUiThread(() ->
                {
                    Toast.makeText(LoginActivity.this, "Login failed: " + message, Toast.LENGTH_LONG).show();
                    resetUi();
                });
            }
        });
    }

    private void resetUi()
    {
        binding.btnCreateAccount.setEnabled(true);
        binding.btnLogin.setEnabled(true);
        binding.progressBar.setVisibility(View.GONE);
    }
}
