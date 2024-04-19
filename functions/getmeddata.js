const axios = require('axios');

async function getMeddata(LineID) {
  try {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://back-end-express-mwkv.onrender.com/getdatamed/${LineID}`,
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


async function getMeddatabytime(LineID,time) {
  try {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://back-end-express-mwkv.onrender.com/getdatamed/${LineID}/${time}`,
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



async function fetchMedDatatime(LineID,time) {
  try {
    const medicines = await getMeddatabytime(LineID,time);
    return medicines; // Return the fetched data
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
    getMeddata,
    fetchMedDatatime,
    getMeddatabytime
}





