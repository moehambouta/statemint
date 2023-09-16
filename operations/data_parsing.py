import spacy
from db_operations import DbOperations

class DataParsing(DbOperations):
    nlp = spacy.load("en_core_web_sm")

    """
    Parses data after data cleaning step
    Stores the parsed data separately in the database
    * Currently stores the raw data by separating them into sentences parsed by SpaCy.
    TODO: Implement logic for parsing the data

    Args:
        document (Object): in the form of { insertId: string, uploads: Array }
    """
    @classmethod
    def parseData(cls, cleanData):
        for rawData in cleanData:
            uploadId = rawData[1]
            doc = cls.nlp(rawData[2])
            cls.storeProcessedData(uploadId, doc.sents)
