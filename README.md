# Statemint: Financial Metadata Extractor 

A tool designed to extract and organize financial data from financial documents (currently limited to bank statements), providing a simplified and consolidated view for users.

## Current Features

1. **User Interface (UI)**:
    - Interface for uploading financial documents and a simple dashboard showing uploaded documents.
    - Document page that shows the extracted and categorized data in a simple table with two columns, "Name" and "Content".

2. **Authentication**:
    - Implements authentication to ensure data security and user confidentiality.
    - Authentication is handled through passport.js. User information gets stored in database.

3. **Database Integration**:
    - MySQL integration. Stores user, document, uploads and data information in relational database.
    - Current database has 5 tables; users, documents, uploads, raw_data, and processed_data

4. **Data Parsing**:
    - Uses SpaCy for data parsing and categorization.
    - Only supports bank statements as of right now.
    - Current app state should be able to extract:
        - Statement periods
        - Account type
        - Account number
        - Transactions
    from a statement with limited confidence due to infancy of the app.

## Future Work

- Finish current To-Do list documented throughout the code.
- Enhance the user interface for a more interactive experience.
- Implement queue based processing for handling computationally extensive tasks.
- Refine the data parsing logic to enhance accuracy and support more bank formats and financial documents.
- Incorporate machine learning to constantly improve data extraction accuracy based on feedback and corrections.
- Integrate a system where users can provide feedback on inaccuracies, which the system uses for continuous improvement.
- Implementing an analytics module for deeper financial insights.
- Provide an API for third-party applications to integrate with the platform.
- Introduce features for categorizing, tagging, and organizing processed documents.
- Allow users to create and save custom templates for frequently processed document types.
- Expanding the database structure to accommodate more diverse data and improve retrieval efficiency.

## Technologies Used

- **Frontend/UI**: React, CSS
- **Backend**: Express.js, Flask
- **Database**: MySQL
- **NLP Library**: SpaCy
