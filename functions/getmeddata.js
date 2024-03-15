const axios = require('axios');

async function getMeddata(LineID) {
  try {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://medexpressbackend.netlify.app/.netlify/functions/api/getdatamed/${LineID}`,
      headers: {}
    };

    const response = await axios.request(config);
    const data = response.data;

    // Accessing the properties of the data object
    const userId = data.LineID;
    const medicines = data.Medicine;

    return medicines;

  } catch (error) {
    console.error('Error:', error);
    throw error; // Re-throw the error to handle it outside the function
  }
}

async function fetchMedData(LineID) {
  try {
    const medicines = await getMeddata(LineID);
    return medicines; // Return the fetched data
  } catch (error) {
    console.error('Error:', error);
    throw error; // Re-throw the error to handle it outside the function
  }
}

module.exports = {
    fetchMedData,
    getMeddata
}

const LineID = 'U33cd6913cb1d26a21f1f83b1a3bd7638'
// Call the function to fetch data and log it
fetchMedData(LineID)
  .then((medicines) => {
    console.log(medicines); // Log the fetched data
  })
  .catch((error) => {
    console.error('Error:', error);
  });
