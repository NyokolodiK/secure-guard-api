FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy the rest of the source code
COPY . .

# Generate Prisma Client for the container's platform
RUN npx prisma generate

# Build the application
RUN npm run build

# Remove devDependencies to create a lean production image
RUN npm prune --production

# Set production environment
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 3001

# Start the app
CMD ["node", "dist/main"]
