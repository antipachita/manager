import fs from 'fs';
import crypto from 'crypto';

export const getHash = (filePath) => {
    
    fs.readFile(filePath, (err, data) => {
        const hash = crypto.createHash('sha256');
        const hex = hash.update(data.toString()).digest('hex');
      
      console.log(hex);
    });
};