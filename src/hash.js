import fs from 'fs';
import crypto from 'crypto';
import {createReadStream} from 'fs';

export const getHash = (filePath) => {
    
    // fs.readFile(filePath, (err, data) => {
    //     const hash = crypto.createHash('sha256');
    //     const hex = hash.update(data.toString()).digest('hex');
      
    //   console.log(hex);
    // });
    const readStream = createReadStream(filePath);
    readStream.on('error', (err) => {
        console.error('whoops! there was an error');
    });
    readStream.on('data', (chunk) =>{
      const hash = crypto.createHash('sha256');
      const hex = hash.update(chunk.toString()).digest('hex');
    
      console.log(hex);
  })
};