#!/bin/bash
# docker/postgres/init/01-init-databases.sh
#
# Runs ONCE on first initialization of an empty Postgres data directory.
# Creates per-service roles and databases with strict isolation.
#
# To re-run during development:
#   docker compose down
#   docker volume rm privote_postgres_data
#   docker compose up -d

set -euo pipefail

: "${APP_DB_NAME:?APP_DB_NAME is required}"
: "${APP_DB_USER:?APP_DB_USER is required}"
: "${APP_DB_PASSWORD:?APP_DB_PASSWORD is required}"
: "${KEYCLOAK_DB_NAME:?KEYCLOAK_DB_NAME is required}"
: "${KEYCLOAK_DB_USER:?KEYCLOAK_DB_USER is required}"
: "${KEYCLOAK_DB_PASSWORD:?KEYCLOAK_DB_PASSWORD is required}"
: "${PROOF_DB_NAME:?PROOF_DB_NAME is required}"
: "${PROOF_DB_USER:?PROOF_DB_USER is required}"
: "${PROOF_DB_PASSWORD:?PROOF_DB_PASSWORD is required}"

create_role_and_database() {
    local service_name="$1"
    local db_name="$2"
    local db_user="$3"
    local db_password="$4"

    echo "[init] Creating ${service_name} database: ${db_name} (owner: ${db_user})"

    psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER}" --dbname "${POSTGRES_DB}" <<-EOSQL
        CREATE ROLE "${db_user}" WITH LOGIN PASSWORD '${db_password}';
        CREATE DATABASE "${db_name}" OWNER "${db_user}";
        REVOKE ALL ON DATABASE "${db_name}" FROM PUBLIC;
        GRANT CONNECT ON DATABASE "${db_name}" TO "${db_user}";
EOSQL

    echo "[init] Tightening public schema in ${db_name}..."
    psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER}" --dbname "${db_name}" <<-EOSQL
        REVOKE ALL ON SCHEMA public FROM PUBLIC;
        GRANT ALL ON SCHEMA public TO "${db_user}";
EOSQL
}

echo "[init] Creating roles and databases..."

create_role_and_database "application" "${APP_DB_NAME}" "${APP_DB_USER}" "${APP_DB_PASSWORD}"
create_role_and_database "keycloak" "${KEYCLOAK_DB_NAME}" "${KEYCLOAK_DB_USER}" "${KEYCLOAK_DB_PASSWORD}"
create_role_and_database "proof" "${PROOF_DB_NAME}" "${PROOF_DB_USER}" "${PROOF_DB_PASSWORD}"

echo "[init] Done."
echo "[init]   App DB:      ${APP_DB_NAME} (owner: ${APP_DB_USER})"
echo "[init]   Keycloak DB: ${KEYCLOAK_DB_NAME} (owner: ${KEYCLOAK_DB_USER})"
echo "[init]   Proof DB:    ${PROOF_DB_NAME} (owner: ${PROOF_DB_USER})"
