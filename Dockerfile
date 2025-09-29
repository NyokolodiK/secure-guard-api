# ---- Base ----
FROM node:20-alpine AS base
WORKDIR /usr/src/app

# ---- Dependencies ----
FROM base AS dependencies
COPY package.json package-lock.json* ./
RUN npm ci --include=dev

# ---- Build ----
FROM dependencies AS build
COPY . .
RUN npx prisma generate
RUN npm run build

# ---- Production ----
FROM base AS production
ENV NODE_ENV=production

COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma

# Expose the port the app runs on
EXPOSE 3001

# Start the app
CMD ["node", "dist/main"]
