import fs from 'fs';
import crypto from 'crypto';
import {createReadStream} from 'fs';

export const getHash = (filePath) => {
    
  
    const readStream = createReadStream(filePath);
    const fileVoid = [];
    readStream.on('error', (err) => {
        console.error('whoops! there was an error');
    });
      readStream.on('data', (chunk) =>{
      const hash = crypto.createHash('sha256');
      const hex = hash.update(chunk.toString()).digest('hex');
      console.log(hex);
      const result = chunk.toString();
      fileVoid.push(chunk.toString());
      
      
  })
    readStream.on('end', () => {if (fileVoid.length === 0) {
      console.log('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    }});

      
};