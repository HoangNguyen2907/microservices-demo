FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy entire workspace (needed for Nx build)
COPY . .

# Build the service
RUN npx nx build nestjs-gateway

# Expose HTTP port
EXPOSE 4000

# Start the service
CMD ["node", "dist/apps/nestjs-gateway/main.cjs"]
