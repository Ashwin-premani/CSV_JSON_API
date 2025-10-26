import fs from 'fs';
import path from 'path';

// Generate random test data
function generateTestCSV(numRecords = 100) {
  const firstNames = ['Rohit', 'Priya', 'Amit', 'Sneha', 'Rajesh', 'Anita', 'Vikram', 'Deepika', 'Arjun', 'Kavya'];
  const lastNames = ['Prasad', 'Sharma', 'Kumar', 'Patel', 'Singh', 'Reddy', 'Gupta', 'Iyer', 'Mehta', 'Desai'];
  const cities = ['Pune', 'Mumbai', 'Bangalore', 'Delhi', 'Chennai', 'Hyderabad', 'Kolkata'];
  const states = ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'West Bengal', 'Telangana'];
  const genders = ['male', 'female', 'other'];
  const hobbies = ['reading', 'cricket', 'music', 'cooking', 'traveling', 'gaming'];
  
  // CSV Header
  const headers = [
    'name.firstName',
    'name.lastName',
    'age',
    'address.line1',
    'address.line2',
    'address.city',
    'address.state',
    'gender',
    'phone.mobile',
    'phone.home',
    'hobbies',
    'education.degree',
    'education.university'
  ];
  
  let csvContent = headers.join(',') + '\n';
  
  // Generate records
  for (let i = 0; i < numRecords; i++) {
    const age = Math.floor(Math.random() * 70) + 15; // Age between 15-85
    const record = [
      firstNames[Math.floor(Math.random() * firstNames.length)],
      lastNames[Math.floor(Math.random() * lastNames.length)],
      age,
      `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(Math.random() * 999) + 1} ${['Rakshak Society', 'Green Park', 'Lake View', 'Royal Apartments'][Math.floor(Math.random() * 4)]}`,
      ['New Pune Road', 'MG Road', 'Ring Road', 'Main Street'][Math.floor(Math.random() * 4)],
      cities[Math.floor(Math.random() * cities.length)],
      states[Math.floor(Math.random() * states.length)],
      genders[Math.floor(Math.random() * genders.length)],
      `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      `022-${Math.floor(Math.random() * 90000000) + 10000000}`,
      hobbies[Math.floor(Math.random() * hobbies.length)],
      ['B.Tech', 'M.Tech', 'MBA', 'B.Sc', 'M.Sc', 'B.Com'][Math.floor(Math.random() * 6)],
      ['Pune University', 'Mumbai University', 'IIT', 'NIT', 'Anna University'][Math.floor(Math.random() * 5)]
    ];
    
    csvContent += record.join(',') + '\n';
  }
  
  return csvContent;
}

// Generate different test files
const testCases = [
  { name: 'small_test.csv', records: 10 },
  { name: 'medium_test.csv', records: 1000 },
  { name: 'large_test.csv', records: 50000 }
];

// Create test-data directory if it doesn't exist
const testDataDir = path.join(process.cwd(), 'test-data');
if (!fs.existsSync(testDataDir)) {
  fs.mkdirSync(testDataDir);
}

// Generate test files
testCases.forEach(testCase => {
  const csvData = generateTestCSV(testCase.records);
  const filePath = path.join(testDataDir, testCase.name);
  fs.writeFileSync(filePath, csvData);
  console.log(`Generated ${testCase.name} with ${testCase.records} records`);
});

console.log('\nTest CSV files generated successfully in test-data/ directory');