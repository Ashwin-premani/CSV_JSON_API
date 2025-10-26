# CSV to JSON Converter API

A high-performance API for converting CSV files to JSON and uploading them to PostgreSQL with optimized batch operations.

## Features

- **CSV Parser**: Converts CSV files to JSON with support for nested properties using dot notation
- **Batch Upload**: Optimized bulk insert operations for fast data uploads
- **Age Distribution Analysis**: Efficient database-level calculations for user demographics
- **RESTful API**: Simple endpoints for data operations

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure `.env` with your database credentials and CSV path.

3. Create PostgreSQL table:
   ```sql
   CREATE TABLE public.users (
     id serial PRIMARY KEY,
     name varchar NOT NULL,
     age int NOT NULL,
     address jsonb,
     additional_info jsonb
   );
   ```

4. Run the app:
   ```bash
   npm start
   ```

## API Endpoints

### `GET /upload`
Uploads CSV data to the database and displays age distribution.
- **Response**: `{ message: 'Upload successful' }`

### `GET /calculate-age-distribution`
Calculates and returns age distribution statistics.
- **Response**: 
  ```json
  {
    "<20": "15.50",
    "20-40": "35.20",
    "40-60": "32.10",
    ">60": "17.20",
    "total": 50000
  }
  ```

### `GET /clear-database`
Clears all data from the users table.
- **Response**: `{ message: 'Database cleared' }`

## Performance Optimizations

### Upload Service
- **Batch Insert**: Uses multi-row INSERT statements with 1000-record chunks
- **Performance**: 10x faster than individual inserts (50K records: ~2 minutes → ~11 seconds)
- **Memory Efficient**: Processes data in chunks to avoid memory issues

### Age Distribution Calculation
- **Database-Level Aggregation**: Uses SQL aggregation instead of loading all data into memory
- **Performance**: 57% faster calculation (50K records: ~450ms → ~192ms)
- **Scalable**: Performance remains consistent regardless of dataset size

## CSV Format Support

The parser supports nested JSON properties using dot notation in CSV headers:

```csv
name.firstName,name.lastName,age,address.city,address.country
Ashwin,Premani,22,Mumbai,India
Dhawal,Bangade,20,Pune,India
```

This creates JSON objects like:
```json
{
  "name": { "firstName": "Ashwin", "lastName": "Premani" },
  "age": 22,
  "address": { "city": "Mumbai", "country": "India" }
}
```
