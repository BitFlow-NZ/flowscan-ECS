# Image Recognition Project

## Overview
This project provides an Image Recognition API built using Flask. The API can process images for barcode detection, text extraction, and fuzzy matching against a list of products fetched from an external API. Additionally, the application supports Swagger documentation for easy testing and exploration of its endpoints.

---

## Features
1. **Barcode Detection:**
   - Decodes GS1 barcodes from image URLs and extracts GTIN.
2. **Text Extraction:**
   - Extracts text from images using AWS Textract.
3. **Fuzzy Matching:**
   - Matches the extracted text against a product database using fuzzy string matching.
4. **Caching:**
   - Implements caching with a time-to-live (TTL) for product data fetched from the API.
5. **API Documentation:**
   - Integrated Swagger UI for detailed API exploration.
6. **Cache Management:**
   - Endpoints to manage and clear the cache.

---

## Prerequisites
1. **Python 3.8 or above**
2. **AWS Credentials:** Required for Textract integration.
3. **Dependencies:** Install dependencies(see below).

---

## Installation

1. **Clone the Repository:**
   ```bash
   git clone <repository_url>
   cd <repository_folder>
   ```

2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set AWS Credentials:**
   Ensure your AWS credentials are properly configured (e.g., via `~/.aws/credentials`).

4. **Run the Application:**
   ```bash
   python app.py
   ```

---

## File Structure
- `app.py`: Main Flask application.
- `Image_Reco.py`: Contains core image processing and matching logic.
- `static/swagger.yaml`: Swagger configuration file.
- `ocr_cache.json`: Cache file for product data (created dynamically).

---

## Dependencies

Install the following dependencies:
- Flask
- flask-swagger-ui
- cachetools
- boto3
- pandas
- fuzzywuzzy
- requests
- Pillow
- zxing

---

## License
This project is open-source and available under the MIT License.

