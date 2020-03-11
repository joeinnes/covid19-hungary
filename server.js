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
    validDate.setMinutes(validDate.getMinutes() - 30)
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
          const newPageReq = await axios.get('https://koronavirus.gov.hu/', {
              mode: 'no-cors',
          })

          const newPage = newPageReq.data
          let newDom = await new JSDOM(newPage)

          const infected = newDom.window.document.querySelectorAll('.diagram-a .number')[0].innerHTML
          const healed = newDom.window.document.querySelectorAll('.diagram-a .number')[1].innerHTML
          const dead = newDom.window.document.querySelectorAll('.diagram-a .number')[2].innerHTML
          const quarantined = newDom.window.document.querySelectorAll('.diagram-a .number')[3].innerHTML
          const samples = newDom.window.document.querySelectorAll('.diagram-a .number')[4].innerHTML

          const updatedData = {
            infected: infected,
            healed: healed,
            dead: dead,
            quarantined: quarantined,
            samples: samples,
            dateTime: new Date()
          }

          const res = await datastore.insert(updatedData)
          response.json(updatedData)
        } catch (e) { 
          response.json({
            error: e,
            message: 'An unexpected error occurred on the server!'
          })
        }
    }
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})