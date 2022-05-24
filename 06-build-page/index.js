const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

const assetsPath = path.join(__dirname, 'assets');
const stylesPath = path.join(__dirname, 'styles');
const htmlPath = path.join(__dirname, 'components');
const projectPath = path.join(__dirname, 'project-dist');
const assets = path.join(projectPath, 'assets');
const styles = path.join(projectPath, 'style.css');
const indexHtml = path.join(projectPath, 'index.html');
let template = '';

async function addProject() {
    await fsPromises.rm(projectPath, { recursive: true, force: true });
    await fsPromises.mkdir(projectPath, { recursive: true });
    template = await fsPromises.readFile(path.join(__dirname, 'template.html'), 'utf-8');
    copyAssets(assetsPath, assets);
    bundleHtml();
    bundleStyles();
}

addProject();

async function copyAssets(original, project) {
    await fsPromises.mkdir(project, { recursive: true });
    const files = await fsPromises.readdir(original, { withFileTypes: true });
    for (const file of files) {
        if (file.isDirectory()) {
            const folder = path.join(original, file.name);
            const copyFolder = path.join(project, file.name);
            if (folder !== projectPath) {
                copyAssets(folder, copyFolder);
            }
        }
        if (file.isFile()) {
            const originalPath = path.join(original, file.name);
            const copyPath = path.join(project, file.name);
            fs.copyFile(originalPath, copyPath, (err) => { if (err) { throw err } });
        }
    }
}

async function bundleStyles() {
    const files = await fsPromises.readdir(stylesPath, { withFileTypes: true });
    for (let i = 0; i < files.length; i++) {
        const extNameFile = path.extname(files[i].name);
        if (files[i].isFile()) {
            if (extNameFile === '.css') {
                const file = path.join(stylesPath, files[i].name);
                const data = await fsPromises.readFile(file, 'utf-8');
                await fsPromises.appendFile(styles, data);
            }
        }
    }
}

async function bundleHtml() {
    const files = await fsPromises.readdir(htmlPath, { withFileTypes: true });
    for (let i = 0; i < files.length; i++) {
        const nameExtFile = path.extname(files[i].name);
        if (nameExtFile === '.html') {
            if (files[i].isFile()) {
                const fileName = path.basename(files[i].name, path.extname(files[i].name));
                const variable = `{{${fileName}}}`;
                const file = path.join(htmlPath, files[i].name);
                const data = await fsPromises.readFile(file, 'utf-8');
                template = template.replace(variable, data);
                fs.writeFile(indexHtml, template, (err) => {
                    if (err) { throw err }
                });
            }
        }
    }
}