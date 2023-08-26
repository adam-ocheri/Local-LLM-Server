# Use an official Node.js runtime as the base image
FROM node:18

ENV NODE_ENV=production
# Set the working directory in the container to /app
WORKDIR /

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Copy the rest of the application code to the working directory
COPY . .
# Install the application dependencies
# Note: If you are building your code for production, use `npm ci --only=production`
RUN npm install && npm run build

# The application listens on port 4000, so you can use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3000

# Define the command to run your app using CMD
CMD [ "npm", "run", "start" ]