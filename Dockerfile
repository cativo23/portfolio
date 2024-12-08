# Use the official Node.js image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application files
COPY . .

# Expose port 3000
EXPOSE 3000

# Run the development server
CMD ["yarn", "run", "dev"]
