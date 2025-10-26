import { pool } from './db.js';

// export async function uploadUsers(jsonArray) {
//   for (const user of jsonArray) {
//     const { name, age, ...rest } = user;
//     const address = user.address || null;
//     const additionalInfo = { ...rest };
//     const fullName = `${name?.firstName ?? ''} ${name?.lastName ?? ''}`.trim();

//     await pool.query(
//       `INSERT INTO users (name, age, address, additional_info)
//        VALUES ($1, $2, $3, $4)`,
//       [fullName, parseInt(age), address, additionalInfo]
//     );
//   }
// }

/*
Used the batch insert with VALUES clause for much better performance
This reduced the time taken to upload 50000 users from around 2 minutes to just 11 seconds
i.e. more than 10 times faster than the approach I used above.
*/

export async function uploadUsers(jsonArray) {
  // Process data in chunks to avoid memory issues and query size limits
  const CHUNK_SIZE = 1000;
  
  for (let i = 0; i < jsonArray.length; i += CHUNK_SIZE) {
    const chunk = jsonArray.slice(i, i + CHUNK_SIZE);
    await insertChunk(chunk);
  }
}

async function insertChunk(users) {
  const values = users.map(user => {
    const { name, age, ...rest } = user;
    const address = user.address || null;
    const additionalInfo = { ...rest };
    const fullName = `${name?.firstName ?? ''} ${name?.lastName ?? ''}`.trim();
    
    return [fullName, parseInt(age), address, additionalInfo];
  });

  const placeholders = values.map((_, index) => {
    const offset = index * 4;
    return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`;
  }).join(', ');

  const query = `
    INSERT INTO users (name, age, address, additional_info)
    VALUES ${placeholders}
  `;

  const flatValues = values.flat();
  await pool.query(query, flatValues);
}
