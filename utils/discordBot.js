

function discoIt(message) {
  //send the message on this webhooks

  const request = require('request');
  request.post({
    uri: process.env.WEBHOOK_URL,
    json: {
      "content": message
    },
  });

}

//add logic for finding team name etc 


module.exports = { botInit, teamCreateHandle, discoIt }