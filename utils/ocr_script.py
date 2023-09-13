# ocr_script.py
import sys
import pytesseract
from PIL import Image
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe' 

image_path = sys.argv[1]

text = pytesseract.image_to_string(Image.open(image_path))
print(text)
