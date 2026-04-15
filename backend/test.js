const axios = require('axios');

async function testApi() {
  try {
    const response = await axios.post('http://localhost:3000/api/analyze', {
      symptoms: 'I have a high fever, a dry cough, and I feel very tired.'
    });
    console.log('Success!', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testApi();
