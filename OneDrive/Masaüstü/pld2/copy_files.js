const fs = require('fs');
const path = require('path');

const srcDir = 'c:\\Users\\ehmed\\OneDrive\\Masaüstü\\pld2\\pld-management-app-new-main\\pld-management-app-new-main';
const destDir = 'c:\\Users\\ehmed\\OneDrive\\Masaüstü\\pld2\\pld-management-app';

// Backup db.json
const dbSrc = path.join(destDir, 'server', 'db.json');
const dbBackup = path.join(destDir, 'server', 'db.json.backup');
if (fs.existsSync(dbSrc)) {
    fs.copyFileSync(dbSrc, dbBackup);
    console.log('Backed up db.json to db.json.backup');
}

// Read diff report to get list of files
const diffReportPath = path.join(destDir, 'diff_report.txt');
const lines = fs.readFileSync(diffReportPath, 'utf8').split('\n');

for (const line of lines) {
    if (!line.trim()) continue;
    const parts = line.split(': ');
    if (parts.length < 2) continue;

    // The path from diff format
    const relativePath = parts[1].trim();

    const sourceFile = path.join(srcDir, relativePath);
    const destFile = path.join(destDir, relativePath);

    // Ensure destination directory exists
    const destFileDir = path.dirname(destFile);
    if (!fs.existsSync(destFileDir)) {
        fs.mkdirSync(destFileDir, { recursive: true });
    }

    // Copy file
    if (fs.existsSync(sourceFile)) {
        fs.copyFileSync(sourceFile, destFile);
        console.log(`Copied: ${relativePath}`);
    } else {
        console.log(`Source file missing: ${sourceFile}`);
    }
}

console.log('All files copied successfully.');
