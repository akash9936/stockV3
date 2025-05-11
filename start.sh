#!/bin/bash

# Exit on error
set -e

echo "Starting NSE Data Scraper..."

# Check if Docker is installed
if ! command -v docker &> /dev/null
then
    echo "Docker could not be found. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null
then
    echo "Docker Compose could not be found. Please install Docker Compose first."
    exit 1
fi

# Build and start the containers
echo "Building and starting containers..."
docker-compose up -d --build

# Follow the logs
echo "Containers started. Showing logs (press Ctrl+C to exit logs, containers will keep running):"
docker-compose logs -f