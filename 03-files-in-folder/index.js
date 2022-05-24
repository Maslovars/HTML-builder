const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'secret-folder');

fs.readdir(filePath, (err, files) => {
    if (err) throw err;

    files.forEach((el) => {
        fs.stat(filePath + '/' + el, (err, stats) => {

            let res = '';

            if (err) throw err;
            if (stats.isFile()) {
                res += el.replace('.', ' - ');
                res += ' - ' + (stats.size / 1024) + 'kb';
                console.log(res);
            }
        });
    });
});