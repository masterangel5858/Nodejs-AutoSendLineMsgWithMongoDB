const axios = require('axios');
const { fetchMedData,fetchMedDatatime,fetchMedDatatimeanddate } = require('./getmeddata');



/**
 * Get current timestamp
 * @returns {number} Current timestamp in milliseconds
 */
function getCurrentTimestamp() {
  return new Date().getTime();
}

/**
 * Send API to Line Notification with a carousel template
 * @param {string} userdata - userdata that contain LineID,Username,Picture
 * @param {string} time - Time of the day (Morning, Noon, Evening)
 * @param {string} timestamp - getCurrentTimestamp();
 * @param {string} Meddata - Medicine Data
 */
async function sendCarousel(userdata, time,timestamp,Meddata) {
  try {
    // Check if userdata is not null or undefined
    if (!userdata) {
      throw new Error('User data not found.');
    }
      else {
      const acceptallUrl = `https://back-end-express-mwkv.onrender.com/acceptall/${userdata.LineID}/${time}/${timestamp}`;
      const snoozeallUrl = `https://back-end-express-mwkv.onrender.com/snoozeall/${userdata.LineID}/${time}/${timestamp}`;
      const userDetailsUrl = 'https://liff.line.me/2004903683-WnaAjA86';

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
              "text": `ฉัน : ${userdata.Name}`,
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
                    "uri": acceptallUrl
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
                    "uri": snoozeallUrl
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
                "uri": userDetailsUrl
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
    if (!Meddata) {
      throw new Error('Medicine data not found.');
    }
let columns = Meddata.map((Medicine) => {
    // Initialize the time variables
    let timeText = '';
    if (Medicine.afbf === 'Before') {
        timeText += 'ก่อนอาหาร';
    } else if (Medicine.afbf === 'After') {
        timeText += 'หลังอาหาร';
    }

    // Add morning, noon, and evening labels based on the medicine data
    let scheduleText = '';
    if (Medicine.Morning) {
        scheduleText += 'เช้า';
    }
    if (Medicine.Noon) {
        if (scheduleText) scheduleText += ', ';
        scheduleText += 'กลางวัน';
    }
    if (Medicine.Evening) {
        if (scheduleText) scheduleText += ', ';
        scheduleText += 'เย็น';
    }
 // Initialize the day variables
 let scheduledate = '';

 // Check and add day labels based on the medicine schedule
 const MedicineDate = Medicine.MedicDate;
 if (MedicineDate.Monday) {
     if (scheduledate) scheduledate += ', ';
     scheduledate += 'จ';
 }
 if (MedicineDate.Tuesday) {
     if (scheduledate) scheduledate += ', ';
     scheduledate += 'อ';
 }
 if (MedicineDate.Wednesday) {
     if (scheduledate) scheduledate += ', ';
     scheduledate += 'พ';
 }
 if (MedicineDate.Thursday) {
     if (scheduledate) scheduledate += ', ';
     scheduledate += 'พฤ';
 }
 if (MedicineDate.Friday) {
     if (scheduledate) scheduledate += ', ';
     scheduledate += 'ศ';
 }
 if (MedicineDate.Saturday) {
     if (scheduledate) scheduledate += ', ';
     scheduledate += 'ส';
 }
 if (MedicineDate.Sunday) {
     if (scheduledate) scheduledate += ', ';
     scheduledate += 'อา';
 }
 return {
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
                      "text": `${timeText}`,
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
                      "text": `${scheduleText}`,
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
                      "text": "วันที่กินยา",
                      "size": "xs",
                      "margin": "xs"
                  },
                  {
                      "type": "text",
                      "text": `${scheduledate}`,
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
                  "uri": `https://back-end-express-mwkv.onrender.com/accept/${userdata.LineID}/${Medicine.MedicID}/${timestamp}`
              },
              "margin": "xs",
              "height": "sm",
              "style": "primary"
          }
      ],
      "paddingAll": "13px",
  }
};
} );


    let dataC = {
      "to": userdata.LineID,
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
     'Authorization': 'Bearer 2O4LkCT2vk8eo/NATER8HwxJAigRBqeIwodRaGkwZIb10XgEl+er3I3mUe3PTI64NhDKMB4E50J4Xab9Y1d/HTNMzvC08kIRnXMRQXyBUuWUrztL/vwmYU7KssdDWVpqUZCLHtjIHJQLV2jXl3x/iAdB04t89/1O/w1cDnyilFU='
   },
   data: dataC
 };

 // Send the API request to Line Notification
 const response = await axios.request(configC);
 if (response.status >= 200 && response.status < 300) {
    console.log('Carousel to host sent successfully.');
    console.log(JSON.stringify(response.data));
    return true
  } else {
    console.error('Error sending carousel:', response.statusText);
    // Handle the error or throw an exception as needed
  }
}
} 
catch (error) {
console.error('Error:', error);
}
}

/**
 * Send API to Line Notification with a carousel template
 * @param {string} HostLineID - Line user ID
 * @param {string} userdata - Line user ID
 * @param {string} time - Time of the day (Morning, Noon, Evening)
 * @param {string} timestamp - getCurrentTimestamp();
 * @param {string} Meddata - Medicine Data
 */
