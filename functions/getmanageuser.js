const axios = require('axios');

async function getmanageuser(LineID) {
    try {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://back-end-express-mwkv.onrender.com/getmanageuser/${LineID}`,
        headers: {},
      };
  
      const response = await axios.request(config);
    //   console.log("Response data:", response.data); // Debug logging
      const data = response.data;
  
      // Return the entire response data if it's an array
      if (Array.isArray(data)) {
        return data;
      } else {
        console.log("No user data found in response.");
        return []; // Return an empty array if no user data is found
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
}
  


async function fetchmanageuser(LineID) {
    try {
      const manageuser = await getmanageuser(LineID);
      console.log(manageuser);
      return manageuser; // Return the fetched data
    } catch (error) {
      console.error('Error:', error);
      throw error; // Re-throw the error to handle it outside the function
    }
  }


  module.exports = {
    fetchmanageuser,
    getmanageuser
  };


//   async function run(LineID) {
//     try {
//       const userList = await fetchmanageuser(LineID);
//     //   console.log("User List:", userList);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   }
  
//   run("U33cd6913cb1d26a21f1f83b1a3bd7638");