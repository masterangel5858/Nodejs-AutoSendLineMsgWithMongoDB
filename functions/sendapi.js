const axios = require('axios');
const { fetchMedData } = require('./getmeddata');

/**
 * Send API to Line Notification with a carousel template
 * @param {string} LineID - Line user ID
 * @param {string} time - Time of the day (Morning, Noon, Evening)
 */
async function sendCarousel(LineID, time) {
  try {
    // Fetch medicine data asynchronously
    const Meddata = await fetchMedData(LineID);
    let summarycolumns =
    {
      "thumbnailImageUrl": 'https://i.ytimg.com/vi/HZZ4Ah4S3i4/maxresdefault.jpg',
      "imageBackgroundColor": "#FFFFFF",
      "title": time,
      "text": 'กดเพื่อยอมรับทั้งหมด',
      "defaultAction": {
        "type": "uri",
        "label": "AcceptAll",
        "uri": `https://medexpressbackend.netlify.app/.netlify/functions/api/acceptall/${LineID}/${time}`
      },
      "actions": [
        {
          "type": "uri",
          "label": "AcceptAll",
          "uri": `https://medexpressbackend.netlify.app/.netlify/functions/api/acceptall/${LineID}/${time}`
        },
        {
          "type": "uri",
          "label": "SnoozeAll",
          "uri": `https://medexpressbackend.netlify.app/.netlify/functions/api/snoozeall/${LineID}/${time}`
        }
      ]
    }
    // Process medicine data
    let columns = Meddata.map((Medicine) => ({
      "thumbnailImageUrl": Medicine.MedicPicture,
      "imageBackgroundColor": "#FFFFFF",
      "title": Medicine.MedicName,
      "text": Medicine.afbf,
      "defaultAction": {
        "type": "uri",
        "label": "Accept",
        "uri": `https://medexpressbackend.netlify.app/.netlify/functions/api/accept/${LineID}/${Medicine.MedicName}`
      },
      "actions": [
        {
          "type": "uri",
          "label": "Accept",
          "uri": `https://medexpressbackend.netlify.app/.netlify/functions/api/accept/${LineID}/${Medicine.MedicName}`
        },
        {
          "type": "uri",
          "label": "Snooze",
          "uri": `https://medexpressbackend.netlify.app/.netlify/functions/api/snooze/${LineID}/${Medicine.MedicName}`
        }
      ]
    }));

    let dataC = {
      "to": LineID,
      "messages": [
        {
          "type": "template",
          "altText": "ถึงเวลาทานยาแล้ว !!!",
          "template": {
            "type": "carousel",
            "columns": [summarycolumns].concat(columns),
            "imageAspectRatio": "rectangle",
            "imageSize": "cover"
          }
        }
      ]
    };

    // Now you can use this data to send the API request to Line Notification
    console.log(JSON.stringify(dataC)); // Just for testing

    let configC = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.line.me/v2/bot/message/push',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer N4jUMig3X5sk7cvppqoQJLWds+vXdZ8EfLAq6Nv2u/qNGu8bfnNep+D/EcAv17UNZDKPKhRFU6U4xyFKuwgtfitTTbbEif0tsqBkA+iZoBNtEPbKlhfQoPWt6viW058N7QtonTiiBpCUXc/XQhtTfgdB04t89/1O/w1cDnyilFU='
      },
      data : dataC
    };

    // Send the API request to Line Notification
    const response = await axios.request(configC);
    console.log(JSON.stringify(response.data));

  } catch (error) {
    console.error('Error:', error);
  }
}











/**
 * Send Api to LineNotification
 * @param {string} message 
 * @param {string} LineID 
 */
async function sendapi(message,LineID) {
let data = JSON.stringify({
  "to": LineID,
  "messages": [
    {
      "type": "text",
      "text": message
    }
  ]
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://api.line.me/v2/bot/message/push',
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': 'Bearer N4jUMig3X5sk7cvppqoQJLWds+vXdZ8EfLAq6Nv2u/qNGu8bfnNep+D/EcAv17UNZDKPKhRFU6U4xyFKuwgtfitTTbbEif0tsqBkA+iZoBNtEPbKlhfQoPWt6viW058N7QtonTiiBpCUXc/XQhtTfgdB04t89/1O/w1cDnyilFU='
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
}

module.exports = { sendapi,
  sendCarousel };
// sendapi('อย่าลืมกินยาน้าาาาาาาาาาาาา','U33cd6913cb1d26a21f1f83b1a3bd7638');


// Example usage:
//sendCarousel("U33cd6913cb1d26a21f1f83b1a3bd7638", "Morning");