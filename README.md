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

### Portainer/Dockhand: `Dockerfile: no such file or directory`

The repository contains a root-level `Dockerfile`. This error usually means that the Compose YAML was pasted into a web editor, so `build.context: .` points to a temporary directory containing only the Compose file. Docker cannot find the rest of the project there.

`container_name: jama-dashboard` is unrelated to the image build and does not need a `:dev` suffix. The `:tag` syntax belongs to an image reference, for example `image: registry.example/jama-dashboard:dev`. That image must already exist in a registry or on the Docker host; adding `:dev` to `container_name` will not build or download anything.

There are two reliable deployment methods:

1. **Build on the Docker host over SSH** — clone the repository, enter its directory and run `./setup-env.sh` followed by `docker compose up -d --build`. The `Dockerfile`, `client/` and `server/` directories must be present beside `docker-compose.yml`.
2. **Use a prebuilt image in Portainer/Dockhand** — build the image on a machine with Docker, publish it to a registry or load it onto the target host, then replace the `build:` block with an explicit `image:` reference in the Compose file.

Portainer documents that Compose build steps are not supported for remote Docker environments in current versions. For such environments, an external image build is the stable approach; a pasted Compose file alone cannot provide the Dockerfile or application source. citeturn656919search0turn656919search6

If using Portainer's Git repository deployment, configure the repository, branch `dev` and Compose file path instead of pasting only the YAML. Still verify whether the Portainer environment is local or remote and whether it supports building from Compose before deploying.

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

### Running a second instance on the same Docker host

The default stack uses application port `8000` and MongoDB host port `27017`. For another instance, add these variables in Dockhand's **Environment variables** section or to that instance's `.env` file:

```dotenv
APP_PORT=8001
MONGODB_PORT=27018
MONGODB_URI=mongodb://127.0.0.1:27018/jama-dashboard-test
APP_CONTAINER_NAME=jama-dashboard-test
MONGO_CONTAINER_NAME=jama-dashboard-test_mongodb
```

Then open the second dashboard at `http://<docker-host>:8001`. Use a different Dockhand stack name as well. The two instances will have separate Compose-managed volumes because the stack names are different.

### Portainer, Dockhand and other web panels

When deploying the Compose file as a Stack/Application, add the variable in the panel's environment-variable section before pressing **Deploy**:

```text
SECRET_KEY = a-long-random-value-generated-on-your-computer
```

For a second instance, add `APP_PORT`, `MONGODB_PORT`, `MONGODB_URI`, `APP_CONTAINER_NAME` and `MONGO_CONTAINER_NAME` in the same section. These values are interpolated by Compose; changing only `container_name` does not change the ports.

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
