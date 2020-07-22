// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require('express')
const axios = require('axios').default
const app = express()
const JSDOM = require("jsdom").JSDOM

const Datastore = require('nedb-promises')
let datastore = Datastore.create('./db.db')

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))

// https://expressjs.com/en/starter/basic-routing.html
app.get('/', (request, response) => {
    response.sendFile(__dirname + '/views/index.html')
})

// send the default array of dreams to the webpage
app.get('/api/data', async (request, response) => {
    let validDate = new Date()
    validDate.setMinutes(validDate.getMinutes() - 5)
    let data = await datastore
        .find()
        .sort({dateTime: -1})
        .limit(1)
    if (
        data.length &&
        data[0].dateTime > validDate
    ) {
        response.json(data[0])
    } else {
      
        try {
          const apiData = await axios.get('https://api.thevirustracker.com/free-api?countryTotal=HU')
          const updatedData = {
            infected: apiData.data.countrydata[0].total_cases,
            healed: apiData.data.countrydata[0].total_recovered,
            dead: apiData.data.countrydata[0].total_deaths,
            quarantined: 0, //quarantined,
            samples: 0, //samples,
            dateTime: new Date()
          }

          const res = await datastore.insert(updatedData)
          response.json(updatedData)
        } catch (e) { 
          console.log(e)
          response.json(data[0])
        }
    }
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})