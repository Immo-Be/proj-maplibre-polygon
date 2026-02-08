# Hafenplanungstool Harburg

A SvelteKit-based harbor planning application that uses MapLibre GL for interactive polygon management. The application allows users to visualize, create, edit, and manage harbor berths with boat assignments.

## Features

- Interactive map interface using MapLibre GL
- Polygon drawing and editing for harbor berths
- Boat management with customizable properties (dimensions, color, power requirements)
- Version control for different harbor configurations
- Real-time polygon rotation and dragging
- Authentication system with PocketBase
- Responsive design with mobile support
- Dark mode support

## Tech Stack

- **Frontend**: SvelteKit 2.x, Svelte 5
- **Styling**: TailwindCSS, DaisyUI
- **Mapping**: MapLibre GL, Mapbox GL Draw
- **Database**: PocketBase
- **Deployment**: Docker, Nginx
- **CI/CD**: GitHub Actions

## Project Structure

```
proj-maplibre-polygon/
├── app/                    # SvelteKit application
│   ├── src/
│   │   ├── components/     # Svelte components
│   │   ├── routes/         # SvelteKit routes
│   │   ├── stores/         # Svelte stores
│   │   ├── lib/            # Utility functions
│   │   ├── types/          # TypeScript type definitions
│   │   └── constants.ts    # Application constants
│   ├── static/             # Static assets
│   ├── Dockerfile          # Multi-stage Docker build
│   └── package.json
├── database/               # PocketBase database
│   └── Dockerfile
├── nginx/                  # Nginx reverse proxy
│   ├── Dockerfile
│   └── default.conf
├── docker-compose.yaml     # Docker Compose configuration
└── .github/workflows/      # CI/CD workflows
```

## Prerequisites

- Docker and Docker Compose
- Git

## Environment Variables

### Root `.env`
```bash
APP_PORT=3000
PROD_ORIGIN=https://your-domain.com
```

### App `.env` (`app/.env`)
```bash
VITE_APP_PORT=3000
```

## Development Setup

**This project uses Docker for all development workflows.**

1. Clone the repository:
```bash
git clone <repository-url>
cd proj-maplibre-polygon
```

2. Set the build target to development:
```bash
export BUILD_TARGET=development
```

3. Start all services:
```bash
docker compose up
```

This will start:
- SvelteKit app with hot-reload on port 3000
- PocketBase on port 8090
- Nginx proxy on ports 81 (PocketBase) and 82 (app)

The application will be available at `http://localhost:82` (via Nginx proxy)

### Testing Production Build Locally

To test the production build locally before deploying to VPS:

1. Set the build target to local_staging:
```bash
export BUILD_TARGET=local_staging
```

2. Start all services:
```bash
docker compose up --build
```

This creates an optimized production build running locally, allowing you to verify the production configuration without deploying to the VPS.

## Production Deployment

### Building for Production

The project uses a multi-stage Dockerfile with three build targets:

1. **development**: Hot-reload development environment with live code updates
2. **production**: Optimized production build for VPS deployment
3. **local_staging**: Recreates the production build locally for testing before deployment

### VPS Deployment

1. Ensure the following GitHub secrets are configured:
   - `PAT`: GitHub Personal Access Token for GHCR
   - `SSH_HOST`: VPS hostname
   - `SSH_USER`: SSH username
   - `SSH_PRIVATE_KEY`: SSH private key
   - `WORK_DIR`: Deployment directory on VPS

2. Push to main branch to trigger automatic deployment:
```bash
git push origin main
```

The GitHub Actions workflow will:
- Build Docker images for all services
- Push images to GitHub Container Registry
- SSH into VPS and deploy using Docker Compose

### Manual Deployment

1. Build images:
```bash
BUILD_TARGET=production APP_PORT=3000 docker compose build
```

2. Push to registry:
```bash
docker compose push
```

3. On the VPS, pull and start services:
```bash
docker compose pull
docker compose up -d
```

## Available Scripts

The following npm scripts are available in the `app/` directory, but **note that Docker should be used for development**:

```bash
npm run dev          # Start development server (use Docker instead)
npm run build        # Build for production (handled by Docker)
npm run preview      # Preview production build
npm run check        # Type check
npm run check:watch  # Type check in watch mode
npm run lint         # Lint code
npm run format       # Format code with Prettier
```

For code quality checks, you can run these commands directly or inside the Docker container:
```bash
docker compose exec app npm run check
docker compose exec app npm run lint
docker compose exec app npm run format
```

## Architecture

### Services

1. **App Service**: SvelteKit application with Node.js adapter
2. **PocketBase Service**: Real-time database and authentication
3. **Nginx Service**: Reverse proxy for routing

### Port Configuration

- Port 3000: SvelteKit app (internal)
- Port 8090: PocketBase (internal)
- Port 81: Nginx → PocketBase (external)
- Port 82: Nginx → SvelteKit (external)

### Data Flow

1. User interacts with map interface
2. Frontend stores handle state management
3. Changes are persisted to PocketBase via API routes
4. Real-time updates sync across connected clients

## Key Components

- **MapContainer**: Main map component with polygon interaction
- **Sidebar**: Navigation and feature management
- **BoatManagement**: Boat configuration interface
- **VersionManagement**: Harbor version control
- **Login**: Authentication component

## Database Schema

The application uses PocketBase collections for:
- Polygons (harbor berths)
- Boats
- Versions (harbor configurations)
- Users

## Authentication

Authentication is handled by PocketBase with the following flow:
1. User logs in via Login component
2. Session is stored in PocketBase
3. Protected routes check authentication in hooks
4. Unauthorized users cannot modify polygons

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure tests pass: `npm run check`
4. Format code: `npm run format`
5. Submit a pull request

## Version Control

The project uses semantic versioning. Current version: 1.0.1

To create a new version:
1. Update version in `app/package.json`
2. Commit changes
3. Create a git tag: `git tag v1.0.1`
4. Push tag: `git push origin v1.0.1`

## Troubleshooting

### Port conflicts
If ports are already in use, update them in:
- `.env` (APP_PORT)
- `docker-compose.yaml`
- `nginx/default.conf`

### Database connection issues
Ensure PocketBase is running and accessible on port 8090 (or 81 through Nginx)

### Build failures
Clear Docker cache and rebuild:
```bash
docker compose down -v
docker compose build --no-cache
```

## License

[Specify your license here]

## Support

For issues and questions, please open an issue in the repository.
