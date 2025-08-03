# Use Node.js 18 Alpine as base image for smaller size
FROM node:18-alpine

# Add build argument to force rebuild when needed
ARG BUILD_DATE

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for TypeScript)
RUN npm ci

# Copy source code
COPY . .

# Copy version file to ensure rebuilds
COPY version.txt ./version.txt

# Build the application
RUN npm run build

# Install serve to run the built app
RUN npm install -g serve

# Clean up devDependencies to reduce image size
RUN npm prune --production

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"] 