#!/bin/bash

echo "Building Docker image for Text Editor Demo..."
docker build -t text-editor-demo .

echo "Starting container..."
docker run -d -p 3000:3000 --name text-editor-demo text-editor-demo

echo "Container started! Access the application at http://localhost:3000"
echo "To stop the container, run: docker stop text-editor-demo"
echo "To remove the container, run: docker rm text-editor-demo" 