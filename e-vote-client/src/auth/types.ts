export type AuthStatus = "checking" | "authenticated" | "anonymous" | "error";

export type AuthUser = {
    id: string;
    username?: string;
    email?: string;
    name?: string;
    realmRoles: string[];
    resourceRoles: Record<string, string[]>;
};

export type AuthState =
    | { status: "checking" }
    | { status: "anonymous" }
    | { status: "error"; error: string }
    | { status: "authenticated"; token: string; user: AuthUser };

export type AuthContextValue = AuthState & {
    login: (redirectUri?: string) => Promise<void>;
    register: (redirectUri?: string) => Promise<void>;
    logout: (redirectUri?: string) => Promise<void>;
    getValidToken: (minValiditySeconds?: number) => Promise<string>;
};

export type TokenParsed = {
    sub?: string;
    preferred_username?: string;
    email?: string;
    name?: string;
    realm_access?: { roles?: string[] };
    resource_access?: Record<string, { roles?: string[] }>;
}

export type Action =
    | { type: "CHECKING" }
    | { type: "ANON" }
    | { type: "AUTH"; token: string; user: AuthUser }
    | { type: "ERROR"; error: string };
