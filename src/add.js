import fs from 'fs';

export const addFile = (pth) => {
  fs.appendFile(pth, '', (err) => {
    if(err) console.log('whoops! there was an error');
});
};