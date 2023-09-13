import fs from "fs";
import path from "path";
import cors from "cors";
import mysql from "mysql";
import express from "express";
import passport from "passport";
import { fileURLToPath } from 'url';
import bodyParser from "body-parser";
import session from "express-session";
import ViteExpress from "vite-express";
import apiRouter from "./routes/api.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import passportConfig from "./passportConfig.js";

// Establishing connection to DB before server initialization
// Database needs to be updated for production
export const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'statemint'
});

db.connect((error) => {
    if (error) throw error;
});

// Checking if 'uploads' folder exists, if not, create and export it
// Paths needs to be updated for production
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
const uploadsFolderPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsFolderPath)) {
    fs.mkdir(path.join(__dirname, 'uploads'), (error) => {
        if (error) return console.log(error);
    });
}

// Server initialization
// Cors origin and secret needs to be updated for production
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(cookieParser("secret"));
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

app.use('/api', apiRouter);
app.use('/auth', authRouter);

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));
