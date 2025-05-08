FROM node:18-alpine as build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

COPY . ./

# Define build arguments based on your .env file
ARG REACT_APP_ENV
ARG REACT_APP_AWS_ACCESS_KEY_ID
ARG REACT_APP_AWS_SECRET_ACCESS_KEY
ARG REACT_APP_AWS_BUCKET_NAME
ARG REACT_APP_AWS_REGION
ARG REACT_APP_API_URL
ARG REACT_APP_IMG_URL

# Make them available as environment variables during build
ENV REACT_APP_ENV=${REACT_APP_ENV}
ENV REACT_APP_AWS_ACCESS_KEY_ID=${REACT_APP_AWS_ACCESS_KEY_ID}
ENV REACT_APP_AWS_SECRET_ACCESS_KEY=${REACT_APP_AWS_SECRET_ACCESS_KEY}
ENV REACT_APP_AWS_BUCKET_NAME=${REACT_APP_AWS_BUCKET_NAME}
ENV REACT_APP_AWS_REGION=${REACT_APP_AWS_REGION}
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV REACT_APP_IMG_URL=${REACT_APP_IMG_URL}


# Create runtime config file
RUN mkdir -p ./public
RUN echo "window.ENV = { \
  REACT_APP_IMG_URL: '${REACT_APP_IMG_URL}', \
  REACT_APP_API_URL: '${REACT_APP_API_URL}', \
  REACT_APP_ENV: '${REACT_APP_ENV}', \
  REACT_APP_AWS_REGION: '${REACT_APP_AWS_REGION}', \
  REACT_APP_AWS_BUCKET_NAME: '${REACT_APP_AWS_BUCKET_NAME}' \
};" > ./public/env-config.js

RUN npm run build && npm prune --production

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Create minimal nginx configuration (just for serving static files)
RUN npm run build && npm prune --production

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]