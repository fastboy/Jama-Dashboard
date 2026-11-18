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

## Quick start with Docker

1. Copy the example environment file and set a private secret:

```bash
cp .env.example .env
```

At minimum, define:

```dotenv
SECRET_KEY=replace-with-a-long-random-secret
MONGODB_URI=mongodb://127.0.0.1:27017/jama-dashboard
```

2. Start the services:

```bash
docker compose up -d
```

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
