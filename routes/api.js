import fs from 'fs';
import path from 'path';
import multer from "multer";
import express from "express";
import { __dirname } from '../server.js';
import { DocumentService } from "../services/DocumentService.js";

var router = express.Router();

// Multer file filter that only accepts images and pdf files
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

// Multer storage that creates a folder and then saves the uploaded file there
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

// Multer upload instance
const upload = multer({ storage, fileFilter });

// API middleware functions
const setNewDocument = (req, res) => DocumentService.setNewDocument(req, res);
const getDocumentById = (req, res) => DocumentService.getDocumentById(req, res);
const getDocumentsById = (req, res) => DocumentService.getDocumentsById(req, res);

// API routes
router.post('/upload', upload.any(), setNewDocument);
router.get('/documents/:id', getDocumentById);
router.get('/documents', getDocumentsById);

export default router;
