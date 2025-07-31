# Stage 1: Builder - Install dependencies and build the application
# Using a lightweight Node.js LTS Alpine image.
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
# This means npm install won't re-run if only source code changes.
COPY package*.json ./

# Install all dependencies (including devDependencies needed for building)
# 'npm ci' ensures a clean and deterministic install based on package-lock.json
RUN npm ci

# Copy the rest of your application source code
COPY . .

# Build the NestJS application (compiles TypeScript to JavaScript)
# This uses your "build" script from package.json
RUN npm run build

# Stage 2: Production - Create a lean image for running the compiled application
FROM node:20-alpine AS production

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
# - Compiled JavaScript output (from 'dist' folder)
# - Production-only node_modules (if you pruned them in the builder stage, otherwise all)
# - package.json (often needed for 'npm start' or other runtime scripts)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Expose the port your NestJS application listens on
# NestJS typically defaults to port 3000, but ensure this matches your app's configuration.
EXPOSE 3000

# Define the command to run your application in production
# This uses your "start:prod" script from package.json, which runs 'node dist/main'
CMD ["npm", "run", "start:prod"]

# Stage 3: Development - A separate stage for local development with hot-reloading
# This stage is typically used by docker-compose for development.
FROM node:20-alpine AS development

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including devDependencies for tools like ts-node, nodemon)
RUN npm install

# Copy all source code (bind-mounted from host in docker-compose)
# We copy it here for the initial build, but the volume mount will override this for live changes.
COPY . .

# Expose the application port for development
EXPOSE 3000

# Command to run the application in development mode with watch/hot-reloading
# This uses your "start:dev" script from package.json
CMD ["npm", "run", "start:dev"]
