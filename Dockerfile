# Use official Node.js image
FROM node:18

# Set the working directory in the container
WORKDIR /

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run the app
CMD npm start
