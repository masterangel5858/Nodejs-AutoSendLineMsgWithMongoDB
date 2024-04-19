const axios = require('axios');

async function getuserdata(LineID) {
  try {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://back-end-express-mwkv.onrender.com/getdatauser/${LineID}`,
      headers: {}
    };

    const response = await axios.request(config);
    const data = response.data;

    // Accessing the properties of the data object
    const UserId = data.LineID;
    const Name = data.Name;
    const Picture = data.Picture

    return data;

  } catch (error) {
    console.error('Error:', error);
    throw error; // Re-throw the error to handle it outside the function
  }
}


async function fetchuserData(LineID) {
    try {
      const userdata = await getuserdata(LineID);
      console.log(userdata);
      return userdata; // Return the fetched data
    } catch (error) {
      console.error('Error:', error);
      throw error; // Re-throw the error to handle it outside the function
    }
  }


  module.exports = {
    fetchuserData,
    getuserdata
  };