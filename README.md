# Payload Blank Template

This template comes configured with the bare minimum to get started on anything you need.

## Quick start

This template can be deployed directly from our Cloud hosting and it will setup MongoDB and cloud S3 object storage for media.

## Quick Start - local setup

To spin up this template locally, follow these steps:

### Clone

After you click the `Deploy` button above, you'll want to have standalone copy of this repo on your machine. If you've already cloned this repo, skip to [Development](#development).

### Development

1. First [clone the repo](#clone) if you have not done so already
2. `cd my-project && cp .env.example .env` to copy the example environment variables. You'll need to add the `MONGODB_URL` from your Cloud project to your `.env` if you want to use S3 storage and the MongoDB database that was created for you.

3. `pnpm install && pnpm dev` to install dependencies and start the dev server
4. open `http://localhost:3000` to open the app in your browser

That's it! Changes made in `./src` will be reflected in your app. Follow the on-screen instructions to login and create your first admin user. Then check out [Production](#production) once you're ready to build and serve your app, and [Deployment](#deployment) when you're ready to go live.

#### Docker (Optional)

If you prefer to use Docker for local development instead of a local MongoDB instance, the provided docker-compose.yml file can be used.

To do so, follow these steps:

- Modify the `MONGODB_URL` in your `.env` file to `mongodb://127.0.0.1/<dbname>`
- Modify the `docker-compose.yml` file's `MONGODB_URL` to match the above `<dbname>`
- Run `docker-compose up` to start the database, optionally pass `-d` to run in the background.

## How it works

The Payload config is tailored specifically to the needs of most websites. It is pre-configured in the following ways:

### Project Structure

This project follows official Payload CMS conventions for organization and maintainability:

```
src/
├── blocks/              # Content blocks with config.ts pattern
├── collections/         # All collection configurations
├── components/          # React components (directory-based)
├── globals/            # Global configurations
├── pages/              # Shared utilities for page-type collections
└── payload.config.ts   # Main Payload configuration
```

**Key Conventions:**

- **Directory-Based Components**: All components follow `ComponentName/index.tsx` pattern
- **Block Organization**: Blocks have dedicated directories with `config.ts` for configuration
- **Collection Location**: Collections are organized in `src/collections/` with hooks co-located
- **Named Exports for Blocks**: Block configs use named exports with `Block` suffix

For details on the structure refactor, see [MIGRATION.md](./MIGRATION.md).

### Collections

See the [Collections](https://payloadcms.com/docs/configuration/collections) docs for details on how to extend this functionality.

- #### Users (Authentication)

  Users are auth-enabled collections that have access to the admin panel.

  For additional help, see the official [Auth Example](https://github.com/payloadcms/payload/tree/main/examples/auth) or the [Authentication](https://payloadcms.com/docs/authentication/overview#authentication-overview) docs.

- #### Pages

  Pages collection for managing website pages with layout builder support. Located in `src/collections/Pages/`.

- #### Blogs

  Blog posts collection with slug generation and revalidation hooks. Located in `src/collections/Blogs/`.

- #### Contacts

  Contact pages collection. Located in `src/collections/Contacts/`.

- #### Legal

  Legal documents collection. Located in `src/collections/Legal/`.

- #### Services

  Services collection for service pages. Located in `src/collections/Services/`.

- #### Media

  This is the uploads enabled collection. It features pre-configured sizes, focal point and manual resizing to help you manage your pictures.

### Blocks

Content blocks for the layout builder:

- **Hero**: Hero section block
- **Content**: Rich content block
- **Call To Action**: CTA block with components
- **Archive**: Archive listing block
- **Banner**: Banner block with components
- **Code**: Code block with syntax highlighting
- **Media Block**: Media display block

All blocks follow the pattern: `src/blocks/BlockName/config.ts`

### Docker

Alternatively, you can use [Docker](https://www.docker.com) to spin up this template locally. To do so, follow these steps:

1. Follow [steps 1 and 2 from above](#development), the docker-compose file will automatically use the `.env` file in your project root
1. Next run `docker-compose up`
1. Follow [steps 4 and 5 from above](#development) to login and create your first admin user

That's it! The Docker instance will help you get up and running quickly while also standardizing the development environment across your teams.

## Questions

If you have any issues or questions, reach out to us on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).
