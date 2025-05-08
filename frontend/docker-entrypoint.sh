#!/bin/sh
set -e

# Debug information
echo "Creating environment configuration file..."
echo "Working directory: $(pwd)"
echo "Listing html directory: $(ls -la /usr/share/nginx/html)"

# Generate runtime env-config.js with proper error checking
ENV_CONFIG_PATH="/usr/share/nginx/html/env-config.js"

cat > "$ENV_CONFIG_PATH" << EOF
window.ENV = {
  REACT_APP_ENV: "${REACT_APP_ENV}",
  REACT_APP_AWS_BUCKET_NAME: "${REACT_APP_AWS_BUCKET_NAME}",
  REACT_APP_AWS_REGION: "${REACT_APP_AWS_REGION}",
  REACT_APP_API_URL: "${REACT_APP_API_URL}",
  REACT_APP_AWS_ACCESS_KEY_ID: "${REACT_APP_AWS_ACCESS_KEY_ID}",
  REACT_APP_AWS_SECRET_ACCESS_KEY: "${REACT_APP_AWS_SECRET_ACCESS_KEY}",
  REACT_APP_IMG_URL: "${REACT_APP_IMG_URL}"
};
EOF

# Verify the file was created
if [ -f "$ENV_CONFIG_PATH" ]; then
  echo "Successfully created $ENV_CONFIG_PATH"
  echo "Content preview (first line):"
  head -n 1 "$ENV_CONFIG_PATH"
else
  echo "ERROR: Failed to create $ENV_CONFIG_PATH"
  # Create a fallback version
  echo "window.ENV = { REACT_APP_AWS_BUCKET_NAME: 'flowscan-web' };" > "$ENV_CONFIG_PATH"
fi

# Create symlink to ensure both filenames work
ln -sf "$ENV_CONFIG_PATH" "/usr/share/nginx/html/config.js"

# Start nginx
echo "Starting Nginx..."
exec nginx -g "daemon off;"