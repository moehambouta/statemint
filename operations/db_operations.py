from db_config import mydb, mycursor

"""
Database operations class
TODO: Implement error handling
TODO: Simplify functions by abstracting operations
"""
class DbOperations:
    db = mydb
    cursor = mycursor

    @classmethod
    def getRawDataByUploadIds(cls, uploadIds):
        placeholders = ', '.join(['%s'] * len(uploadIds))
        getRawDataByUploadIdsSql = "SELECT * FROM raw_data WHERE upload_id IN (%s)" % placeholders
        cls.cursor.execute(getRawDataByUploadIdsSql, uploadIds)
        return cls.cursor.fetchall()

    @classmethod
    def storeUploadRawData(cls, uploadId, ocr):
        insertRawDataSql = "INSERT INTO raw_data (upload_id, data) VALUES (%s, %s)"
        cls.cursor.execute(insertRawDataSql, (uploadId, ocr))
        cls.db.commit()

    """
    TODO: Update processed_data column category_id to take a string instead
    """
    @classmethod
    def storeProcessedData(cls, uploadId, sents):
        insertProcessedDataVals = [(uploadId, 1, x.text) for x in sents]
        insertProcessedDataSql = "INSERT INTO processed_data (upload_id, category_id, content) VALUES (%s, %s, %s)"
        cls.cursor.executemany(insertProcessedDataSql, insertProcessedDataVals)
        cls.db.commit()

    @classmethod
    def getUploadsByIds(cls, uploadIds):
        placeholders = ', '.join(['%s'] * len(uploadIds))
        getUploadsByIdsSql = "SELECT * FROM uploads WHERE upload_id IN (%s)" % placeholders
        cls.cursor.execute(getUploadsByIdsSql, tuple(uploadIds))
        return cls.cursor.fetchall()
