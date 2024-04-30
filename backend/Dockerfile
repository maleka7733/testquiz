# /backend/Dockerfile
FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies using npm ci
RUN npm ci --include=dev

# Install nodemon globally
RUN npm install -g nodemon

# Copy the rest of the application code
COPY . .

# Change ownership to non-root user and switch user
RUN chown -R node:node /usr/src/app
USER node

EXPOSE 8080
CMD ["npm", "start"]
