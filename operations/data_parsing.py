import spacy
from db_operations import DbOperations
from spacy.matcher import Matcher, PhraseMatcher

class DataParsing(DbOperations):
    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")
        self.matcher = Matcher(self.nlp.vocab)
        self.phrase_matcher = PhraseMatcher(self.nlp.vocab)
        self.addPatterns()

    def addPatterns(self):
        self.addBankNamePattern()
        self.addStartAndEndPattern()
        self.addAccountTypePattern()
        self.addAccountNumberPattern()
        self.addTransactionHeaderPattern()
        self.addTransactionPattern()

    # TODO: Think about different logic for finding bank names
    def addBankNamePattern(self):
        bank_names = ["fifth third bank", "jpmorgan chase bank", "huntington bank"]
        patterns = [self.nlp.make_doc(name) for name in bank_names]
        self.phrase_matcher = PhraseMatcher(self.nlp.vocab, attr="LOWER")
        self.phrase_matcher.add("BANK_NAME", None, *patterns)

    def addStartAndEndPattern(self):
        date_regex_long = {"TEXT": {"REGEX": "\d{1,2}/\d{1,2}/\d{4}"}}
        date_regex_short = {"TEXT": {"REGEX": "\d{1,2}/\d{1,2}/\d{2}"}}
        month = {"POS": "PROPN"}
        day = {"SHAPE": "dd", "OP": "?"}
        year = {"SHAPE": "dddd"}
        pattern1 = [
            date_regex_long,
            {"TEXT": "-", "OP": "?"},
            {"IS_SPACE": True, "OP": "?"},
            date_regex_long
        ]
        pattern2 = [
            month,
            day,
            {"ORTH": ",", "OP": "?"},
            year,
            {"POS": "ADP"},
            month,
            day,
            {"ORTH": ",", "OP": "?"},
            year
        ]
        pattern3 = [
            date_regex_short,
            {"LOWER": "to"},
            date_regex_short
        ]
        self.matcher.add("STATEMENT_PERIOD", [pattern1, pattern2, pattern3], greedy="LONGEST")

    # TODO: Add better account type parsing to match with account numbers not explicitly labeled
    def addAccountTypePattern(self):
        account_type_pattern = [
            {"LOWER": "account"},
            {"LOWER": "type"},
            {"ORTH": ":"},
            {"IS_SPACE": True, "OP": "?"},
            {"POS": {"IN": ["NOUN", "NUM", "PUNCT", "PROPN", "SYM", "X"]}, "OP": "+"}
        ]
        self.matcher.add("ACCOUNT_TYPE", [account_type_pattern], greedy="LONGEST")

    # TODO: Fix method to accommodate obfuscated numbers
    def addAccountNumberPattern(self):
        account_number_pattern = [
            {"LOWER": "account"},
            {"LOWER": "number", "OP": "?"},
            {"ORTH": ":"},
            {"IS_SPACE": True, "OP": "?"},
            {"TEXT": {"REGEX": "[-\d]+"}}
        ]
        self.matcher.add("ACCOUNT_NUMBER", [account_number_pattern])

    def addTransactionHeaderPattern(self):
        header_pattern = [{"LOWER": "date"}, {"LOWER": "amount"}, {"LOWER": "description"}]
        self.matcher.add("HEADER", [header_pattern])

    def addTransactionPattern(self):
        amount_regex = "\d+\.\d{2}"
        pattern = [
            {"TEXT": {"REGEX": "\d{2}/\d{2}"}},
            {"IS_SPACE": True, "OP": "*"},
            {"TEXT": {"REGEX": amount_regex}},
            {"IS_SPACE": True, "OP": "*"}
        ]
        self.matcher.add("TRANSACTION", [pattern], greedy="LONGEST")

    """
    Parses data after data cleaning step
    Stores the parsed data separately in the database

    Args:
        cleanData (Array): list of tuples (upload id: int, data: object)
        each tuple is the ocr text and locations of a page on an uploaded
        file and the id associated with the uploaded file
    """
    def parseData(self, cleanData):
        for page in cleanData:
            allMatches = []
            pageText = " ".join(page[1]["text"])
            doc = self.nlp(pageText)

            for _, start, end in self.phrase_matcher(doc):
                span = doc[start:end]
                allMatches.append((page[0], span.text, "BANK_NAME"))

            for match_id, start, end in self.matcher(doc):
                string_id = self.nlp.vocab.strings[match_id]
                span = doc[start:end]
                if string_id == "TRANSACTION" or string_id == "HEADER":
                    continue
                allMatches.append((page[0], span.text, string_id))

            header_indices = [match[1] for match in self.matcher(doc) if self.nlp.vocab.strings[match[0]] == "HEADER"]
            if header_indices:
                if len(header_indices) == 1:
                    sections = [(header_indices[0], len(doc))]
                else:
                    sections = [(header_indices[i], header_indices[i + 1]) for i in range(len(header_indices) - 1)]
                    sections.append((header_indices[-1], len(doc)))

                lastBoundary = 0
                for start, end in sections:
                    section = doc[start:end]
                    matches = self.matcher(section)
                    matches = sorted(matches, key=lambda match: match[1])
                    for match_id, start, end in matches:
                        if self.nlp.vocab.strings[match_id] == "TRANSACTION" and lastBoundary != 0:
                            matched_span = section[lastBoundary:start]
                            allMatches.append((page[0], matched_span.text, "TRANSACTION"))
                        lastBoundary = start

            self.storeProcessedData(allMatches)
