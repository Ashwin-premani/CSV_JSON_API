import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

/**
 * parses a CSV file and converts it to an array of JSON objects
 * supports nested properties using dot notation in headers (e.g., "user.name")
 */
export function parseCSV(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  const content = fs.readFileSync(fullPath, 'utf-8').trim();
  const [headerLine, ...lines] = content.split('\n');
  const headers = headerLine.split(',').map(h => h.trim());

  // helper function to create nested objects from dot-notation keys
  // for example: "user.name" becomes { user: { name: "value" } }
  const parseNested = (obj, keys, value) => {
    if (keys.length === 1) {
      obj[keys[0]] = value;
    } else {
      const key = keys.shift();
      obj[key] = obj[key] || {};
      parseNested(obj[key], keys, value);
    }
  };

  return lines.map(line => {
    const values = line.split(',').map(v => v.trim());
    const rowObj = {};
    
    headers.forEach((header, index) => {
      const keys = header.split('.');
      parseNested(rowObj, keys, values[index]);
    });
    
    return rowObj;
  });
}


// const data = parseCSV(process.env.CSV_PATH);
// console.log(data);