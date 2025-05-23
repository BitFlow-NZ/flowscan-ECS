# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

COPY . ./

# Define build arguments based on the .env file
ARG REACT_APP_ENV
ARG REACT_APP_AWS_ACCESS_KEY_ID
ARG REACT_APP_AWS_SECRET_ACCESS_KEY
ARG REACT_APP_AWS_BUCKET_NAME
ARG REACT_APP_AWS_REGION
ARG REACT_APP_API_URL
ARG REACT_APP_IMG_URL



# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Inject the env-config.js script into the index.html file
RUN sed -i 's/<head>/<head><script src="\/env-config.js"><\/script>/' /usr/share/nginx/html/index.html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the entrypoint script and set permissions
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]