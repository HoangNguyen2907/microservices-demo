FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy entire workspace (needed for Nx build)
COPY . .

# Build the service
RUN npx nx build identity-service

# Expose gRPC port
EXPOSE 5001

# Start the service
CMD ["node", "dist/apps/identity-service/main.cjs"]
