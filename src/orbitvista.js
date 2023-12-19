// Use CommonJS syntax for the entire node-fetch module
const fetch = require('node-fetch');

// Configuring parameters for Voyager 1
const voyager1Params = {
  target: 'Voyager 1',
  quantities: '1,9',
  epochs: 'now',
  observatory_code: '500',
  ref_system: 'J2000',
  format: 'json',
};

// Constructing the URL for the Horizons API
const horizonsUrl = 'https://ssd.jpl.nasa.gov/horizons_batch.cgi?' + new URLSearchParams(voyager1Params);

// Making a GET request to the Horizons API
fetch(horizonsUrl)
  .then(response => response.json())
  .then(data => {
    // Log the obtained data
    console.log(data);
  })
  .catch(error => console.error('Error:', error));

