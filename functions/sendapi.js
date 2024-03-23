const axios = require('axios');
const { fetchMedData,fetchMedDatatime } = require('./getmeddata');
const { fetchuserData} = require('./getuserdata')

/**
 * Send API to Line Notification with a carousel template
 * @param {string} LineID - Line user ID
 * @param {string} time - Time of the day (Morning, Noon, Evening)
 */
async function sendCarousel(LineID, time) {
  try {
    // Fetch user data asynchronously
    const userdata = await fetchuserData(LineID);
    // Check if userdata is not null or undefined
    if (userdata) {
      const acceptall = {
        "type": "bubble",
        "size": "hecto",
        "hero": {
          "type": "image",
          "url": `${userdata.Picture}`,
          "size": "full",
          "aspectMode": "cover",
          "aspectRatio": "320:213"
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": userdata.Name,
              "weight": "bold",
              "size": "md",
              "wrap": true,
              "align": "center"
            },
            {
              "type": "separator",
              "color": "#000000",
              "margin": "sm"
            },
            {
              "type": "box",
              "layout": "vertical",
              "spacing": "xs",
              "contents": [
                {
                  "type": "button",
                  "action": {
                    "type": "uri",
                    "label": "ยอมรับทั้งหมด",
                    "uri": `https://medexpressbackend.netlify.app/.netlify/functions/api/acceptall/${LineID}/${time}`
                  },
                  "margin": "xs",
                  "height": "sm",
                  "style": "primary"
                },
                {
                  "type": "button",
                  "action": {
                    "type": "uri",
                    "label": "เลื่อนเวลาเตือน",
                    "uri": `https://medexpressbackend.netlify.app/.netlify/functions/api/snoozeall/${LineID}/${time}`
                  },
                  "margin": "xs",
                  "height": "sm",
                  "style": "secondary"
                }
              ]
            },
            {
              "type": "separator",
              "color": "#000000",
              "margin": "sm"
            },
            {
              "type": "button",
              "action": {
                "type": "uri",
                "label": "รายละเอียดสมาชิก",
                "uri": "https://liff.line.me/2003049267-Ory1R5Kd"
              },
              "margin": "xs",
              "height": "sm",
              "position": "relative",
              "gravity": "top"
            }
          ],
          "paddingAll": "13px"
        }
      };

    // Process medicine data
    const Meddata = await fetchMedDatatime(LineID,time);
    let columns = Meddata.map((Medicine) => ({
      "type": "bubble",
      "size": "hecto",
      "hero": {
        "type": "image",
        "url": Medicine.MedicPicture,
        "size": "full",
        "aspectMode": "cover",
        "aspectRatio": "320:213"
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": `${Medicine.MedicName}`,
            "weight": "bold",
            "size": "md",
            "wrap": true,
            "align": "center"
          },
          {
            "type": "separator",
            "margin": "sm"
          },
          {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "text",
                "text": "จำนวนยาคงเหลือ",
                "size": "xs",
                "margin": "xs",
                "flex": 2
              },
              {
                "type": "text",
                "text": `${Medicine.stock}`,
                "size": "xs",
                "margin": "xs"
              }
            ]
          },
          {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "text",
                "text": "เวลากินยา :",
                "margin": "xs",
                "size": "xs",
                "flex": 1
              },
              {
                "type": "text",
                "text": `${Medicine.afbf}`,
                "size": "xs",
                "margin": "xs"
              }
            ]
          },
          {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "text",
                "text": "ช่วงเวลากินยา",
                "size": "xs",
                "margin": "xs"
              },
              {
                "type": "text",
                "text": "เช้า,กลางวัน,เย็น",
                "size": "xs",
                "margin": "xs"
              }
            ]
          },
          {
            "type": "separator",
            "margin": "sm"
          },
          {
            "type": "button",
            "action": {
              "type": "uri",
              "label": "ยอมรับ",
              "uri": `https://medexpressbackend.netlify.app/.netlify/functions/api/accept/${LineID}/${Medicine.MedicName}`
            },
            "margin": "xs",
            "height": "sm",
            "style": "primary"
          }
        ],
        "paddingAll": "13px",
      }
    }));

    let dataC = {
      "to": LineID,
      "messages": [
        {
          "type": "flex",
          "altText": "ถึงเวลาทานยาแล้ว !!!",
          "contents": {
            "type": "carousel",
            "contents": [acceptall].concat(columns)
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
   data: dataC
 };

 // Send the API request to Line Notification
 const response = await axios.request(configC);
 console.log(JSON.stringify(response.data));
}
} 
catch (error) {
console.error('Error:', error);
}
}








