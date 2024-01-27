const { MongoClient } = require("mongodb");

const url = "mongodb+srv://admin:1234@healthcaredemo.nlwfzbm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);
const dbName = "HealthCare";
const {sendapi} = require('./sendapi.js')

async function getAllDocuments() {
  let allDocuments = [];
  try {
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("NotifyTime");

    await col.find().forEach(document => {
      const { _id, LineID, Morning, Noon, Evening } = document;

      allDocuments.push({
        _id,
        LineID,
        Morning: Morning.join(":"),
        Noon: Noon.join(":"),
        Evening: Evening.join(":")
      });
    });

    return allDocuments;
  } catch (err) {
    console.log(err.stack);
  } finally {
    // Move the client.close() inside the finally block
    await client.close();
  }
}

async function processDocuments() {
  try {
    const documents = await getAllDocuments();
    if (!documents) {
      console.error("No documents found");
      return [];
    }

    console.log("All Documents:\n", documents);

    const currentTime = new Date();
    console.log("Current Time:", currentTime.toLocaleTimeString());

    const results = [];

    documents.forEach((document, index) => {
      try {
        const { LineID, Morning, Noon, Evening } = document;

        // Extract hours and minutes from currentTime
        const currentHours = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();

        // Extract hours and minutes from scheduled times
        const morningHours = Number(Morning.split(":")[0]);
        const morningMinutes = Number(Morning.split(":")[1]);

        const noonHours = Number(Noon.split(":")[0]);
        const noonMinutes = Number(Noon.split(":")[1]);

        const eveningHours = Number(Evening.split(":")[0]);
        const eveningMinutes = Number(Evening.split(":")[1]);

        console.log("Morning Time:", morningHours, ":", morningMinutes);
        console.log("Noon Time:", noonHours, ":", noonMinutes);
        console.log("Evening Time:", eveningHours, ":", eveningMinutes);

        if (
          (currentHours === morningHours && currentMinutes === morningMinutes) ||
          (currentHours === noonHours && currentMinutes === noonMinutes) ||
          (currentHours === eveningHours && currentMinutes === eveningMinutes)
        ) {
          let matchedTime;
          if (currentHours === morningHours && currentMinutes === morningMinutes) {
            matchedTime = "Morning";
          } else if (currentHours === noonHours && currentMinutes === noonMinutes) {
            matchedTime = "Noon";
          } else {
            matchedTime = "Evening";
          }
          results.push({
            time: "Matched",
            LineID,
            matchedTime,
            scheduledTime: currentTime.toLocaleTimeString(),
          });
        }
      } catch (innerError) {
        console.error("Error processing document:", innerError);
      }
    });

    return results;
  } catch (error) {
    console.error("Error in processDocuments:", error);
    throw error; // Re-throw the error after logging
  }
}
module.exports = {
  getAllDocuments,
  processDocuments,
  GetResult
};

async function GetResult() {
  try {
    const results = await processDocuments();
    console.log("Schedule Results:\n", results);
    results.forEach((result,index) => {
      const { time,LineID,matchedTime,scheduledTime} = result;
      const message = `${scheduledTime} อย่าลืมกินยาน้า นี้มันช่วง ${matchedTime} แล้ว\nรักษาสุขภาพนะ`
      sendapi(message,LineID);
      console.log(time);
      console.log(LineID);
      console.log(matchedTime);
      console.log(scheduledTime);
      
    });
  } catch (err) {
    console.error(err);
  }
  
}


// // Usage example
// async function alldata() {
//   try {
//     const documents = await getAllDocuments();
//     console.log("All Documents:\n", documents);
//   } catch (err) {
//     console.error(err);
//   }
// }

// async function findLineID() {
//     const documents = await getAllDocuments();
//     console.log("All Documents:\n", documents);

//     const LineID = documents.map(data => data.LineID);
//     console.log("Line Ids:\n", LineID);
// }

// //horizontal data
// async function test() {
//     const documents = await getAllDocuments();
//     const LineID = documents.map(data => data.LineID)
//     const Morning = documents.map(data => data.Morning)
//     const Noon = documents.map(data => data.Noon)
//     const Evening = documents.map(data => data.Evening)
    
//     console.log("Line Ids:\n", LineID);
//     console.log("Morning:\n",Morning);
//     console.log("Noon:\n",Noon);
//     console.log("Evening:\n",Evening);
// }



// test();
// run();

// async function runtest() {
//     try {
//       const allDocuments = await getAllDocuments();
      
//       // Extract Noon values
//       const noonValues = allDocuments.map(document => document.Noon);
//       console.log("Noon Values:", noonValues);
  
//       // Extract Evening values
//       const eveningValues = allDocuments.map(document => document.Evening);
//       console.log("Evening Values:", eveningValues);
  
//       // You can use the extracted values as needed in your application logic
      
//     } catch (err) {
//       console.error(err);
//     }
//   }
  
  




