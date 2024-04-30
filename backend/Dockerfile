# /backend/Dockerfile
FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev

COPY package.json package-lock.json ./

# install nodemon for hot-reloading
RUN npm install -g nodemon

# Install all dependencies (including production dependencies)
RUN npm install

# Copy the rest of the source files into the image.
COPY . .


# Run the application as a non-root user.
RUN  chown -R node /usr/src/app
USER node

EXPOSE 8080
CMD ["npm", "start"]
