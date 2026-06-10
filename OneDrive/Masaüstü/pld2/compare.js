const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dir1 = 'c:\\Users\\ehmed\\OneDrive\\Masaüstü\\pld2\\pld-management-app';
const dir2 = 'c:\\Users\\ehmed\\OneDrive\\Masaüstü\\pld2\\pld-management-app-new-main\\pld-management-app-new-main';

function getFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git') continue;
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getFiles(filePath, fileList);
        } else {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const files2 = getFiles(dir2);
const report = [];

for (const f of files2) {
    const rel = f.substring(dir2.length);
    const f1 = path.join(dir1, rel);
    if (!fs.existsSync(f1)) {
        report.push(`Added: ${rel}`);
    } else {
        const hash1 = crypto.createHash('md5').update(fs.readFileSync(f1)).digest('hex');
        const hash2 = crypto.createHash('md5').update(fs.readFileSync(f)).digest('hex');
        if (hash1 !== hash2) {
            report.push(`Modified: ${rel}`);
        }
    }
}

fs.writeFileSync(path.join(dir1, 'diff_report.txt'), report.join('\n'), 'utf8');
console.log('Done');
