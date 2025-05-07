import React from 'react';
import { Anchor, Card, Alert } from 'antd';
import { Link as RouterLink } from 'react-router-dom';
const { Link } = Anchor;
import './Help.css';

const Help: React.FC = () => {
  return (
    <div style={{ display: 'flex' }}>
      {/* Main Content */}
      <div style={{ flex: 3, paddingRight: '20px' }}>
        {/* Welcome Section */}
        <Card style={{ marginBottom: '20px' }} bordered={false}>
          <h1 id="introduction">Welcome to FLOWSCAN </h1>
          <p>
            This app is designed to make your work easier and more efficient. Using advanced image
            recognition technology, it helps you quickly identify items used in surgeries or
            clinical events, keeps your inventory up-to-date in real-time, and ensures accurate
            documentation of all procedures.
          </p>
          <p>
            Let’s explore how this system help you save time, reduce errors, and focus on providing
            the best care for your patients.
          </p>
        </Card>

        {/* Quick Start Guide */}
        <Card style={{ marginBottom: '20px' }} bordered={false}>
          <h2 id="getting-started">Getting Started</h2>
          <h3 id="system-requirements">System Requirements</h3>
          <ul style={{ listStyleType: 'disc', paddingLeft: '30px' }}>
            <li>A computer with a camera (minimum resolution: 1080p).</li>
            <li>Stable internet connection.</li>
            <li>Supported browsers: Chrome, Firefox, Safari, or Edge.</li>
          </ul>
          <Alert
            message="Tip"
            description="For the best experience, ensure your camera is clean and your internet connection is stable."
            type="info"
            showIcon
            style={{ marginBottom: '20px' }}
          />
        </Card>

        {/* Feature Overview */}
        <Card style={{ marginBottom: '20px' }} bordered={false}>
          <h2 id="features">Step-by-Step Guide</h2>

          {/* Quick Scan Feature */}
          <h3 id="quick-scan">
            <RouterLink to="/scan" style={{ color: '#1890ff', textDecoration: 'none' }}>
              1. Quick Scan: Identify Items Instantly
            </RouterLink>
          </h3>
          <p>
            Ideal for real-time identification of pharmaceutical items. Take a picture of the item,
            and the system will recognize it and return matching items stored in the database.
          </p>

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img
              src="https://bitflow-image-upload.s3.ap-southeast-2.amazonaws.com/user+manual+/quick-scan.png"
              alt="Quick Scan"
              style={{ width: '100%', maxWidth: '400px', height: '250px' }}
            />
          </div>

          <ol style={{ paddingLeft: '50px' }}>
            <li>
              1) Navigate to the <RouterLink to="/scan">Quick Scan</RouterLink> section.
            </li>
            <li>
              2) Select the camera you want to use, if your device has multiple cameras available.
            </li>
            <li>
              3) <b>Turn on</b> your camera.
            </li>
            <li>4) Position the item in the camera&apos;s view.</li>
            <li>
              5) Click <b>Capture</b>. The system will return the closest matches instantly.
            </li>
            <li>
              6) If needed, use the <b>Search Bar</b> to manually search for items by name. Once you
              input more than two characters, the system will suggest matching item names in a
              dropdown list. Click on a name to view its details.
            </li>
            <div style={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px' }}>
              <img
                src="https://bitflow-image-upload.s3.ap-southeast-2.amazonaws.com/user+manual+/search+list.png"
                alt="Quick Scan"
                style={{ width: '100%', maxWidth: '400px', height: '250px' }}
              />
            </div>
          </ol>
          <Alert
            message="Tips for Best Results"
            description={
              <ul style={{ paddingLeft: '20px', listStyleType: 'circle' }}>
                <li>Avoid dim lighting or glare on the item surface.</li>
                <li>Ensure the camera is steady and the item is in focus.</li>

                <li>
                  Place the item&apos;s <b>front side containing key information</b> facing the
                  camera for clear recognition.
                </li>
                <li>Ensure the item occupies at least 80% of the view for better recognition.</li>
              </ul>
            }
            type="warning"
            showIcon
            style={{ marginBottom: '20px' }}
          />
        </Card>

        {/* Creating a New Event */}
        <Card style={{ marginBottom: '20px' }} bordered={false}>
          <h3 id="create-new-event">
            <RouterLink to="/create-new-event" style={{ color: '#1890ff', textDecoration: 'none' }}>
              2. Create New Event
            </RouterLink>
          </h3>
          <p>
            Create detailed records for surgeries or clinical events. This ensures all medications
            and materials are accurately documented for compliance and future reference.
          </p>
          <ol style={{ paddingLeft: '50px' }}>
            {/* Step 1 */}
            <li>
              1) Click the{' '}
              <RouterLink
                to="/create-new-event"
                style={{ color: '#1890ff', textDecoration: 'none' }}
              >
                Creating a New Event
              </RouterLink>{' '}
              .
            </li>

            {/* Step 2 */}
            <li>
              2) <b>Enter event details:</b>
              Fill in the required information:
              <ul style={{ listStyleType: 'disc', paddingLeft: '50px' }}>
                <li>Event Name - e.g., &quot;Surgery: Cataract Removal&quot;</li>
                <li>Doctor Name</li>
                <li>Patient Name</li>
                <li>Event Time - Select a date and time using the calendar picker.</li>
                <li>Theater Number (Optional)</li>
              </ul>
              <div style={{ textAlign: 'center', margin: '20px' }}>
                <img
                  src="https://bitflow-image-upload.s3.ap-southeast-2.amazonaws.com/user+manual+/Event-baiscinfo.png"
                  alt="Event Details"
                  style={{ width: '100%', maxWidth: '400px', height: '250px' }}
                />
              </div>
            </li>

            {/* Step 3 */}
            <li>
              3) <b>Click Next:</b> Ensure all required fields are filled before clicking{' '}
              <b>Next</b> to avoid validation errors.
            </li>

            {/* Step 4 */}
            <li>
              4) <b>Add items to the event: </b>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <img
                  src="https://bitflow-image-upload.s3.ap-southeast-2.amazonaws.com/user+manual+/recognize+item.png"
                  alt="Item Recognition"
                  style={{ width: '100%', maxWidth: '400px', height: '250px' }}
                />
              </div>
              <ul style={{ listStyleType: 'disc', paddingLeft: '50px' }}>
                <li>
                  <b>Identify items used in event:</b> Same steps with the <b>Quick Scan</b>
                  <ol style={{ listStyleType: 'circle', paddingLeft: '50px' }}>
                    <li>
                      Select the camera you want to use, if your device has multiple cameras
                      available.
                    </li>
                    <li>
                      <b>Turn on</b> your camera.
                    </li>
                    <li>Position the item in the camera&apos;s view.</li>
                    <li>
                      Click <b>Capture</b>. The matched items will appear below.
                    </li>
                    <li>
                      If no matches are found or the image is unclear, use the <b>Search Bar</b> to
                      find the item manually.
                    </li>
                  </ol>
                </li>
                <li>
                  Click <b>Add to Cart:</b> Select the item you want to add to the event. Same item
                  can be added with different unit names.
                </li>
              </ul>
            </li>
            <li>
              5) <b>In the cart list:</b> you can edit the quantity or remove items by clicking the{' '}
              <b>delete</b> icon.
            </li>

            {/* Step 5 */}
            <li>
              6) <b>Submit the event:</b>
              After adding all items, click <b>Submit</b> in the lower-right corner. Then, enter the{' '}
              <b>Editor Name</b> and click <b>OK</b>.
            </li>
          </ol>

          {/* Additional Tips */}
          <Alert
            message="Tips for First-Time Users"
            description={
              <ul style={{ listStyleType: 'circle', paddingLeft: '20px' }}>
                <li>Optional fields can be left blank and added later.</li>

                <li>
                  Use the search bar as a backup if item recognition fails or some items without
                  label.
                </li>
                <li>Items with the same name and unit cannot be added multiple times. </li>
              </ul>
            }
            type="info"
            showIcon
            style={{ marginBottom: '20px' }}
          />
        </Card>

        <Card style={{ marginBottom: '20px' }} bordered={false}>
          <h3 id="event-list">
            <RouterLink to="/events" style={{ color: '#1890ff', textDecoration: 'none' }}>
              3. Event List: View and Manage Events
            </RouterLink>
          </h3>
          <p>
            This page allows you to view, download, print, and edit event details efficiently. You
            can also search for events by doctor name, nurse name, or patient name, and filter
            events by <b>All Time</b>, <b>Last Day</b>, <b>Last Week</b>, or <b>Last Month</b>{' '}
            according to the event creation time.
          </p>
          {/* Visual Example */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img
              src="https://bitflow-image-upload.s3.ap-southeast-2.amazonaws.com/backend-image/event+list.png"
              alt="Event List Interface"
              style={{ width: '100%', maxWidth: '600px', height: '100%' }}
            />
          </div>

          <ol style={{ listStyleType: 'disc', paddingLeft: '50px' }}>
            {/* Step 1 */}
            <li>
              <b>Access the Event List:</b>
              Click the{' '}
              <RouterLink to="/events" style={{ color: '#1890ff', textDecoration: 'none' }}>
                Events List
              </RouterLink>{' '}
              tab on the dashboard to view the full list of events.
            </li>

            {/* Step 2 */}
            <li>
              <b>Search and Filter Events:</b>
              Use the following tools to find specific events:
              <ul style={{ listStyleType: 'circle', paddingLeft: '30px' }}>
                <li>
                  Enter <b>keywords</b> such as the event name, doctor name, or patient name in the
                  search box.
                </li>
                <li>
                  Apply filters based on the event creation time: <b>Last Day</b>, <b>Last Week</b>,{' '}
                  <b>Last Month</b>, or view <b>All Time</b>.
                </li>
                <li>
                  Click the <b>Search</b> button to view the results.
                </li>
              </ul>
              <Alert
                message="Search Tip"
                description="Ensure the time filter matches the event's creation date to avoid missing results."
                type="info"
                showIcon
                style={{ margin: '20px' }}
              />
            </li>

            {/* Step 3 */}
            <li>
              <b>View or Export Event Details:</b>
              <ul style={{ listStyleType: 'circle', paddingLeft: '30px' }}>
                <li>
                  Click <b>View/Export</b> next to the event to view details.
                </li>
                <li>
                  Use the provided options to <b>download</b> or <b>print</b> the event details as a
                  PDF.
                </li>
              </ul>
            </li>

            {/* Step 4 */}
            <li>
              <b>Edit Event Details:</b>
              <ul style={{ listStyleType: 'circle', paddingLeft: '30px' }}>
                <li>
                  Locate the event in the list and click <b>Edit</b> under the <b>Operation</b>{' '}
                  section.
                </li>
                <li>Make the necessary changes to the event details.</li>
                <li>
                  Click <b>Submit</b> to save your changes, then input the <b>Editor Name</b> to
                  confirm.
                </li>
              </ul>
            </li>
          </ol>
        </Card>

        <Card style={{ marginBottom: '20px' }} bordered={false}>
          <h3 id="item-list">
            <RouterLink to="/items" style={{ color: '#1890ff', textDecoration: 'none' }}>
              4. Item List: Manage Your Inventory
            </RouterLink>
          </h3>

          <p>
            Keep your item database up-to-date. Add, edit, or remove items to maintain an accurate
            inventory.
          </p>
          {/* Visual Example */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img
              src="https://bitflow-image-upload.s3.ap-southeast-2.amazonaws.com/backend-image/item+list.png"
              alt="Item List Interface"
              style={{ width: '100%', maxWidth: '600px', height: '100%' }}
            />
          </div>

          <ol style={{ listStyleType: 'disc', paddingLeft: '30px' }}>
            {/* Step 1 */}
            <li>
              <b>Access the Item List:</b>
              Click the{' '}
              <RouterLink to="/items" style={{ color: '#1890ff', textDecoration: 'none' }}>
                Item List
              </RouterLink>{' '}
              tab on the dashboard to view all items in the database.
            </li>

            {/* Step 2 */}
            <li>
              <b>Search for an Item:</b>

              <ul style={{ listStyleType: 'circle', paddingLeft: '30px' }}>
                <li>Enter the item name or description in the search bar.</li>
                <li>Click the search icon to display the matching items.</li>
              </ul>
              <Alert
                message="Search Tip"
                description="Ensure accurate spelling of item names or descriptions for better results."
                type="info"
                showIcon
                style={{ margin: '20px' }}
              />
            </li>

            {/* Step 3 */}
            <li>
              <b>Add a New Item:</b>
              Click the <b>Add New Item</b> button to add a new item to the database. Fill in the
              required details and submit the form.
            </li>

            {/* Step 4 */}
            <li>
              <b>Edit Item Details:</b>
              To update an existing item:
              <ul style={{ listStyleType: 'circle', paddingLeft: '30px' }}>
                <li>
                  Click the <b>Edit</b> button next to the corresponding item.
                </li>
                <li>Modify the necessary details.</li>
                <li>
                  When updating or deleting a unit, you may see a warning if the unit has already
                  been used in events.
                </li>
                <li>
                  Click <b>Submit</b> to save the changes.
                </li>
              </ul>
            </li>

            {/* Step 5 */}
            <li>
              <b>Delete an Item:</b>
              <ul style={{ listStyleType: 'circle', paddingLeft: '30px' }}>
                <li>
                  Click the <b>Delete</b> button next to the item you want to remove.
                </li>
                <li>
                  If the item has been used in events, it cannot be deleted. A warning will notify
                  you in such cases.
                </li>
              </ul>
            </li>
          </ol>

          {/* Additional Warning */}
          <Alert
            message="Important Note"
            description="Items used in events cannot be deleted."
            type="warning"
            showIcon
            style={{ marginLeft: '50px' }}
          />
        </Card>
        {/* Add New Item */}
        <Card style={{ marginBottom: '20px' }} bordered={false}>
          <h3 id="add-new-item">
            <RouterLink to="/create-new-item" style={{ color: '#1890ff', textDecoration: 'none' }}>
              5. Add New Item
            </RouterLink>
          </h3>
          <p>
            This page allows you to add new items to the database, making them available for use in
            events.
          </p>
          <Alert
            message="Important Notes"
            description="Supported Image Formats for Local Upload: JPG, JPEG, and PNG. Please note that
                  HEIC format is not supported."
            type="warning"
            showIcon
            style={{ margin: '20px' }}
          />
          {/* Step 1 */}
          <ul style={{ paddingLeft: '0px' }}>
            Click the{' '}
            <RouterLink to="/items" style={{ color: '#1890ff', textDecoration: 'none' }}>
              Item List
            </RouterLink>{' '}
            tab on the dashboard, then click the{' '}
            <RouterLink to="/create-new-item" style={{ color: '#1890ff', textDecoration: 'none' }}>
              Add New Item
            </RouterLink>{' '}
            button.
          </ul>

          <ol style={{ paddingLeft: '50px' }}>
            {/* Step 2 */}
            <li>
              1) <b>Fill in Item Details:</b>
              <br />
              Enter the required details such as the item <b>name</b> and <b>description</b>.
              <div style={{ textAlign: 'center', margin: '20px' }}>
                <img
                  src="https://bitflow-image-upload.s3.ap-southeast-2.amazonaws.com/user+manual+/item+info.png"
                  alt="Item Details Form"
                  style={{ width: '100%', maxWidth: '400px', height: '200px' }}
                />
              </div>
            </li>

            {/* Step 3 */}
            <li>
              2) <b>Add Product Photo:</b>
              <br />
              <ul style={{ listStyleType: 'circle', paddingLeft: '30px' }}>
                <li>
                  Upload or capture an image of the item using the <b>Capture Photo</b> or{' '}
                  <b>Upload</b> button. Hover over the image to view the uploaded photo and delete
                  if needed.
                  <div style={{ textAlign: 'center', margin: '20px' }}>
                    <img
                      src="https://bitflow-image-upload.s3.ap-southeast-2.amazonaws.com/backend-image/product+photo.png"
                      alt="Add Product Photo"
                      style={{ width: '100%', maxWidth: '400px', height: '100%' }}
                    />
                  </div>
                </li>
                <li>
                  After capturing a photo with the camera, you can crop the image to remove any
                  unwanted background noise before uploading.
                  <div style={{ textAlign: 'center', margin: '20px' }}>
                    <img
                      src="https://bitflow-image-upload.s3.ap-southeast-2.amazonaws.com/user+manual+/crop-image.png"
                      alt="Add Product Photo-crop image"
                      style={{ width: '100%', maxWidth: '400px', height: '100%' }}
                    />
                  </div>
                </li>
              </ul>
            </li>

            {/* Step 4 */}
            <li>
              3) <b>Add Units:</b>
              <br />
              Define units for the item:
              <ul style={{ listStyleType: 'circle', paddingLeft: '30px' }}>
                <li>
                  Enter the <b>unit name</b> (e.g., bottle, box, pack). Ensure each unit name is
                  unique.
                </li>
                <li>
                 Capture and crop an image or upload it from local for the unit using the camera icon or upload button.
                </li>
                <li>
                  Review the uploaded photo by hovering over the question mark icon and delete it if
                  needed.
                </li>
                <li>
                  Click <b>Add Unit</b> to add multiple units.
                </li>
              </ul>
              <div style={{ textAlign: 'center', margin: '20px' }}>
                <img
                  src="https://bitflow-image-upload.s3.ap-southeast-2.amazonaws.com/user+manual+/unit.png"
                  alt="Unit Details"
                  style={{ width: '100%', maxWidth: '400px', height: '100%' }}
                />
              </div>
            </li>

            {/* Step 5 */}
            <li>
              4) <b>Add OCR Keywords:</b>
              <br />
              This feature enables users to scan the same item with different unit types by
              capturing text (OCR keywords) from every face of the product package. These keywords
              are stored in the database and later used to accurately match product information
              during image recognition.
              <div style={{ textAlign: 'center', margin: '20px' }}>
                <img
                  src="https://bitflow-image-upload.s3.ap-southeast-2.amazonaws.com/backend-image/ocr-keywords.png"
                  alt="OCR Keywords"
                  style={{ width: '100%', maxWidth: '400px', height: '500px' }}
                />
              </div>
              <ul style={{ listStyleType: 'circle', paddingLeft: '30px' }}>
                <li>
                  Click <b>Add Keyword</b> to add a new keyword.
                </li>
                <li>
                  Use the camera to scan or upload an image of the package face. The system will
                  automatically extract the text from the image, or input the keyword manually.
                </li>
                <li>Select the corresponding unit name from the dropdown list.</li>
                <li>To remove a keyword, click the delete icon next to it.</li>
                <li>
                  Click <b>Add Keyword</b> to add multiple faces of items.
                </li>
              </ul>
            </li>

            {/* Step 6 */}
            <li>
              5) <b>Submit the New Item:</b>
              Once all details are complete, click <b>Submit</b> to finish adding the new item.
            </li>
          </ol>

          <Alert
            message="Important Notes"
            description={
              <ul style={{ listStyleType: 'circle', paddingLeft: '20px' }}>
                <li>
                  One unit name can have several OCR depends on how many faces of the package can be
                  recognized.
                </li>
                <li>OCR keywords can have diffrent unit names</li>
              </ul>
            }
            type="warning"
            showIcon
            style={{ margin: '20px' }}
          />
        </Card>
        <Card style={{ marginBottom: '20px' }} bordered={false}>
          <h2 id="faq">Frequently Asked Questions (FAQ)</h2>

          <h3>1. What should I do if the Quick Scan doesn’t recognize an item?</h3>
          <p>
            - Ensure the camera is clean and the item is placed on a flat surface under good
            lighting.
            <br /> - Make sure the item&apos;s front label is clearly visible. <br />- If the issue
            persists, use the <b>Search Bar</b> to manually find the item.
          </p>

          <h3>2. Can I edit an event after submitting it?</h3>
          <p>
            Yes, go to the <b>Event List</b> tab, find the event you wish to edit, and click the{' '}
            <b>Edit</b> button. Remember to resubmit the event after making changes.
          </p>

          <h3>3. What happens if I add duplicate items to an event?</h3>
          <p>
            The system prevents duplicate items with the same unit name from being added. If you
            need to track the same item with different unit names, simply select another unit.
          </p>

          <h3>4. How do I delete an item from the database?</h3>
          <p>
            Go to the <b>Item List</b> tab, find the item you want to delete, and click{' '}
            <b>Delete</b>. Note that items used in events cannot be deleted.
          </p>
        </Card>
        <Card style={{ marginBottom: '20px' }} bordered={false}>
          <h2 id="troubleshooting">Troubleshooting</h2>

          <h3>1. The camera isn&apos;t working properly. What should I do?</h3>
          <p>
            - Check if the browser has camera permissions enabled.
            <br />
            - Ensure no other application is using the camera.
            <br />
            - Restart your browser and try again.
            <br />- Use another supported browser if the issue persists.
          </p>

          <h3>2. The system is running slowly.</h3>
          <p>
            - Ensure you have a stable internet connection.
            <br />
            - Close unused browser tabs or applications to free up system resources.
            <br />- Clear your browser cache and refresh the page.
          </p>

          <h3>3. I accidentally submitted an event with incorrect details.</h3>
          <p>
            - Go to the <b>Event List</b>, find the event, and click <b>Edit</b> to update the
            information.
            <br />- Resubmit the event to save the changes.
          </p>
        </Card>
        <Card style={{ marginBottom: '20px' }} bordered={false}>
          <h2 id="support">Contact Support</h2>
          <p>For any issues, please contact our support team. We&apos;re here to help you!</p>

          <li>
            Email: <a href="mailto:support@medicalapp.com">bitflow2025@gmail.com</a>
          </li>
        </Card>
      </div>

      {/* Right Sidebar Navigation */}
      <div style={{ flex: 1 }}>
        <Anchor style={{ position: 'fixed', top: 100, right: 20 }}>
          <Link href="#introduction" title="Introduction" />
          <Link href="#getting-started" title="Getting Started">
            <Link href="#system-requirements" title="System Requirements" />
          </Link>
          <Link href="#features" title="Features">
            <Link href="#quick-scan" title="Quick Scan" />
            <Link href="#create-new-event" title="Create New Event" />
            <Link href="#event-list" title="Event List" />
            <Link href="#item-list" title="Item List" />
            <Link href="#add-new-item" title="Add New Item" />
          </Link>
          <Link href="#faq" title="FAQ" />
          <Link href="#troubleshooting" title="Troubleshooting" />
          <Link href="#support" title="Contact Support" />
        </Anchor>
      </div>
    </div>
  );
};

export default Help;
