export const retnName = (pth) => {
    fs.appendFile(pth, '', (err) => {
      if(err) console.log('whoops! there was an error');
  });
  };