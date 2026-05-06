package com.privote.mobile;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.fragment.app.Fragment;

import com.privote.mobile.auth.AuthManager;
import com.privote.mobile.ui.PlaceholderFragment;
import com.privote.mobile.ui.admin.AdminCreateFragment;
import com.privote.mobile.ui.auth.LoginActivity;
import com.privote.mobile.ui.elections.ElectionListFragment;
import com.privote.mobile.ui.myvotes.MyVotesFragment;
import com.privote.mobile.ui.parties.PartiesFragment;
import com.privote.mobile.ui.profile.ProfileFragment;
import com.privote.mobile.ui.results.ResultsFragment;

public class MainActivity extends AppCompatActivity
{
    private static final int RC_LOGOUT = 200;
    private AuthManager authManager;
    private AuthManager.AppRole activeRole;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

        authManager = AuthManager.getInstance(this);
        if (!authManager.isLoggedIn())
        {
            startActivity(new Intent(this, LoginActivity.class));
            finish();
            return;
        }

        activeRole = authManager.getActiveRole();

        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) ->
        {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, 0);
            return insets;
        });

        findViewById(R.id.btnLogout).setOnClickListener(v -> startLogout());
        setupRoleSwitch();
        setupNavigation();

        if (savedInstanceState == null)
        {
            showSection(R.id.nav_elections);
        }
    }

    private void setupNavigation()
    {
        com.google.android.material.bottomnavigation.BottomNavigationView bottomNav = findViewById(R.id.bottomNav);
        bottomNav.getMenu().clear();
        bottomNav.inflateMenu(activeRole == AuthManager.AppRole.ADMIN ? R.menu.admin_bottom_nav : R.menu.main_bottom_nav);
        bottomNav.setOnItemSelectedListener(item ->
        {
            showSection(item.getItemId());
            return true;
        });
        bottomNav.setSelectedItemId(R.id.nav_elections);
    }

    private void setupRoleSwitch()
    {
        TextView roleSwitch = findViewById(R.id.btnRoleSwitch);
        if (!authManager.isAdminUser())
        {
            roleSwitch.setVisibility(View.GONE);
            return;
        }

        roleSwitch.setVisibility(View.VISIBLE);
        roleSwitch.setText(activeRole == AuthManager.AppRole.ADMIN
                ? getString(R.string.admin_mode)
                : getString(R.string.citizen_mode));
        roleSwitch.setOnClickListener(v ->
        {
            activeRole = activeRole == AuthManager.AppRole.ADMIN
                    ? AuthManager.AppRole.CITIZEN
                    : AuthManager.AppRole.ADMIN;
            authManager.setActiveRole(activeRole);
            setupRoleSwitch();
            setupNavigation();
        });
    }

    private void showSection(int itemId)
    {
        Fragment fragment;
        if (itemId == R.id.nav_dashboard)
        {
            fragment = PlaceholderFragment.newInstance(
                    getString(R.string.dashboard),
                    getString(R.string.dashboard_placeholder)
            );
        } else if (itemId == R.id.nav_votes)
        {
            fragment = new MyVotesFragment();
        } else if (itemId == R.id.nav_results)
        {
            fragment = new ResultsFragment();
        } else if (itemId == R.id.nav_profile)
        {
            fragment = new ProfileFragment();
        } else if (itemId == R.id.nav_create_election)
        {
            fragment = new AdminCreateFragment();
        } else if (itemId == R.id.nav_parties)
        {
            fragment = new PartiesFragment();
        } else
        {
            fragment = new ElectionListFragment();
        }

        getSupportFragmentManager()
                .beginTransaction()
                .replace(R.id.contentContainer, fragment)
                .commit();
    }

    public void startLogout()
    {
        AuthManager.getInstance(this).startLogoutFlow(this, RC_LOGOUT, new AuthManager.AuthCallback()
        {
            @Override
            public void onSuccess()
            {
                goToLogin();
            }

            @Override
            public void onError(String message)
            {
                runOnUiThread(() -> Toast.makeText(
                        MainActivity.this,
                        "Logout failed: " + message,
                        Toast.LENGTH_LONG
                ).show());
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data)
    {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != RC_LOGOUT)
        {
            return;
        }

        AuthManager.getInstance(this).handleLogoutResponse(data, new AuthManager.AuthCallback()
        {
            @Override
            public void onSuccess()
            {
                goToLogin();
            }

            @Override
            public void onError(String message)
            {
                runOnUiThread(() -> Toast.makeText(
                        MainActivity.this,
                        "Logout failed: " + message,
                        Toast.LENGTH_LONG
                ).show());
            }
        });
    }

    private void goToLogin()
    {
        runOnUiThread(() ->
        {
            Intent intent = new Intent(this, LoginActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
        });
    }
}
