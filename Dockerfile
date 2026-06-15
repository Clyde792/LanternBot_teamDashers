# Use official lightweight Node.js image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy the rest of the app
COPY index.js ./

# Expose the port the app runs on
EXPOSE 3000

# Start the bot
CMD ["node", "index.js"]