async function sendCarouseltohost(HostLineID,userdata,time,timestamp,Meddata) {
  try {
    // Check if userdata is not null or undefined
    if (!userdata) {
      throw new Error('User data not found.');
    }
      else {
      const acceptallUrl = `https://back-end-express-mwkv.onrender.com/acceptall/${userdata.LineID}/${time}/${timestamp}`;
      const snoozeallUrl = `https://back-end-express-mwkv.onrender.com/snoozeall/${userdata.LineID}/${time}/${timestamp}`;
      const userDetailsUrl = 'https://liff.line.me/2004903683-WnaAjA86';

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
              "text": `สมาชิก : ${userdata.Name}`,
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
                    "uri": acceptallUrl
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
                    "uri": snoozeallUrl
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
                "uri": userDetailsUrl
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
    if (!Meddata) {
      throw new Error('Medicine data not found.');
    }
let columns = Meddata.map((Medicine) => {
    // Initialize the time variables
    let timeText = '';
    if (Medicine.afbf === 'Before') {
        timeText += 'ก่อนอาหาร';
    } else if (Medicine.afbf === 'After') {
        timeText += 'หลังอาหาร';
    }

    // Add morning, noon, and evening labels based on the medicine data
    let scheduleText = '';
    if (Medicine.Morning) {
        scheduleText += 'เช้า';
    }
    if (Medicine.Noon) {
        if (scheduleText) scheduleText += ', ';
        scheduleText += 'กลางวัน';
    }
    if (Medicine.Evening) {
        if (scheduleText) scheduleText += ', ';
        scheduleText += 'เย็น';
    }

     // Initialize the day variables
     let scheduledate = '';

     // Check and add day labels based on the medicine schedule
     const MedicineDate = Medicine.MedicDate;
     if (MedicineDate.Monday) {
         if (scheduledate) scheduledate += ', ';
         scheduledate += 'จ';
     }
     if (MedicineDate.Tuesday) {
         if (scheduledate) scheduledate += ', ';
         scheduledate += 'อ';
     }
     if (MedicineDate.Wednesday) {
         if (scheduledate) scheduledate += ', ';
         scheduledate += 'พ';
     }
     if (MedicineDate.Thursday) {
         if (scheduledate) scheduledate += ', ';
         scheduledate += 'พฤ';
     }
     if (MedicineDate.Friday) {
         if (scheduledate) scheduledate += ', ';
         scheduledate += 'ศ';
     }
     if (MedicineDate.Saturday) {
         if (scheduledate) scheduledate += ', ';
         scheduledate += 'ส';
     }
     if (MedicineDate.Sunday) {
         if (scheduledate) scheduledate += ', ';
         scheduledate += 'อา';
     }
     return {
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
                          "text": `${timeText}`,
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
                          "text": `${scheduleText}`,
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
                          "text": "วันที่กินยา",
                          "size": "xs",
                          "margin": "xs"
                      },
                      {
                          "type": "text",
                          "text": `${scheduledate}`,
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
                      "uri": `https://back-end-express-mwkv.onrender.com/accept/${userdata.LineID}/${Medicine.MedicID}/${timestamp}`
                  },
                  "margin": "xs",
                  "height": "sm",
                  "style": "primary"
              }
          ],
          "paddingAll": "13px",
      }
  };
});



    let dataC = {
      "to": HostLineID,
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
     'Authorization': 'Bearer 2O4LkCT2vk8eo/NATER8HwxJAigRBqeIwodRaGkwZIb10XgEl+er3I3mUe3PTI64NhDKMB4E50J4Xab9Y1d/HTNMzvC08kIRnXMRQXyBUuWUrztL/vwmYU7KssdDWVpqUZCLHtjIHJQLV2jXl3x/iAdB04t89/1O/w1cDnyilFU='
   },
   data: dataC
 };

 // Send the API request to Line Notification
 const response = await axios.request(configC);
 if (response.status >= 200 && response.status < 300) {
    console.log('Carousel to Members sent successfully.');
    console.log(JSON.stringify(response.data));
  return true
} else {
  console.error('Error sending carousel:', response.statusText);
  // Handle the error or throw an exception as needed
}
 
}
} 
catch (error) {
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
    'Authorization': 'Bearer 2O4LkCT2vk8eo/NATER8HwxJAigRBqeIwodRaGkwZIb10XgEl+er3I3mUe3PTI64NhDKMB4E50J4Xab9Y1d/HTNMzvC08kIRnXMRQXyBUuWUrztL/vwmYU7KssdDWVpqUZCLHtjIHJQLV2jXl3x/iAdB04t89/1O/w1cDnyilFU='
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
  sendCarousel ,
  sendCarouseltohost};
// sendapi('อย่าลืมกินยาน้าาาาาาาาาาาาา','U33cd6913cb1d26a21f1f83b1a3bd7638');


// Example usage:
//sendCarousel("U33cd6913cb1d26a21f1f83b1a3bd7638", "Morning");


