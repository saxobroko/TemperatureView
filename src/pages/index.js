import React, { useEffect, useState } from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import ClientOnly from "../components/clientonly"
import { LineChart, Line, XAxis, YAxis } from "recharts"
import moment from "moment"
import useWindowSize from "../hooks/useWindowSize"

const IndexPage = () => {
  const [temp, setTemp] = useState(0)
  const [humidity, setHumidity] = useState(0)
  const [tempData, setTempData] = useState([])
  const size = useWindowSize()
  useEffect(() => {
    const updateData = () => {
      if (window !== undefined) {
        fetch("http://localhost:3000/api/get-data").then(data => {
          data.json().then(json => {
            setTemp(json.temperature)
            setHumidity(json.humidity)
            setTempData(d => {
              let copy = [...d]
              if (
                copy.length <= 0 ||
                copy[copy.length - 1].y !== json.temperature
              ) {
                copy.push({ time: new Date().getTime(), y: json.temperature })
              }
              return copy
            })
          })
        })
      }
    }
    const interval = setInterval(updateData, 60000)
    updateData()
    return () => clearInterval(interval)
  }, [])
  return (
    <Layout>
      <SEO title="Home" />
      <ClientOnly className="chart-container">
        <div className="big">
          <strong>Temperature:</strong> {temp}­­°F
        </div>
        <div className="big">
          <strong>Humidity:</strong> {humidity}­­%
        </div>
        <hr />
        <h2>Temperature (°F)</h2>
        <LineChart
          width={size.width * 0.8}
          height={size.height * 0.7}
          data={tempData}
        >
          <XAxis
            dataKey="time"
            domain={["auto", "auto"]}
            name="Time"
            tickFormatter={unixTime =>
              moment(unixTime).format("h:mma [(]s[s)]")
            }
            type="number"
            tick={{ fill: "#e8e8e8", fontSize: "0.95rem" }}
          />
          <YAxis
            tick={{ fill: "#e8e8e8" }}
            type="number"
            name="Temperature (°F)"
            tickFormatter={t => `${t}°F`}
          />
          <Line
            dot={{ fill: "#0c0c0c", stroke: "#e8e8e8" }}
            activeDot={false}
            animationDuration={0}
            type="monotone"
            dataKey="y"
            stroke="#FF0000"
            stokeWidth={10}
          />
        </LineChart>
      </ClientOnly>
    </Layout>
  )
}

export default IndexPage
