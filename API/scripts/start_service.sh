#!/bin/bash
echo "Starting service..."
#!/bin/bash
echo "Starting service..."
sudo systemctl daemon-reload
sudo systemctl enable primary-backend-application.service
sudo systemctl start primary-backend-application.service
echo "Service started successfully."

