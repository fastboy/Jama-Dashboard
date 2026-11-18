#!/usr/bin/env bash
set -euo pipefail

ENV_FILE=".env"

if [[ -f "$ENV_FILE" ]]; then
    if grep -Eq '^SECRET_KEY=[^[:space:]]+$' "$ENV_FILE" \
        && ! grep -Eq '^SECRET_KEY=(replace-with-a-long-random-secret)?$' "$ENV_FILE"; then
        echo "$ENV_FILE already contains SECRET_KEY; nothing to do."
        exit 0
    fi

    echo "$ENV_FILE exists but SECRET_KEY is missing or still a placeholder." >&2
    echo "Edit $ENV_FILE or remove it and run this script again." >&2
    exit 1
fi

if command -v openssl >/dev/null 2>&1; then
    SECRET_KEY="$(openssl rand -hex 32)"
elif command -v python3 >/dev/null 2>&1; then
    SECRET_KEY="$(python3 -c 'import secrets; print(secrets.token_hex(32))')"
else
    echo "Neither openssl nor python3 is available. Generate SECRET_KEY manually." >&2
    exit 1
fi

umask 077
cat > "$ENV_FILE" <<EOF
# Generated locally. Do not commit or share this file.
SECRET_KEY=$SECRET_KEY
MONGODB_URI=mongodb://127.0.0.1:27017/jama-dashboard
EOF

chmod 600 "$ENV_FILE"
echo "Created $ENV_FILE with a new random SECRET_KEY."
echo "Next: docker compose config && docker compose up -d"
