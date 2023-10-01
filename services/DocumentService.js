import fs from "fs";
import path from "path";
import axios from 'axios';
import { db } from "../server.js";

export class DocumentService {
    /**
     * 
     * @param {Object} req request object
     * @param {Object} res response object
     * @returns error status 401 (UNAUTHORIZED) to client if user not found
     */
    static authenticateRequest(req, res) {
        if (!req.user) return res.status(401).send({error: "unauthorized"});
    }

    /**
     * TODO: Implement SQL query class
     * @param {Object} id get documents by what id
     * @returns SQL instruction
     */
    static getDocsBySql(id) {
        return `
            SELECT documents.document_id, documents.document_name, COUNT(uploads.document_id) AS total_uploads,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_count,
                SUM(CASE WHEN status = 'needsReview' THEN 1 ELSE 0 END) AS reviewPending_count,
                SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approved_count
            FROM documents INNER JOIN uploads ON documents.document_id = uploads.document_id
            WHERE ${id} = ? GROUP BY documents.document_id, documents.document_name;
        `;
    }

    /**
     * Sends data to flask server to process and store the image extracted data
     * TODO: Implement queue based system for handling tasks
     * TODO: After successful post request, send "PENDING" status back to client
     * @param {Object} data in the form of { insertId: firstUploadId, uploads: files}
     */
    static processText(data) {
        const FLASK_SERVER_URL = 'http://127.0.0.1:5000/document';

        axios.post(FLASK_SERVER_URL, data)
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.error("Error calling Flask server:", error);
        });
        
    }

    /**
     * Queries database to get all documents by a user ID
     * TODO: Implement SQL query class
     * @param {Object} req request object
     * @param {Object} res response object
     */
    static getDocumentsById(req, res) {
        this.authenticateRequest(req, res);

        db.query(this.getDocsBySql("documents.user_id"), req.user.user_id, (error, results) => {
            if (error) return res.status(500).send({ error });
            res.send({documents: results});
        });
    }

    static getDocName = (documentId) => {
        return new Promise((resolve, reject) => {
            let sql = `SELECT document_name FROM documents WHERE document_id = ?`
            db.query(sql, [documentId], (error, results) => {
                if (error) reject(error);
                else resolve(results[0].document_name);
            })
        })
    }

    static getDocUploads = (documentId) => {
        return new Promise((resolve, reject) => {
            let sql = `SELECT upload_id, file_path FROM uploads WHERE document_id = ?`
            db.query(sql, [documentId], (error, results) => {
                if (error) reject(error);
                else resolve(results);
            })
        })
    }

    static getProcessedData  = (uploadIds) => {
        return new Promise((resolve, reject) => {
            let placeholders = uploadIds.map(() => '?').join(',');
            let sql = `SELECT * FROM processed_data WHERE upload_id IN (${placeholders})`
            db.query(sql, [uploadIds], (error, results) => {
                if (error) reject(error);
                else resolve(results);
            })
        })
    }

    static getImages = (uploadId, filePath) => {
        let directoryPath = path.dirname(filePath);
        let imageFiles = fs.readdirSync(directoryPath).filter(file => ['.jpeg', '.jpg', '.png'].includes(path.extname(file)));
        for (let i = 0; i < imageFiles.length; i++) {
            imageFiles[i] = `${directoryPath.split("statemint")[1]}\\${imageFiles[i]}`;
        }
        return {uploadId, files: imageFiles};
    }

    /**
     * Queries database to get a single document by a document ID
     * TODO: Implement SQL query class
     * @param {Object} req request object
     * @param {Object} res response object
     */
    static async getDocumentById(req, res) {
        this.authenticateRequest(req, res);
        let documentInformation = {};

        try {
            let documentName = await this.getDocName(req.params.id);
            let uploads = await this.getDocUploads(req.params.id);
            let uploadIds = uploads.map(upload => upload.upload_id);
            let processedData = await this.getProcessedData(uploadIds);

            documentInformation = {
                documentName: documentName,
                documentUploads: uploads.map(({ upload_id, file_path }) => this.getImages(upload_id, file_path)),
                documentData: processedData
            };
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

        res.send(documentInformation);
    }

    /**
     * Inserts a new document and all corresponding uploads into the database
     * Sends a POST request to flask server using processText() method
     * TODO: Implement SQL query class
     * TODO: Implement asynchronous flow for firing processText()
     * @param {Object} req request object
     * @param {Object} res response object
     */
    static async setNewDocument(req, res) {
        this.authenticateRequest(req, res);

        const insertDocSql = 'INSERT INTO documents SET ?';
        const insertUploadSql = 'INSERT INTO uploads (document_id, file_path, upload_name) VALUES ?';
        const newDocument = { user_id: req.user.user_id, document_name: req.body.documentName, document_type: req.body.documentType };

        db.beginTransaction((error) => {
            if (error) return res.status(500).send({ error });

            db.query(insertDocSql, newDocument, (error, docResults) => {
                if (error) {
                    db.rollback(() => res.status(500).send({ error }));
                    return;
                }
        
                const uploadsValues = req.files.map(file => [docResults.insertId, file.path, file.filename]);

                db.query(insertUploadSql, [uploadsValues], (error, uploadResults) => {
                    if (error) {
                        db.rollback(() => res.status(500).send({ error }));
                        return;
                    }

                    const firstUploadId = uploadResults.insertId;

                    db.commit((error) => {
                        if (error) {
                            db.rollback(() => res.status(500).send({ error }));
                            return;
                        }

                        this.processText({ insertId: firstUploadId, uploads: req.files });
                        res.send({ success: true, documentId: docResults.insertId});
                    });
                });
            });
        });
    }
}
