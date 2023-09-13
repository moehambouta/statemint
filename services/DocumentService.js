import { db } from "../server.js";
import { UploadService } from "./UploadService.js";

export class DocumentService extends UploadService {
    static authenticateRequest(req, res) {
        if (!req.user) return res.status(401).send({error: "unauthorized"});
    }

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

    static getUserDocuments(req, res) {
        this.authenticateRequest(req, res);

        db.query(this.getDocsBySql("documents.user_id"), req.user.user_id, (error, results) => {
            if (error) return res.status(500).send({ error });
            res.send({documents: results});
        });
    }

    static convertFilesToPNG(uploads) {
        for (const upload of uploads) {
            if (upload.mimetype === 'application/pdf') {
                this.pdfToImage(upload.filename);
            }
        }
    }

    static setNewDocument(req, res) {
        this.authenticateRequest(req, res);

        const insertDocSql = 'INSERT INTO documents SET ?';
        const insertUploadSql = 'INSERT INTO uploads (document_id, file_path, upload_name) VALUES ?';
        const newDocument = { user_id: req.user.user_id, document_name: req.body.documentName, document_type: req.body.documentType };

        db.query(insertDocSql, newDocument, (error, results) => {
            if (error) return res.status(500).send({ error });
            const uploadsValues = req.files.map(file => [results.insertId, file.path, file.filename]);

            db.query(insertUploadSql, [uploadsValues], (error) => {
                if (error) return res.status(500).send({ error });
            });

            this.convertFilesToPNG(req.files);

            db.query(this.getDocsBySql("documents.document_id"), results.insertId, (error, rows) => {
                if (error) return res.status(500).send({ error });
                res.send({success: true, document: rows[0]});
            });
        });
    }
}
