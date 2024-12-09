# Dockerfile for production environment

# Use the official Node.js image
FROM node:22-alpine

LABEL org.opencontainers.image.authors="cativo23.kt@gmail.com"

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN yarn install --prod

# Copy the rest of the application files
COPY . .

# Expose port 3000
EXPOSE 3000

# Compile the application
RUN yarn run build

# Run the application
CMD ["node", ".output/server/index.mjs"]
