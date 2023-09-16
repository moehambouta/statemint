from db_operations import DbOperations

class DataCleaning(DbOperations):
    """
    Cleans data extracted from OCR operations
    * Currently returns raw data since no logic is implemented
    TODO: Implement logic for cleaning the data

    Args:
        document (Object): in the form of { insertId: string, uploads: Array }
    """
    @staticmethod
    def cleanData(document):
        uploadIds = [x + int(document["insertId"]) for x in range(len(document['uploads']))]
        return DataCleaning.getRawDataByUploadIds(uploadIds)
