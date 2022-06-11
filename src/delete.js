import fs from 'fs';

export const deleteFile = (path1) => {
    fs.unlink(path1, function(err){
        if (err) {console.log('whoops! there was an error')}; 
    });
  };