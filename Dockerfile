# 1. Builder stage: Build the application
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies)
RUN npm ci --include=dev

# Copy the rest of the source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# 2. Installer stage: Install only production dependencies
FROM node:20-alpine AS installer
WORKDIR /usr/src/app

# Copy package files
COPY package.json package-lock.json* ./

# Install only production dependencies
RUN npm ci --omit=dev

# 3. Production stage: Create the final, lean image
FROM node:20-alpine AS production
WORKDIR /usr/src/app

# Set production environment
ENV NODE_ENV=production

# Copy artifacts from previous stages
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=installer /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/prisma ./prisma

# Expose the port the app runs on
EXPOSE 3001

# Start the app
CMD ["node", "dist/main"]
