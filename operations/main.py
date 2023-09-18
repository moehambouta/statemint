import json
from flask_cors import CORS
from flask import Flask, request
from ocr_operations import OcrOperations
from data_cleaning import DataCleaning
from data_parsing import DataParsing
from file_operations import FileOperations

app = Flask(__name__)
dataParser = DataParsing()

"""
Endpoint to process a document.
1. Checks if any pdf files exist, if yes, converts them to PNG
2. Performs OCR operation on image files, and stores the raw datas in the database
3. Cleans the raw data extracted earlier, and passes it to DataParsing
4. Cleaned data gets parsed and stored in the database
TODO: Implement error handling
TODO: Fix response to account for different types
Returns:
    object: in the form {success: boolean}
"""
@app.route('/document', methods=['POST'])
def processDocument():
    document = json.loads(request.data)

    FileOperations.checkAndConvertUploads(document)
    rawData = OcrOperations.ocrAllImages(document)
    cleanData = DataCleaning.cleanData(rawData)
    dataParser.parseData(cleanData)
    return {"success": True}

"""
Runs a Flask web application with debugging enabled.
Sets up CORS for the app,
TODO: Needs to be updated for production
"""
if __name__ == '__main__':
    app.run(debug=True)
    CORS(app)
