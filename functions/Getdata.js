const { MongoClient } = require("mongodb");

const url = "mongodb+srv://admin:1234@healthcaredemo.nlwfzbm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);
const dbName = "HealthCare";
const {sendapi , sendCarousel ,sendCarouseltohost} = require('./sendapi.js')
const {fetchmanageuser,getmanageuser} = require('./getmanageuser.js')
const moment = require('moment');
const { fetchMedDatatime } = require("./getmeddata.js");
const {fetchMedDatabydate} =require('./getmeddatabydate.js');
const { fetchuserData} = require('./getuserdata');
const { connectToDatabase, DisconnectToDatabase } = require("./connecteddatabase.js");
const { insertData } = require("./insertMedicineLogs.js");
const { getFormattedDate } = require("./setting.js");

async function getAllDocuments() {
  let allDocuments = [];
  try {
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("NotifyTime");

    await col.find().forEach(document => {
      const { _id, LineID, Morning, Noon, Evening, Night } = document;

      // Type check before joining
      allDocuments.push({
        _id,
        LineID,
        Morning: Array.isArray(Morning) ? Morning.join(":") : Morning,
        Noon: Array.isArray(Noon) ? Noon.join(":") : Noon,
        Evening: Array.isArray(Evening) ? Evening.join(":") : Evening,
        Night: Array.isArray(Night) ? Night.join(":") : Night
      });
    });

    return allDocuments;
  } catch (err) {
    console.log(err.stack);
  } finally {
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
        const { LineID, Morning, Noon, Evening, Night } = document;

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

        const nightHours = Number(Night.split(":")[0]);
        const nightMinutes = Number(Night.split(":")[1]);

        console.log("Morning Time:", morningHours, ":", morningMinutes);
        console.log("Noon Time:", noonHours, ":", noonMinutes);
        console.log("Evening Time:", eveningHours, ":", eveningMinutes);
        console.log("Night Time:", nightHours, ":", nightMinutes);

        if (
          (currentHours === morningHours && currentMinutes === morningMinutes) ||
          (currentHours === noonHours && currentMinutes === noonMinutes) ||
          (currentHours === eveningHours && currentMinutes === eveningMinutes) ||
          (currentHours === nightHours && currentMinutes === nightMinutes)
        ) {
          let matchedTime;
          if (currentHours === morningHours && currentMinutes === morningMinutes) {
            matchedTime = "Morning";
          } else if (currentHours === noonHours && currentMinutes === noonMinutes) {
            matchedTime = "Noon";
          } else if (currentHours === eveningHours && currentMinutes === eveningMinutes) {
            matchedTime = "Evening";
          } else {
            matchedTime = "Night";
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


function getCurrentTimestamp() {
  return new Date().getTime();
}

async function GetResult() {
  try {
    let currentTimeString = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok' });
    let currentDate = getFormattedDate();
    const date = moment().format('dddd');

    const results = await processDocuments();
    console.log("Schedule Results:\n", results);

    // Get the timestamp once at the beginning
    const timestamp = getCurrentTimestamp();

    for (const result of results) {
      const medData = await fetchMedDatabydate(result.LineID, date,result.matchedTime); // Fetch medicine data for the current date
      if (medData.length === 0) {
        console.log("No data found for the specified date.");
        // Handle the case where no data is found
      } else {
        console.log("Data found:", medData);
        // Process the data as needed

        const { LineID, matchedTime, scheduledTime } = result;
        const message = `ถึงเวลาทานของคุณแล้ว !!! \nรักษาสุขภาพนะ`;
        const messagemember = 'สมาชิกของคุณถึงเวลาทานยาแล้ว !!!';
        const userdata = await fetchuserData(LineID);
        if (!userdata) {
          throw new Error('User data not found.');
        }
        
        const membership = await fetchmanageuser(LineID);
        console.log("Membership:", membership);

        if (membership && membership.length > 0) {
          for (const userGroup of membership) {
            if (userGroup.User && userGroup.User.includes(LineID)) {
              console.log("Sending message to Host:", userGroup.LineID, matchedTime,currentDate); 
              // await sendapi(messagemember, userGroup.LineID);
              await sendCarouseltohost(userGroup.LineID, userdata, matchedTime, timestamp,medData);
            }
          }
        } else {
          console.log("No membership data found for LineID:", LineID);
        }

        // Example calls to your sending functions outside the loop
        console.log("sending to member", LineID, matchedTime)
        // await sendapi(message, LineID);
        await sendCarousel(userdata, matchedTime, timestamp,medData);
        if (sendCarousel){
          try{
            const mappedData = medData.map((medicine) => ({
              LineID: userdata.LineID,
              MedicID: medicine.MedicID,
              MedicName: medicine.MedicName,
              Morning: medicine.Morning,
              Noon: medicine.Noon,
              Evening: medicine.Evening,
              Night: medicine.Night,
              afbf: medicine.afbf,
              stock: medicine.stock,
              MedicPicture: medicine.MedicPicture,
              status: medicine.Status,
              datestamp: currentDate,
              timecreate:currentTimeString,
              timestamp:null,
              urltime:`${timestamp}`,
              MatchedTime: matchedTime,
              AcceptType:null,
              AcceptStatus: false
            }));
            console.log("Data before insert",mappedData);
            insertData(mappedData);
          }
          catch (err){
            console.error(err);
          } finally{
            DisconnectToDatabase();
          }
          
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}



// async function GetResult() {
//   try {
//     const results = await processDocuments();
//     console.log("Schedule Results:\n", results);
//     results.forEach((result,index) => {
//       const { time,LineID,matchedTime,scheduledTime} = result;
//       const message = `${scheduledTime} อย่าลืมกินยาน้า นี้มันช่วง ${matchedTime} แล้ว\nรักษาสุขภาพนะ`
//       sendCarousel(LineID,matchedTime)
//       sendapi(message,LineID);
//       console.log(time);
//       console.log(LineID);
//       console.log(matchedTime);
//       console.log(scheduledTime);
      
//     });
//   } catch (err) {
//     console.error(err);
//   }
  
// }








