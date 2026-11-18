# Jama-Dashboard

Jama-Dashboard is a self-hosted home-lab dashboard for links, categories, tasks, snippets, pages, network devices, integrations, themes and user accounts.

The project is maintained as a fork under the **Jama-Dashboard** name. The runtime branding uses `Jama-Dashboard`; use `jama-dashboard` for package names, container names, paths and environment identifiers.

## Features

- Multi-user accounts and profile settings
- Link and category organization
- Featured listings and custom pages
- Todo and code-snippet management
- Network-device discovery and Wake-on-LAN
- TOTP authenticator support
- Custom themes and icon packs
- Optional self-hosted integrations
- Docker-based deployment with MongoDB

## Repository branches

- `main` — stable baseline
- `brand` — project identity, branding and external-reference cleanup
- `dev` — feature development based on the completed `brand` branch

## Quick start with Docker Compose

The Compose file intentionally requires a private `SECRET_KEY`. It must not have a default value in the repository: the key signs login tokens and must be different on every installation.

### Docker Compose CLI

The easiest method is the included setup script. Run it from the directory containing `docker-compose.yml`:

```bash
./setup-env.sh
```

The script creates a local, gitignored `.env` file and generates a random `SECRET_KEY` using `openssl`. If OpenSSL is unavailable, it uses Python's `secrets` module. It does not overwrite an existing `.env` file.

Then validate and start the stack:

```bash
docker compose config
docker compose up -d
docker compose ps
```

To view startup logs:

```bash
docker compose logs --tail=200
```

### Manual `.env` setup

If you prefer to create the file yourself:

```bash
cp .env.example .env
openssl rand -hex 32
```

Copy the generated value into `.env`:

```dotenv
SECRET_KEY=paste-the-generated-random-value-here
MONGODB_URI=mongodb://127.0.0.1:27017/jama-dashboard
```

Keep `.env` private. Never commit it or paste its `SECRET_KEY` into a public issue, repository or chat.

### Portainer, Dockhand and other web panels

When deploying the Compose file as a Stack/Application, add the variable in the panel's environment-variable section before pressing **Deploy**:

```text
SECRET_KEY = a-long-random-value-generated-on-your-computer
```

Generate the value locally with either:

```bash
openssl rand -hex 32
```

or:

```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

Do not use a shared example value. Every installation should have its own key. If the panel supports uploading an `.env` file, you can run `./setup-env.sh` locally and upload that file instead. The `.env` file is intentionally excluded from Git.

The application uses host networking because network-device scanning requires access to the host LAN. Review the compose file and firewall policy before exposing the dashboard outside the trusted network.

On the first start, open the dashboard in a browser and complete the **Initial setup** form. There is no factory username or password. The first account becomes the super administrator. Passwords are stored with Argon2id; older MD5 hashes are accepted only for migration and are upgraded after a successful login. The one-time setup marker remains completed even if the administrator account is later deleted.

## Development

Install the root, server and client dependencies:

```bash
npm install
npm run postinstall
```

Run the backend and frontend in separate terminals:

```bash
npm run dev:be
npm run dev:fe
```

## Optional app catalog

The remote app catalog is disabled unless configured explicitly. To use a trusted catalog, set:

```dotenv
APP_CATALOG_BASE_URL=https://example.invalid/catalog
```

The client-side catalog URL can be configured with:

```dotenv
VITE_APP_CATALOG_URL=https://example.invalid/catalog/apps.json
```

Do not use an untrusted catalog in production. Uploaded integrations execute application code and should be reviewed before installation.

## Support

Open an issue in the repository for bugs, feature requests and deployment questions:

- https://github.com/fastboy/Jama-Dashboard/issues

## License

This project is distributed under the GNU General Public License, version 3. See [LICENSE](LICENSE).

## Contributing

Use a feature or fix branch, run the relevant checks, and open a pull request against `dev`. Keep `main` reserved for stable releases.
