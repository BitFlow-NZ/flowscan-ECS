#!/bin/sh
set -e

# Generate runtime config.js with environment variables
echo "window.ENV = {" > /usr/share/nginx/html/config.js
echo "  REACT_APP_ENV: \"${REACT_APP_ENV}\"," >> /usr/share/nginx/html/config.js
echo "  REACT_APP_AWS_BUCKET_NAME: \"${REACT_APP_AWS_BUCKET_NAME}\"," >> /usr/share/nginx/html/config.js
echo "  REACT_APP_AWS_REGION: \"${REACT_APP_AWS_REGION}\"," >> /usr/share/nginx/html/config.js
echo "  REACT_APP_API_URL: \"${REACT_APP_API_URL}\"," >> /usr/share/nginx/html/config.js
echo "  REACT_APP_AWS_ACCESS_KEY_ID: \"${REACT_APP_AWS_ACCESS_KEY_ID}\"," >> /usr/share/nginx/html/config.js
echo "  REACT_APP_AWS_SECRET_ACCESS_KEY: \"${REACT_APP_AWS_SECRET_ACCESS_KEY}\"," >> /usr/share/nginx/html/config.js
echo "  REACT_APP_IMG_URL: \"${REACT_APP_IMG_URL}\"" >> /usr/share/nginx/html/config.js
echo "};" >> /usr/share/nginx/html/config.js

echo "Generated runtime configuration"

# Start nginx
exec nginx -g 'daemon off;'