# Use the official Nginx image as base
FROM nginx:alpine

# Copy the HTML file to the Nginx html directory
COPY index.html /usr/share/nginx/html

# Expose port 80 to outside world
EXPOSE 80

