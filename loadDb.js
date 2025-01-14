const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function importCsv() {
  const results = [];

  fs.createReadStream('funding_data.csv')
    .pipe(csv())
    .on('data', (data) => {
      // Extract the relevant fields from the CSV
      const company = {
        name: data.Company,
        valuation: parseFloat(data['Valuation (B)']),  // Convert to float
        dateJoined: new Date(data['Date Joined']),
        country: data.Country,
        city: data.City || null,  // Some rows may not have a city
        industry: data.Industry,
        investors: data['Select Investors'] || '',  // Some rows may have missing investors
      };

      // Add to results
      results.push(company);
    })
    .on('end', async () => {
      console.log(`Parsed ${results.length} rows from the CSV file.`);

      // console.log(results)
      // Insert parsed data into the database
      for (let company of results) {
        try {
          await prisma.company.create({
            data: company,
          });
          console.log(`Inserted ${company.name}`);
        } catch (error) {
          console.error(`Error inserting company ${company.name}:`, error);
        }
      }

      await prisma.$disconnect();
    });
}

importCsv().catch((error) => {
  console.error('Error importing CSV:', error);
});
