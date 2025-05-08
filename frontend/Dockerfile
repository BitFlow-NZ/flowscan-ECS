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

# Make them available as environment variables during build
ENV VITE_APP_ENV=${REACT_APP_ENV}
ENV VITE_AWS_ACCESS_KEY_ID=${REACT_APP_AWS_ACCESS_KEY_ID}
ENV VITE_AWS_SECRET_ACCESS_KEY=${REACT_APP_AWS_SECRET_ACCESS_KEY}
ENV VITE_AWS_BUCKET_NAME=${REACT_APP_AWS_BUCKET_NAME}
ENV VITE_AWS_REGION=${REACT_APP_AWS_REGION}
ENV VITE_API_URL=${REACT_APP_API_URL}
ENV VITE_IMG_URL=${REACT_APP_IMG_URL}

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Inject the env-config.js script into the index.html file
# FIX: Updated path to point to the nginx html directory
RUN sed -i 's/<head>/<head><script src="\/env-config.js"><\/script>/' /usr/share/nginx/html/index.html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create docker-entrypoint script for runtime config
RUN echo '#!/bin/sh\n\
# Generate runtime env-config.js\n\
echo "window.ENV = {\n\
  REACT_APP_ENV: \"$REACT_APP_ENV\",\n\
  REACT_APP_AWS_BUCKET_NAME: \"$REACT_APP_AWS_BUCKET_NAME\",\n\
  REACT_APP_AWS_REGION: \"$REACT_APP_AWS_REGION\",\n\
  REACT_APP_API_URL: \"$REACT_APP_API_URL\",\n\
  REACT_APP_AWS_ACCESS_KEY_ID: \"$REACT_APP_AWS_ACCESS_KEY_ID\",\n\
  REACT_APP_AWS_SECRET_ACCESS_KEY: \"$REACT_APP_AWS_SECRET_ACCESS_KEY\",\n\
  REACT_APP_IMG_URL: \"$REACT_APP_IMG_URL\"\n\
};" > /usr/share/nginx/html/env-config.js\n\
\n\
# Start nginx\n\
exec nginx -g "daemon off;"\n' > /docker-entrypoint.sh

# Make entrypoint script executable
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]