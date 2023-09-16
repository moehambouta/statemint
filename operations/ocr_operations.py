import os
import pytesseract
from PIL import Image
from db_operations import DbOperations
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe' 

class OcrOperations(DbOperations):
    """
    Converts an image to string

    Args:
        imagePath (string): absolute path to the image

    Returns:
        string: text extracted from the image
    """
    @staticmethod
    def imageToString(imagePath):
        return pytesseract.image_to_string(Image.open(imagePath))

    """
    For each file of each upload
    1. Gets text in image using imageToString()
    2. Stores extracted text in database
    TODO: Implement error handling

    Args:
        document (Object): in the form of { insertId: string, uploads: Array }
    """
    @classmethod
    def ocrAllImages(cls, document):
        for idx, upload in enumerate(document['uploads']):
            uploadId = int(document['insertId']) + idx
            desired_extensions = ['.png', '.jpg', '.jpeg']
            files = [img for img in os.listdir(upload['destination']) 
                    if any(img.endswith(ext) for ext in desired_extensions)]

            for file in files:
                filePath = f"{upload['destination']}\\{file}"
                ocrText = OcrOperations.imageToString(filePath)
                cls.storeUploadRawData(uploadId, ocrText)
