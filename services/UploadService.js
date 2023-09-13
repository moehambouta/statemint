import path from 'path';
import pdf from 'pdf-poppler';
import { __dirname } from '../server.js';
import { spawn } from 'child_process';

export class UploadService {
    static getFilePath(filename) {
        return path.join(__dirname, "uploads", filename, filename);
    }

    static pdfToImage(filename) {
        let file = this.getFilePath(filename);

        let opts = {
            format: 'png',
            out_dir: path.dirname(file),
            out_prefix: path.basename(file, path.extname(file)),
            page: null
        };

        pdf.convert(file, opts).catch(error => console.log(error));
    }

    static runPythonScript(imagePath) {
        return new Promise((resolve, reject) => {
            const pythonProcess = spawn('python', ['./utils/ocr_script.py', imagePath]);
            
            let dataString = '';
            pythonProcess.stdout.on('data', (data) => {
                dataString += data.toString();
            });
    
            pythonProcess.stderr.on('data', (data) => {
                reject(data.toString());
            });
    
            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    reject(`Python script exited with code: ${code}`);
                } else {
                    resolve(dataString);
                }
            });
        });
    }
}
