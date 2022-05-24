const path = require('path');
const fsPromises = require('fs/promises');

const project = path.join(__dirname, 'project-dist');
const bundle = path.join(project, 'bundle.css');
const styles = path.join(__dirname, 'styles');

copyDir();

async function copyDir() {
    await fsPromises.rm(bundle, { recursive: true, force: true });
    createBundle();
}

async function createBundle() {
    const files = await fsPromises.readdir(styles, { withFileTypes: true });
    for (let i = 0; i < files.length; i++) {
        const fileName = path.extname(files[i].name);
        if (files[i].isFile()) {
            if (fileName === '.css') {
                const file = path.join(styles, files[i].name);
                const data = await fsPromises.readFile(file, 'utf-8');
                await fsPromises.appendFile(bundle, data);
            }
        }
    }
}