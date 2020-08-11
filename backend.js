require("dotenv").config({})
const AUTH_KEY = process.env.AUTHORIZATION_KEY
const cors = require("cors")
const bodyParser = require("body-parser")
const express = require("express")
const app = express()

let temperature = 0
let humidity = 0

const authenticate = auth => {
  return (
    auth !== undefined &&
    auth !== null &&
    auth !== "" &&
    AUTH_KEY !== "" &&
    AUTH_KEY !== undefined &&
    AUTH_KEY !== null &&
    AUTH_KEY === auth
  )
}

app.use(cors())
app.use(bodyParser.json())
app.post("/api/update-data", (req, res) => {
  const auth = req.header("Authorization")
  if (authenticate(auth)) {
    // authenticated!
    if (
      typeof req.body.temperature === "number" &&
      typeof req.body.humidity === "number"
    ) {
      temperature = req.body.temperature
      humidity = req.body.humidity
      res.json({
        temperature: temperature,
        humidity: humidity,
      })
    } else {
      res.sendStatus(400)
    }
  } else {
    res.sendStatus(403)
  }
})
app.get("/api/get-data", (req, res) => {
  res.json({
    temperature: temperature,
    humidity: humidity,
  })
})

if (process.env.NODE_ENV !== "development") {
  app.use(express.static("public"))
}

app.listen(process.env.PORT | 3000)
