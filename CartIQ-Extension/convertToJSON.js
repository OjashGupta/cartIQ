const xlsx = require('xlsx');
const fs = require('fs');

const workbook = xlsx.readFile('nutrition.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet);

fs.writeFileSync('nutrition.json', JSON.stringify(data, null, 2));