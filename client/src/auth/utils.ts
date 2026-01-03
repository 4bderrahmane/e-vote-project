import type {AuthUser, TokenParsed} from "./types";

export function buildUserFromToken(parsed: unknown): AuthUser | undefined {
    if (!parsed || typeof parsed !== "object") return undefined;
    const t = parsed as TokenParsed;
    if (!t.sub) return undefined;

    const resourceRoles: Record<string, string[]> = {};
    for (const [clientId, entry] of Object.entries(t.resource_access ?? {})) {
        resourceRoles[clientId] = entry.roles ?? [];
    }

    return {
        id: t.sub,
        username: t.preferred_username,
        email: t.email,
        name: t.name,
        realmRoles: t.realm_access?.roles ?? [],
        resourceRoles,
    };
}
