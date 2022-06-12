import * as readline from 'node:readline';
import { stdin as input, stdout as output } from 'process';
import process from 'node:process';
import { chdir, cwd } from 'node:process';
import os  from 'node:os';
import fs from 'fs';
import {createReadStream} from 'fs';
import { ReadStream } from 'node:fs';
import path from 'path';
import zlib from 'zlib';
import crypto from 'crypto';

import {osObject} from './os-methods.js';
import {getHash} from './hash.js';
import {addFile} from './add.js';
import {reName} from './rename.js';
import {coPy} from './copy.js';
import {moveFile} from './move-file.js';
import {deleteFile} from './delete.js';


let currentPlace = os.homedir();
const myArgv = process.argv.slice(2);
const rl = readline.createInterface({input: process.stdin,output: process.stdout});
process.chdir(`${currentPlace}`);
console.log(`Welcome to the File Manager, ${myArgv[0].slice(11)}!`)
console.log(`You are currently in ${currentPlace}`)



rl.on('line', (input) => {
   
    
    // change dir
    if (input.slice(0,2) === 'cd' && input.slice(2).length>0) {
        let link = input.split(' ');
        
        if (path.isAbsolute(link[1]) === false){
            currentPlace = path.resolve(cwd(), link[1]);
            try {
                process.chdir(currentPlace);
            } catch (err) {
                console.error("error while changing directory");
            }
        } else if (path.isAbsolute(link[1]) === true) {
            try {
                process.chdir(link[1]);
                console.log("directory has successfully been changed");
            } catch (err) {
                console.error("error while changing directory");
            }
        }
    }

    // prev dir
    if (input === 'up') {
        currentPlace = path.parse(cwd()).dir;
        process.chdir(currentPlace);
    }
    
    // read content
    if (input.slice(0,3) === 'cat') {
        let file = input.slice(4);
        if (path.isAbsolute(file) === false){
            const readStream = createReadStream(path.resolve(cwd(), file));
            readStream.on('error', (err) => {
                console.error('whoops! there was an error');
            });
            readStream.on('data', (chunk) =>{
                console.log(chunk.toString());
            })
        } else if (path.isAbsolute(file) === true) {
            const readStream = createReadStream(file);
            readStream.on('error', (err) => {
                console.error('whoops! there was an error');
            });
            readStream.on('data', (chunk) =>{
                console.log(chunk.toString());
            })
        }
    }

    // create file
    if (input.slice(0,3) === 'add') {
        let fileName = input.slice(4);
            if (path.isAbsolute(fileName) === false){
                let way = path.resolve(cwd(), fileName);
                addFile(way);
            } else if (path.isAbsolute(fileName) === true) {
                let way = path.resolve(fileName);
                addFile(way);
            }
    }

    // rename file
    if (input.slice(0,2) === 'rn') {
        let newfileName = input.slice(3);
        let fileExtension = path.extname(newfileName);
        let firstNameEnd = newfileName.indexOf(fileExtension);
        let secondNameEnd = newfileName.lastIndexOf(fileExtension);
        let existFile = newfileName.slice(0,firstNameEnd+fileExtension.length);
        let renameFile = newfileName.slice(firstNameEnd+fileExtension.length+1,secondNameEnd+fileExtension.length);
        let existPath = path.parse(path.resolve(cwd(),existFile)).dir;
        let firstPath = path.resolve(cwd(),existFile);
        let secondPath = path.resolve(existPath, renameFile);
        reName(firstPath, secondPath);
    }

    // copy file
    if (input.slice(0,2) === 'cp') {
        let newfileName = input.slice(3);
        let fileExtension = path.extname(newfileName);
        let firstNameEnd = newfileName.indexOf(fileExtension);
        let secondNameEnd = newfileName.lastIndexOf(fileExtension);
        let existFile = newfileName.slice(0,firstNameEnd+fileExtension.length);
        let renameFile = newfileName.slice(firstNameEnd+fileExtension.length+1,secondNameEnd+fileExtension.length);
        if (path.isAbsolute(renameFile) === false){
            let firstPath = path.resolve(cwd(),existFile);
            let secondPath = path.resolve(cwd(), renameFile);
            coPy(firstPath, secondPath);
        } else {
            let firstPath = path.resolve(cwd(),existFile);
            let secondPath = path.resolve(renameFile);
            coPy(firstPath, secondPath);
        }        
    }

    // move file
    if (input.slice(0,2) === 'mv') {
        let newfileName = input.slice(3);
        let fileExtension = path.extname(newfileName);
        let firstNameEnd = newfileName.indexOf(fileExtension);
        let secondNameEnd = newfileName.lastIndexOf(fileExtension);
        let existFile = newfileName.slice(0,firstNameEnd+fileExtension.length);
        let newPath = newfileName.slice(firstNameEnd+fileExtension.length+1,secondNameEnd+fileExtension.length);
        if (path.isAbsolute(newPath) === false){
            let firstDir = path.resolve(cwd(), existFile);
            let secondDir = path.resolve(cwd(), newPath);
            moveFile(firstDir, secondDir);
        } else if (path.isAbsolute(newPath) === true) {
            let firstDir = path.resolve(cwd(), existFile);
            let secondDir = path.resolve(newPath);
            moveFile(firstDir, secondDir);
        }
    }
    
    
    // read content current dirrectory
    if (input === 'ls') {
        fs.readdir(`${cwd()}`, (err, files) => {
            const filesArr = [];
            files.forEach(file => {
            filesArr.push(file);
            });
            console.log(filesArr);
        });
    }

    // OS-METHODS

    if (input.slice(0, 2) === 'os') {
        let command = input.split(' ');
        if (command[1] === '--EOL') {
            osObject.eol();
        } else if (command[1] === '--cpus') {
            osObject.cpus();
        } else if (command[1] === '--homedir') {
            osObject.homeDir();
        } else if (command[1] === '--username') {
            osObject.userName();
        } else if (command[1] === '--architecture') {
            osObject.arch();
        }
    }

    //Get hash
    if (input.slice(0, 4) === 'hash') {
        let newfileName = input.slice(5);
        let fileExtension = path.extname(newfileName);
        let firstNameEnd = newfileName.indexOf(fileExtension);
        let existFile = newfileName.slice(0,firstNameEnd+fileExtension.length);
        if (path.isAbsolute(existFile) === false){
            let hashPath  = path.resolve(cwd(), existFile)
            getHash(hashPath);
        } else if (path.isAbsolute(existFile) === true) {
            let hashPath  = path.resolve(existFile)
            getHash(hashPath);
        }
    }

    //Compress file
    if (input.slice(0, 8) === 'compress') {
        let newfileName = input.slice(9);
        let fileExtension = path.extname(newfileName);
        let firstNameEnd = newfileName.indexOf(fileExtension);
        let secondNameEnd = newfileName.lastIndexOf(fileExtension);
        let existFile = newfileName.slice(0,firstNameEnd+fileExtension.length);
        let newPath = newfileName.slice(firstNameEnd+fileExtension.length+1,secondNameEnd+fileExtension.length);
        if (path.isAbsolute(newPath) === false){
            const inp = fs.createReadStream((path.resolve(cwd(), existFile)));
            inp.on('error', (err) => {
                console.error('whoops! there was an error in input value');
            });
            const out = fs.createWriteStream((path.resolve(cwd(), newPath+'.br')));
            out.on('error', (err) => {
                console.error('whoops! there was an error in output value');
            });
            const brot = zlib.createBrotliCompress();
            inp.pipe(brot).pipe(out);
            console.log("Program Completed!");
        } else if (path.isAbsolute(newPath) === true) {
             const inp = fs.createReadStream((path.resolve(cwd(), existFile)));
            inp.on('error', (err) => {
                console.error('whoops! there was an error in input value');
            });
            const out = fs.createWriteStream((path.resolve(cwd(), newPath+'.br')));
            out.on('error', (err) => {
                console.error('whoops! there was an error in output value');
            });
            const brot = zlib.createBrotliCompress();
            inp.pipe(brot).pipe(out);
            console.log("Program Completed!");
        }
    }

    // decompress
    if (input.slice(0, 10) === 'decompress') {
        let newfileName = input.slice(11);
        let fileExtension = path.extname(newfileName).split(' ');
        let firstNameEnd = newfileName.indexOf(fileExtension[0]);
        let existFile = newfileName.slice(0, firstNameEnd + fileExtension[0].length);
        let newPath = newfileName.slice(firstNameEnd+fileExtension[0].length+1);
        
        if (path.isAbsolute(newPath) === false){
        const inp = fs.createReadStream((path.resolve(cwd(), existFile)));
        inp.on('error', (err) => {
            console.error('whoops! there was an error in input value');
        });
        const file = path.parse((path.resolve(cwd(), existFile))).name;
        const out = fs.createWriteStream((path.resolve(cwd(), newPath, file)));
        out.on('error', (err) => {
            console.error('whoops! there was an error in output value');
        });
        const brot = zlib.createBrotliDecompress();
        inp.pipe(brot).pipe(out);
        } else if (path.isAbsolute(newPath) === true) {
        
        const inp = fs.createReadStream((path.resolve(cwd(), existFile)));
        inp.on('error', (err) => {
            console.error('whoops! there was an error in input value');
        });
        const file = path.parse((path.resolve(cwd(), existFile))).name;
        console.log(newPath)
        console.log(file)
        console.log((path.resolve(newPath, file)))
        const out = fs.createWriteStream((path.resolve(newPath, file)));
        
        out.on('error', (err) => {
            console.error('whoops! there was an error in output value');
        });
        const brot = zlib.createBrotliDecompress();
        inp.pipe(brot).pipe(out);
        }
        
    }

    // delete file

    if (input.slice(0, 6) === 'delete') {
        let newfileName = input.slice(7);
        let fileExtension = path.extname(newfileName);
        let firstNameEnd = newfileName.indexOf(fileExtension);
        let existFile = newfileName.slice(0,firstNameEnd+fileExtension.length);
        
        if (path.isAbsolute(existFile) === false){
        const pathDir = path.resolve(cwd(), existFile);
        deleteFile(pathDir);
        } else if (path.isAbsolute(existFile) === true) {
            const pathDir = path.resolve(existFile);
            deleteFile(pathDir);
        }
    }

    if (!input.includes('up', 0) && !input.includes('cd', 0) && !input.includes('ls', 0) && !input.includes('cat', 0) && !input.includes('add', 0) && !input.includes('rn', 0) && !input.includes('cp', 0) && !input.includes('mv', 0) && !input.includes('rm', 0) && !input.includes('os', 0) && !input.includes('hash', 0) && !input.includes('compress', 0) && !input.includes('decompress', 0)) {
        console.log('Invalid input')
    }
    
    
    console.log(`You are currently in ${cwd()}\nPlease enter command`)
    // end
    if (input === '.exit') {
        console.log(`Thank you for using File Manager, ${myArgv[0].slice(11)}`);
        rl.close();
    }
}); 


rl.on('SIGINT', () => {
    console.log(`Thank you for using File Manager, ${myArgv[0].slice(11)}`);
    rl.close();
});
