import fs from 'fs';

export const coPy = (path1, path2) => {
    fs.copyFile(path1, path2, err => {
        if(err) console.log('whoops! there was an error');   
     });
  };