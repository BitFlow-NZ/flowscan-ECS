from flask import Flask, request, jsonify
from flask_swagger_ui import get_swaggerui_blueprint
from Image_Reco import decode_gs1_barcode, fuzzy_match, fetch_items_from_api, image_reco_vision
import pandas as pd
import os

# Initialize global variables outside the application context
cache_dir = "/tmp/flowscan-cache"

if not os.path.exists(cache_dir):
    os.makedirs(cache_dir)

cache_file = os.path.join(cache_dir, "ocr_cache.json")

# Create empty cache file if it doesn't exist
if not os.path.exists(cache_file):
    with open(cache_file, "w") as f:
        f.write("[]")  # Empty JSON array

API_URL = "http://backend-service.flowscan-service:5001/api/OCRItem"  # for ocr-server

# Swagger configuration
SWAGGER_URL = '/swagger'
API_YAML_FILE = 'static/swagger.yaml'  # Path to the YAML file

def update_cache_data():
    """Function to update cache data from API"""
    print("Updating cache...")
    try:
        fetched_data = fetch_items_from_api(API_URL)
        if fetched_data is not None:
            # Save the fetched data to cache file
            with open(cache_file, "w") as f:
                f.write(fetched_data + '\n')
            print("Cache updated and saved successfully.")
        else:
            print("Failed to update cache.")
    except Exception as e:
        print(f"An error occurred while updating cache: {e}")

def create_app():
    """Application factory function"""
    app = Flask(__name__)
    
    # Register Swagger UI blueprint
    swaggerui_blueprint = get_swaggerui_blueprint(
        SWAGGER_URL,
        f'/{API_YAML_FILE}',
        config={'app_name': "Image Recognition API"}
    )
    app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)
    
    # Initialize cache on startup
    try:
        print("Initializing cache during app creation...")
        update_cache_data()
    except Exception as e:
        print(f"Cache initialization error: {e}")
    
    # Health check endpoint for ECS
    @app.route('/health', methods=['GET'])
    def health_check():
        """Health check endpoint for container orchestration systems."""
        return "ok", 200
    
    # Process an image for text recognition
    @app.route('/process-image', methods=['POST'])
    def process_image():
        try:
            # Log incoming request
            print(f"Received request at /process-image: {request.data}")
            
            # Check Content-Type
            if request.content_type != 'application/json':
                return jsonify(
                    {"success": False, "data": None, "message": "Unsupported Media Type. Expected 'application/json'"}), 415
    
            # Parse JSON body
            data = request.get_json()
            if data is None:
                return jsonify({"success": False, "data": None, "message": "Invalid JSON body"}), 400
                
            # Check for image_url or imageUrl (support both keys for compatibility)
            image_url = data.get('image_url') or data.get('imageUrl')
            if not image_url:
                return jsonify({"success": False, "data": None, "message": "Please input image url"}), 400
    
            print(f"Processing image from URL: {image_url}")
            
            # Ensure cache is ready
            try:
                if not os.path.exists(cache_file) or os.stat(cache_file).st_size == 0:
                    print("Cache is empty or missing. Updating...")
                    update_cache_data()
    
                ocr_items = pd.read_json(cache_file)
                ocr_items_df = pd.DataFrame(ocr_items)
                if ocr_items_df.empty:
                    return jsonify({"success": False, "data": None, "message": "Cache is empty or not updated."}), 500
            except Exception as cache_error:
                print(f"Error loading or updating cache: {cache_error}")
                return jsonify({"success": False, "data": None, "message": "Cache is empty or not updated."}), 500
    
            # Attempt to detect text
            cleaned_output = image_reco_vision(image_url)
            if not cleaned_output:
                return jsonify({"success": False, "data": None, "message": "No text detected"}), 200
    
            print(f"Detected text: {cleaned_output}")
            
            # Use the cache for matching
            matches = fuzzy_match(ocr_items_df, cleaned_output)
    
            # Check if matches are empty
            if not matches:
                return jsonify({"success": False, "data": None, "message": "No matched item"}), 200
    
            print(f"Found matches: {matches}")
            
            return jsonify({
                "success": True,
                "data": [{'item_id': item_id, 'unit_id': unit_id} for item_id, unit_id, _ in matches],
                "message": "Match successfully"
            }), 200
    
        except Exception as e:
            print(f"Error processing image: {str(e)}")
            return jsonify({"success": False, "data": None, "message": f"An unexpected error occurred: {str(e)}"}), 500
    
    
    # New route for barcode detection
    @app.route('/decode-barcode', methods=['POST'])
    def decode_barcode():
        try:
            data = request.json
            image_url = data.get('image_url')
    
            if not image_url:
                return jsonify({"success": False, "data": None, "message": "Image URL is required"}), 400
    
            # Decode the barcode from the image
            gtin = decode_gs1_barcode(image_url)
            if not gtin:
                return jsonify({"success": False, "data": None, "message": "Barcode detection failed"}), 200
            return jsonify({"success": True, "data": gtin, "message": "Barcode decoded successfully"}), 200
    
        except Exception as e:
            return jsonify({"success": False, "data": None, "message": f"An unexpected error occurred: {str(e)}"}), 500
    
    # New route for text extraction
    @app.route('/extract-text', methods=['POST'])
    def extract_text():
        try:
            data = request.json
            image_url = data.get('image_url')
    
            if not image_url:
                return jsonify({"success": False, "data": None, "message": "Image URL is required"}), 400
    
            # Extract text from the image
            cleaned_output = image_reco_vision(image_url)
            if not cleaned_output:
                return jsonify({"success": False, "data": None, "message": "No text extracted"}), 200
            return jsonify({"success": True, "data": cleaned_output, "message": "Text extract successfully"}), 200
    
        except Exception as e:
            return jsonify({"success": False, "data": None, "message": f"An unexpected error occurred: {str(e)}"}), 500
    
    @app.route('/update-cache', methods=['POST'])
    def update_cache():
        try:
            update_cache_data()  # Trigger cache update
            return jsonify({"success": True, "data": None, "message": "Cache updated successfully"}), 200
        except Exception as e:
            return jsonify({"success": False, "data": None, "message": f"Failed to update cache: {str(e)}"}), 500
    
    @app.route('/clear-cache', methods=['POST'])
    def clear_cache():
        try:
            with open(cache_file, "w") as f:
                f.write('[]')  # Empty JSON array instead of empty string
            return jsonify({"success": True, "data": None, "message": "Cache cleared successfully"}), 200
        except Exception as e:
            return jsonify({"success": False, "data": None, "message": f"An unexpected error occurred: {str(e)}"}), 500
            
    # Return the fully configured app
    return app

# Create app instance - this is what Gunicorn will import
app = create_app()

# Keep this for running the app directly during development
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host='0.0.0.0', port=port, debug=True)