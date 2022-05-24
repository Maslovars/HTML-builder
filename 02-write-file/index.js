const fs = require('fs');
const path = require('path');
const readline = require('readline');

let filePath = path.join(__dirname, 'text.txt');
let writeStream = fs.createWriteStream(filePath);
let readLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

readLine.question('Write something here:', (text) => {
    writeStream.write(text, function (error) {
        if (error) throw error
    })
});

readLine.on('line', (text) => {
    if (text === 'exit') readLine.close();
    writeStream.write(`\n${text}`, function (error) {
        if (error) throw error
    })
});

readLine.on('close', () => {
    console.log('Closed, bye!');
    process.exit();
});