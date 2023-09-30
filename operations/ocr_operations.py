import os
import cv2
import json
import numpy as np
import pytesseract
from db_operations import DbOperations
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe' 

class OcrOperations(DbOperations):
    """
    Converts an image to string

    Args:
        image (object): image object

    Returns:
        object: image data object
    """
    @staticmethod
    def imageToData(image):
        imageData = pytesseract.image_to_data(image, output_type=pytesseract.Output.DICT)
        return imageData

    """Grayscales an image

    Returns:
        object: image object
    """
    @staticmethod
    def grayscale(image):
        return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    """Removes noise from image

    Returns:
        object: image object
    """
    @staticmethod
    def noiseRemoval(image):
        kernel = np.ones((1, 1), np.uint8)
        image = cv2.dilate(image, kernel, iterations=1)
        kernel = np.ones((1, 1), np.uint8)
        image = cv2.erode(image, kernel, iterations=1)
        image = cv2.morphologyEx(image, cv2.MORPH_CLOSE, kernel)
        image = cv2.medianBlur(image, 3)
        return (image)

    """
    For each file of each upload
    1. Gets text in image using imageToData()
    2. Stores extracted text in database
    # TODO: Implement error handling

    Args:
        document (Object): in the form of { insertId: string, uploads: Array }

    Returns:
        Array: each element of the array is a tuple which contains the text from
        a page of an uploaded file, and the id associated with the uploaded file
    """
    @classmethod
    def ocrAllImages(cls, document):
        rawData = []
        for idx, upload in enumerate(document['uploads']):
            uploadId = int(document['insertId']) + idx
            desired_extensions = ['.png', '.jpg', '.jpeg']
            images = [img for img in os.listdir(upload['destination']) 
                    if any(img.endswith(ext) for ext in desired_extensions)]

            for imgName in images:
                filePath = f"{upload['destination']}\\{imgName}"
                img = cv2.imread(filePath)
                gray = cls.grayscale(img)
                _, binary = cv2.threshold(gray, 210, 230, cv2.THRESH_BINARY)
                noNoise = cls.noiseRemoval(binary)
                ocrData = OcrOperations.imageToData(noNoise)
                rawData.append((uploadId, ocrData))
                cls.storeUploadRawData(uploadId, json.dumps(ocrData))
        return rawData