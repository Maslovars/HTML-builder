const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

const originalFolder = path.join(__dirname, 'files');
const copyFolder = path.join(__dirname, 'files-copy');

async function newFile() {
    await fsPromises.rm(copyFolder, { recursive: true, force: true });
    copyDir(originalFolder, copyFolder);
}

newFile();

async function copyDir(original, copy) {
    await fsPromises.mkdir(copy, { recursive: true });
    const files = await fsPromises.readdir(original, { withFileTypes: true })
    for (const file of files) {
        if (file.isDirectory()) {
            const originalDirFolder = path.join(original, file.name);
            const copyDirFolder = path.join(copy, file.name);
            copyDir(originalDirFolder, copyDirFolder);
        }
        if (file.isFile()) {
            const originalFile = path.join(original, file.name);
            const copyFile = path.join(copy, file.name);
            fs.copyFile(originalFile, copyFile, (err) => {
                if (err) {
                    console.log(err);
                    throw err;
                }
            })
            console.log(`${file.name} copied successfully!`);
        }
    }
}
