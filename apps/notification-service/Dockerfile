FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy entire workspace (needed for Nx build)
COPY . .

# Build the service
RUN npx nx build notification-service

# Expose health endpoint port
EXPOSE 3001

# Start the service
CMD ["node", "dist/apps/notification-service/main.cjs"]
