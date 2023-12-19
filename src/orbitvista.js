const express = require('express');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

// Configurando parámetros para Voyager 1
const voyager1Params = {
  target: 'Voyager 1',
  quantities: '1,9',
  epochs: 'now',
  observatory_code: '500',
  ref_system: 'J2000',
  format: 'json',
};

// Configurando parámetros para Voyager 2
const voyager2Params = {
  target: 'Voyager 2',
  quantities: '1,9',
  epochs: 'now',
  observatory_code: '500',
  ref_system: 'J2000',
  format: 'json',
};

// Constructing the URL for the Horizons API for Voyager 1
const horizonsUrlVoyager1 = 'https://ssd.jpl.nasa.gov/horizons_batch.cgi?' + new URLSearchParams(voyager1Params);

// Constructing the URL for the Horizons API for Voyager 2
const horizonsUrlVoyager2 = 'https://ssd.jpl.nasa.gov/horizons_batch.cgi?' + new URLSearchParams(voyager2Params);

// Making GET requests to the Horizons API using axios for both Voyager 1 and Voyager 2
app.get('/', async (req, res) => {
  try {
    const responseVoyager1 = await axios.get(horizonsUrlVoyager1);
    const responseVoyager2 = await axios.get(horizonsUrlVoyager2);
    
    const $1 = cheerio.load(responseVoyager1.data);
    const $2 = cheerio.load(responseVoyager2.data);

    // Extract specific information for both Voyager 1 and Voyager 2
    const targetInfoVoyager1 = $1('pre').text();
    const targetInfoVoyager2 = $2('pre').text();

    // Read the HTML template from index.html
    const htmlTemplate = fs.readFileSync('./public/index.html', 'utf8');

    // Replace the placeholders with the extracted information
    const htmlContent = htmlTemplate
      .replace('<!-- DATA_PLACEHOLDER_1 -->', targetInfoVoyager1)
      .replace('<!-- DATA_PLACEHOLDER_2 -->', targetInfoVoyager2);

    // Send the HTML content as the response
    res.send(htmlContent);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Serve static files from the "public" directory
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

