import fitz
from db_operations import DbOperations

class FileOperations(DbOperations):
    """
    Converts any pdf uploads to image files
    TODO: Implement error handling

    Args:
        document (Object): in the form of { insertId: string, uploads: Array }
    """
    @staticmethod
    def checkAndConvertUploads(document):
        desired_extensions = ['.png', '.jpg', '.jpeg']

        uploadIds = [x + int(document["insertId"]) 
                    for x, upload in enumerate(document['uploads'])
                    if not any(upload['filename'].lower().endswith(ext) for ext in desired_extensions)]

        uploads = FileOperations.getUploadsByIds(uploadIds)

        for upload in uploads:
            doc = fitz.open(upload[2])

            zoom_x = 4.0
            zoom_y = 4.0

            mat = fitz.Matrix(zoom_x, zoom_y)

            for page in doc:
                pix = page.get_pixmap(matrix=mat)
                output = f"{upload[2]}-{page.number}.png"
                pix.save(output)
