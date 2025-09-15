#!/bin/bash

# Deployment script for Strapi CMS
# Fixes Docker deprecation warnings and container management

set -e

PROJECT_NAME="y0o4w84ckoockck8o0ss8s48"
IMAGE_TAG="${SOURCE_COMMIT:-latest}"

echo "Starting deployment of ${PROJECT_NAME}..."

# Clean up orphaned containers
echo "Cleaning up orphaned containers..."
docker container prune -f --filter "label=com.docker.compose.project=${PROJECT_NAME}" 2>/dev/null || true

# Stop containers using --timeout instead of deprecated --time
echo "Stopping existing containers..."
docker compose --project-name "${PROJECT_NAME}" down --timeout 30 --remove-orphans 2>/dev/null || true

# Build and deploy
echo "Building and deploying new containers..."
docker compose --project-name "${PROJECT_NAME}" up --build -d --remove-orphans

# Health check
echo "Performing health check..."
timeout 60 bash -c 'until curl -f http://localhost:1337/admin > /dev/null 2>&1; do echo "Waiting for Strapi..."; sleep 5; done'

echo "Deployment completed successfully!"
echo "Strapi is running at: http://localhost:1337"
echo "Admin panel: http://localhost:1337/admin"