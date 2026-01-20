const axios = require('axios');

const API = 'http://localhost:3000/urls';
const TOTAL = 10000;

async function seed() {
  for (let i = 1; i <= TOTAL; i++) {
    await axios.post(API, {
      url: `https://example.com/page-${i}` 
    });

    if (i % 500 === 0) {
      console.log(`Seeded ${i}`);
    }
  }

  console.log('Seeding completed');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
