'use strict';
const axios = require('axios');
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  
  function getNewcase(agent){
    return axios.get(`https://hpb.health.gov.lk/api/get-current-statistical`)
    .then(response => {
      var bot_response = "New cases in Sri Lanka: " + response.data.data.local_new_cases;
      agent.add(bot_response);
    });
  }
  function getTotalcase(agent){
    return axios.get(`https://hpb.health.gov.lk/api/get-current-statistical`)
    .then(response => {
      var bot_response = "Total cases in Sri Lanka: " + response.data.data.local_total_cases;
      agent.add(bot_response);
    });
  }
  function getTotalDeaths(agent){
    return axios.get(`https://hpb.health.gov.lk/api/get-current-statistical`)
    .then(response => {
      var bot_response = "Total deaths in Sri Lanka: " + response.data.data.local_deaths;
      agent.add(bot_response);
    });
  }
  function getRecovered(agent){
    return axios.get(`https://hpb.health.gov.lk/api/get-current-statistical`)
    .then(response => {
      var bot_response = "Total recovered in Sri Lanka: " + response.data.data.local_recovered;
      agent.add(bot_response);
    });
  }
  function getActiveCases(agent){
    return axios.get(`https://hpb.health.gov.lk/api/get-current-statistical`)
    .then(response => {
      var bot_response = "Total active cases in Sri Lanka: " + response.data.data.local_active_cases;
      agent.add(bot_response);
    });
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('new_cases', getNewcase);
  intentMap.set('total_cases', getTotalcase);
  intentMap.set('deaths', getTotalDeaths);
  intentMap.set('recovered', getRecovered);
  intentMap.set('active_cases', getActiveCases);
  agent.handleRequest(intentMap);
});