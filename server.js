import express from 'express';
import dotenv from 'dotenv';
import { parseCSV } from './csvParser.js';
import { uploadUsers } from './uploadService.js';
import { pool } from './db.js';

dotenv.config();
const app = express();
const PORT = 3000;

app.get('/upload', async (req, res) => {
  try {
    const data = parseCSV(process.env.CSV_PATH);
    // console.log(data);
    await uploadUsers(data);
    console.log(await calculateAgeDistribution());
    res.json({ message: 'Upload successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.get('/calculate-age-distribution', async (req, res) => {
  const data = await calculateAgeDistribution();
  res.json(data);
});

//Clear the database
app.get('/clear-database', async (req, res) => {
  await pool.query('DELETE FROM users');
  res.json({ message: 'Database cleared' });
});

// async function calculateAgeDistribution() {
//   const result = await pool.query('SELECT age FROM users');
//   // console.log(result.rows);
  
//   const total = result.rows.length;
//   const groups = { '<20': 0, '20-40': 0, '40-60': 0, '>60': 0, 'total': total };

//   result.rows.forEach(({ age }) => {
//     if (age < 20) groups['<20']++;
//     else if (age <= 40) groups['20-40']++;
//     else if (age <= 60) groups['40-60']++;
//     else groups['>60']++;
//   });

//   Object.keys(groups).forEach(k => {
//     groups[k] = ((groups[k] / total) * 100).toFixed(2);
//   });
//   groups['total'] = total;
//   return groups;
// }

/*
Calculate age distribution directly in the database for better performance 
This reduced the time taken to calculate the age distribution from around 450 ms to 192 ms 
for 50000 users i.e. by 57.33%.
*/
async function calculateAgeDistribution() {
  const result = await pool.query(`
    SELECT 
      COUNT(CASE WHEN age < 20 THEN 1 END) as under_20,
      COUNT(CASE WHEN age >= 20 AND age <= 40 THEN 1 END) as age_20_40,
      COUNT(CASE WHEN age > 40 AND age <= 60 THEN 1 END) as age_40_60,
      COUNT(CASE WHEN age > 60 THEN 1 END) as over_60,
      COUNT(*) as total
    FROM users
  `);
  
  const { under_20, age_20_40, age_40_60, over_60, total } = result.rows[0];
  
  return {
    '<20': ((under_20 / total) * 100).toFixed(2),
    '20-40': ((age_20_40 / total) * 100).toFixed(2),
    '40-60': ((age_40_60 / total) * 100).toFixed(2),
    '>60': ((over_60 / total) * 100).toFixed(2),
    total: total
  };
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
