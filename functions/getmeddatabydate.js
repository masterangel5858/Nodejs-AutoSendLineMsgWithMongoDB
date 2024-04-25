const axios = require('axios');

async function getMedDataByDate(LineID, date,matchedTime) {
  try {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://back-end-express-mwkv.onrender.com/getmeddatabydate/${LineID}/${date}/${matchedTime}`,
      headers: {},
    };

    const response = await axios.request(config);
    //   console.log("Response data:", response.data); // Debug logging
    const data = response.data;

    // Return the entire response data if it's an array
    if (Array.isArray(data)) {
      return data;
    } else {
      console.log("No medicine data found in response.");
      return []; // Return an empty array if no medicine data is found
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function fetchMedDatabydate(LineID, date,matchedTime) {
  try {
    const medData = await getMedDataByDate(LineID, date,matchedTime);
    console.log(medData);
    return medData; // Return the fetched data
  } catch (error) {
    console.error('Error:', error);
    throw error; // Re-throw the error to handle it outside the function
  }
}

module.exports = {
  fetchMedDatabydate,
  getMedDataByDate
};


// async function run(LineID, date) {
//   try {
//     const medData = await fetchMedData(LineID, date);
//     //   console.log("Medicine Data:", medData);
//   } catch (error) {
//     console.error('Error:', error);
//   }
// }
