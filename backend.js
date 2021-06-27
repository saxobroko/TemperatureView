const cors = require("cors")
const bodyParser = require("body-parser")
const express = require("express")
const mariadb = require("mariadb")
const app = express()
const pool = mariadb.createPool({
  host: "127.0.0.1",
  user: "tempsense",
  connectionLimit: 5,
})

app.use(cors())
app.use(bodyParser.json())
app.get("/api/get-last", async (req, res) => {
  let conn
  try {
    conn = await pool.getConnection()
    const rows = await conn.query(
      "SELECT (temp * (9.0 / 5) + 32) AS temp, humidity FROM `temperature`.`temperature` ORDER BY at DESC LIMIT 1"
    )
    if (rows.length === 1) {
      res.send(`[${rows[0].temp}][${rows[0].humidity}]`)
    } else {
      res.send("[0][0]")
    }
  } catch (err) {
    res.writeHead(500)
    res.end()
    throw err
  } finally {
    if (conn) conn.end()
  }
})
app.get("/api/get-data", async (req, res) => {
  let conn
  try {
    conn = await pool.getConnection()
    const rows = await conn.query(
      "SELECT UNIX_TIMESTAMP(at) AS at, (temp * (9.0 / 5) + 32) AS temp, humidity FROM `temperature`.`temperature` WHERE at >= NOW() - INTERVAL 12 HOUR"
    )
    if (rows.length > 0) {
      let lastEntry = rows[rows.length - 1]
      res.json({
        lastTemperature: lastEntry.temp,
        lastHumidity: lastEntry.humidity,
        history: rows,
      })
    } else {
      res.json({ lastTemperature: 0, lastHumidity: 0, history: [] })
    }
  } catch (err) {
    res.writeHead(500)
    res.end()
    throw err
  } finally {
    if (conn) conn.end()
  }
})

if (process.env.NODE_ENV !== "development") {
  app.use(express.static("public"))
}
const port = process.env.PORT || 3000
app.listen(port)
console.log(`Listening on port ${port}`)
