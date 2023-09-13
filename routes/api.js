import fs from 'fs';
import path from 'path';
import multer from "multer";
import express from "express";
import { __dirname } from '../server.js';
import { DocumentService } from "../services/DocumentService.js";

var router = express.Router();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const dir = path.join(__dirname, 'uploads', uniqueSuffix + '-' + file.originalname);

        req.uniqueSuffix = uniqueSuffix;

        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, req.uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage, fileFilter });

router.post('/upload', upload.any(), (req, res) => DocumentService.setNewDocument(req, res));
router.get('/documents', (req, res) => DocumentService.getUserDocuments(req, res));

export default router;
