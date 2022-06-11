import fs from 'fs';

export const reName = (path1, path2) => {
    fs.rename(path1, path2, err => {
        if(err) console.log('whoops! there was an error'); 
     });
  };