// /**
//  * Send API to Line Notification with a carousel template
//  * @param {string} LineID - Line user ID
//  * @param {string} time - Time of the day (Morning, Noon, Evening)
//  */
// async function sendCarousel(LineID, time) {
//   try {
//     // Fetch medicine data asynchronously
//     let acceptall =
//     {
//       "thumbnailImageUrl": 'https://i.ytimg.com/vi/HZZ4Ah4S3i4/maxresdefault.jpg',
//       "imageBackgroundColor": "#FFFFFF",
//       "title": time,
//       "text": 'กดเพื่อยอมรับทั้งหมด',
//       "defaultAction": {
//         "type": "uri",
//         "label": "AcceptAll",
//         "uri": `https://medexpressbackend.netlify.app/.netlify/functions/api/acceptall/${LineID}/${time}`
//       },
//       "actions": [
//         {
//           "type": "uri",
//           "label": "AcceptAll",
//           "uri": `https://medexpressbackend.netlify.app/.netlify/functions/api/acceptall/${LineID}/${time}`
//         },
//         {
//           "type": "uri",
//           "label": "SnoozeAll",
//           "uri": `https://medexpressbackend.netlify.app/.netlify/functions/api/snoozeall/${LineID}/${time}`
//         }
//       ]
//     }
//     // Process medicine data
//     //แก้ ดึงยาไม่ตรงตามเวลา
//     const Meddata = await fetchMedData(LineID);
//     let columns = Meddata.map((Medicine) => ({
//       "thumbnailImageUrl": Medicine.MedicPicture,
//       "imageBackgroundColor": "#FFFFFF",
//       "title": Medicine.MedicName,
//       "text": Medicine.afbf,
//       "defaultAction": {
//         "type": "uri",
//         "label": "Accept",
//         "uri": `https://medexpressbackend.netlify.app/.netlify/functions/api/accept/${LineID}/${Medicine.MedicName}`
//       },
//       "actions": [
//         {
//           "type": "uri",
//           "label": "Accept",
//           "uri": `https://medexpressbackend.netlify.app/.netlify/functions/api/accept/${LineID}/${Medicine.MedicName}`
//         },
//         {
//           "type": "uri",
//           "label": "Snooze",
//           "uri": `https://medexpressbackend.netlify.app/.netlify/functions/api/snooze/${LineID}/${Medicine.MedicName}`
//         }
//       ]
//     }));

//     let dataC = {
//       "to": LineID,
//       "messages": [
//         {
//           "type": "template",
//           "altText": "ถึงเวลาทานยาแล้ว !!!",
//           "template": {
//             "type": "carousel",
//             "columns": [acceptall].concat(columns),
//             "imageAspectRatio": "rectangle",
//             "imageSize": "cover"
//           }
//         }
//       ]
//     };

//     // Now you can use this data to send the API request to Line Notification
//     console.log(JSON.stringify(dataC)); // Just for testing

//     let configC = {
//       method: 'post',
//       maxBodyLength: Infinity,
//       url: 'https://api.line.me/v2/bot/message/push',
//       headers: { 
//         'Content-Type': 'application/json', 
//         'Authorization': 'Bearer N4jUMig3X5sk7cvppqoQJLWds+vXdZ8EfLAq6Nv2u/qNGu8bfnNep+D/EcAv17UNZDKPKhRFU6U4xyFKuwgtfitTTbbEif0tsqBkA+iZoBNtEPbKlhfQoPWt6viW058N7QtonTiiBpCUXc/XQhtTfgdB04t89/1O/w1cDnyilFU='
//       },
//       data : dataC
//     };

//     // Send the API request to Line Notification
//     const response = await axios.request(configC);
//     console.log(JSON.stringify(response.data));

//   } catch (error) {
//     console.error('Error:', error);
//   }
// }











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


