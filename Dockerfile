# Stage 1: Build the React application
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the application from a lean server
FROM node:18-alpine

# Install `serve` to act as a static file server
RUN npm install -g serve

WORKDIR /app

# Copy the build output from the build stage
COPY --from=build /app/dist .

# Expose the port the app will run on
EXPOSE 5173

# Serve the app
CMD ["serve", "-s", ".", "-l", "5173"]
