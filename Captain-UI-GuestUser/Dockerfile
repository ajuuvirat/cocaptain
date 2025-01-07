# Step 1: Use a base image with a compatible Node.js version (v18 or later)
FROM node:18-slim AS build
 
# Step 2: Set the working directory inside the container
WORKDIR /app
 
# Step 3: Copy package.json and package-lock.json first to install dependencies
COPY package*.json ./
 
# Step 4: Install all dependencies (including devDependencies)
RUN npm install --legacy-peer-deps
 
# Step 5: Install Angular CLI globally to ensure ng command is available
RUN npm install -g @angular/cli
 
# Debugging step: Verify if Angular CLI is installed correctly
RUN npx ng version
 
# Step 6: Copy the rest of the application files into the container
COPY . .
 
# Step 7: Build the Angular app using the production configuration
RUN ng build --configuration production
 
# Debugging step: Check for build output or errors
RUN ls -R /app/dist
 
# Step 8: Create a lightweight Nginx image to serve the Angular app
FROM nginx:alpine AS production
 
# Step 9: Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
 
# Step 10: Copy the built Angular app from the build stage into Nginx's serving directory
COPY --from=build /app/dist/ccGuestApp /usr/share/nginx/html
 
# Step 11: Expose the port Nginx will use
EXPOSE 80
 
# Step 12: Run Nginx in the foreground (default command)
CMD ["nginx", "-g", "daemon off;"]