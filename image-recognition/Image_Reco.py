import pandas as pd
import zxing
import boto3
from fuzzywuzzy import fuzz
import requests
from PIL import Image
from io import BytesIO
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import OperationStatusCodes
from msrest.authentication import CognitiveServicesCredentials
import os
import time

# Define barcode detection function
def decode_gs1_barcode(image_url):
    try:
        # Create zxing reader
        reader = zxing.BarCodeReader()

        # Download image from URL
        response = requests.get(image_url)
        if response.status_code != 200:
            return None

        image = Image.open(BytesIO(response.content))

        barcode = reader.decode(image)
        if not barcode:
            return None

        # Parse the GS1 barcode to extract GTIN
        barcode_text = barcode.parsed
        gtin = barcode_text[3:17]

        if gtin:
            return gtin
        else:
            print("Barcode read failed.")
            return None
    except Exception as e:
        print(f"Unexpected error during barcode decoding: {e}")
        return None


def image_reco_textract(image_url):
    # Initialize Textract client
    textract = boto3.client('textract')

    # Download image from URL
    response = requests.get(image_url)
    if response.status_code != 200:
        return None

    image_bytes = BytesIO(response.content).read()

    # Call Textract to analyze the document
    response = textract.detect_document_text(Document={'Bytes': image_bytes})
    if response:
        detected_text = [item['Text'] for item in response['Blocks'] if item['BlockType'] == 'LINE']
        return ' '.join(line.strip() for line in detected_text if line.strip())
    else:
        return None

def image_reco_vision(image_url):
    '''
    Authenticate and create Computer Vision client
    '''
    subscription_key = os.environ["VISION_KEY"]
    endpoint = os.environ["VISION_ENDPOINT"]

    computervision_client = ComputerVisionClient(endpoint, CognitiveServicesCredentials(subscription_key))

    '''
    OCR: Read File using the Read API, extract text - remote
    '''
    read_response = computervision_client.read(image_url, language="en", raw=True)

    # Get the operation ID from the Operation-Location header
    read_operation_location = read_response.headers["Operation-Location"]
    operation_id = read_operation_location.split("/")[-1]

    # Wait for the OCR operation to complete
    while True:
        read_result = computervision_client.get_read_result(operation_id)
        if read_result.status not in ['notStarted', 'running']:
            break
        time.sleep(0.5)

    # Collect detected text
    all_text = []
    if read_result.status == OperationStatusCodes.succeeded:
        for text_result in read_result.analyze_result.read_results:
            for line in text_result.lines:
                all_text.append(line.text)

    return ' '.join(all_text)


# Define function to find most similar product using fuzzy matching
def fuzzy_match(products_df, cleaned_text):
    if not isinstance(cleaned_text, str) or not cleaned_text.strip():
        raise ValueError("Cannot recognize product text.")

    matches = []
    matched_items = []
    cleaned_text = cleaned_text.strip().lower()

    # ---------- 1. Fuzzy matching ----------
    for idx, row in products_df.iterrows():
        ocr_keyword = row.get('ocrKeyword', None)
        if ocr_keyword is None or not isinstance(ocr_keyword, str):
            continue

        ocr_keyword = ocr_keyword.strip().lower()
        fuzzy_score = fuzz.ratio(ocr_keyword, cleaned_text)

        if fuzzy_score > 50:
            confidence = min(99, fuzzy_score)
            unit_id = row['unitId']
            unit_id = None if pd.isna(unit_id) else int(unit_id) if isinstance(unit_id, float) else unit_id
            matches.append((row['itemId'], unit_id, int(round(confidence))))

    # ---------- 2. If fuzzy match fails, try overlap match ----------
    if not matches:
        for idx, row in products_df.iterrows():
            ocr_keyword = row.get('ocrKeyword', None)
            if ocr_keyword is None or not isinstance(ocr_keyword, str):
                continue

            ocr_keyword = ocr_keyword.strip()
            ocr_words = set(ocr_keyword.lower().split())
            cleaned_words = set(cleaned_text.lower().split())

            overlap = cleaned_words & ocr_words

            if len(overlap) < 3:
                continue

            precision = len(overlap) / len(ocr_words) if ocr_words else 0
            recall = len(overlap) / len(cleaned_words) if cleaned_words else 0

            if precision + recall == 0:
                continue

            f1_score = 2 * precision * recall / (precision + recall)
            confidence = int(round(min(99, 50 + f1_score * 100)))

            unit_id = row['unitId']
            unit_id = None if pd.isna(unit_id) else int(unit_id) if isinstance(unit_id, float) else unit_id
            matches.append((row['itemId'], unit_id, confidence))

    # ---------- 3. Select top 3 by confidence, one per itemId ----------
    if matches:
        matches.sort(key=lambda x: x[2], reverse=True)
        seen_item_ids = set()
        for item in matches:
            if item[0] not in seen_item_ids:
                matched_items.append(item)
                seen_item_ids.add(item[0])
                if len(matched_items) == 3:
                    break

    return matched_items


# Function to fetch data from the API
def fetch_items_from_api(api_url):
    try:
        print("Fetching data from API...")
        response = requests.get(api_url)

        if response.status_code == 200:
            items_data = response.json().get('data', [])
            df = pd.DataFrame(items_data)
            required_columns = ['ocrKeyword', 'itemId', 'unitId']

            missing_columns = set(required_columns) - set(df.columns)
            if missing_columns:
                print(f"Missing columns in fetched data: {missing_columns}")
                return None

            if 'unitId' not in df.columns:
                df['unitId'] = None

            json_item = df.to_json(orient='records')
            return json_item
        else:
            print(f"Failed to fetch data. Status code: {response.status_code}")
            return None
    except Exception as e:
        print(f"An error occurred while fetching data: {e}")
        return None