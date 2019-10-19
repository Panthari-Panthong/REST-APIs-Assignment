const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
let countReq = 0
const limit = 5

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.post('/messages', (req, res, next) => {
  // console.log("REQ BODY", req.body)
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).end()
  } else {
    countReq = countReq + 1
    if (countReq > limit) {
      // console.log('Too much')
      res.status(429).end()
    } else {
      res.json({
        message: "Message received loud and clear"
      })
    }
    // console.log(countReq)
  }
  next()
})



app.listen(port, () => console.log(`Listening on :${port}`))

