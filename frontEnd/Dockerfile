# Stage 1: Build Angular application
FROM node:20-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve application with Nginx
FROM nginx:alpine
# Copy build output to nginx html folder. 
# Note: 'front-end' should match the 'outputPath' in your angular.json (usually dist/[project-name])
COPY --from=build-stage /app/dist/front-end/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
