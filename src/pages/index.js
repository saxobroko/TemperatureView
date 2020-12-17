import React, { useEffect, useState } from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import ClientOnly from "../components/clientonly"
import moment from "moment"
import useWindowSize from "../hooks/useWindowSize"
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
  VictoryBrushContainer,
  VictoryTooltip,
  createContainer,
} from "victory"
const DEV_MODE = process.env.NODE_ENV
const IndexPage = () => {
  const [temp, setTemp] = useState(0)
  const [humidity, setHumidity] = useState(0)
  const [tempData, setTempData] = useState([])
  const [zoomDomain, setZoomDomain] = useState({ x: [0, 1] })
  const [zoomDomain2, setZoomDomain2] = useState({ x: [0, 1] })
  const size = useWindowSize()
  useEffect(() => {
    const updateData = () => {
      if (window !== undefined) {
        fetch(
          (DEV_MODE === "development" ? "http://localhost:3000" : "") +
            "/api/get-data"
        ).then(data => {
          data.json().then(json => {
            setTemp(json.lastTemperature)
            setHumidity(json.lastHumidity)
            setTempData(json.history)
            let last = json.history[json.history.length - 1]
            let domain = {
              x: [moment.unix(last.at).subtract(2, "h").unix(), last.at],
            }
            setZoomDomain(domain)
            setZoomDomain2(domain)
          })
        })
      }
    }
    const interval = setInterval(updateData, 30000)
    updateData()
    return () => clearInterval(interval)
  }, [])
  const VictoryZoomVoronoiContainer = createContainer("zoom", "voronoi")
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
        <div className="chart-wrap">
          <h2>Temperature</h2>
          <div className="chart-top">
            <svg style={{ height: 0 }}>
              <defs>
                <linearGradient
                  id="tempGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="red" />
                  <stop offset="25%" stopColor="orange" />
                  <stop offset="50%" stopColor="yellow" />
                  <stop offset="75%" stopColor="green" />
                  <stop offset="100%" stopColor="blue" />
                </linearGradient>
              </defs>
            </svg>
            <VictoryChart
              width={size.width / 2}
              height={size.height - 24 * 3 - 12.8 * 3 - 12 - 29 - 19.92 * 2}
              theme={VictoryTheme.material}
              scale={{ x: "time" }}
              containerComponent={
                <VictoryZoomVoronoiContainer
                  allowZoom={false}
                  zoomDomain={zoomDomain}
                  onZoomDomainChange={setZoomDomain}
                  labels={d =>
                    `${moment.unix(d.datum._x).format("ddd hh:mma")} - ${
                      d.datum._y
                    }°F`
                  }
                />
              }
            >
              <VictoryAxis
                tickFormat={x => moment.unix(x).format("ddd hh:mma")}
              />
              <VictoryAxis
                dependentAxis
                standalone={false}
                tickValues={[
                  32,
                  40,
                  45,
                  50,
                  55,
                  60,
                  65,
                  70,
                  75,
                  80,
                  85,
                  90,
                  95,
                  100,
                ]}
                tickFormat={y => y + "°F"}
              />
              <VictoryLine
                labelComponent={<VictoryTooltip />}
                style={{
                  data: { stroke: "url(#tempGradient)" },
                  parent: { border: "1px solid #ccc" },
                }}
                data={tempData}
                x="at"
                y="temp"
                domain={{ y: [32, 100] }}
              />
            </VictoryChart>
          </div>
          <div className="chart-bottom">
            <VictoryChart
              padding={{ top: 0, left: 50, right: 50, bottom: 50 }}
              width={size.width * (3 / 4)}
              theme={VictoryTheme.material}
              height={100}
              scale={{ x: "time" }}
              containerComponent={
                <VictoryBrushContainer
                  brushDimension="x"
                  brushDomain={zoomDomain}
                  onBrushDomainChange={setZoomDomain}
                />
              }
            >
              <VictoryAxis
                tickFormat={x => moment.unix(x).format("ddd hh:mma")}
              />
              <VictoryLine
                style={{
                  data: { stroke: "#c43a31" },
                  parent: { border: "1px solid #ccc" },
                }}
                data={tempData}
                x="at"
                y="temp"
                domain={{ y: [32, 100] }}
              />
            </VictoryChart>
          </div>
        </div>
        <div className="chart-wrap">
          <h2>Humidity</h2>
          <div className="chart-top">
            <VictoryChart
              width={size.width / 2}
              height={size.height - 24 * 3 - 12.8 * 3 - 12 - 29 - 19.92 * 2}
              theme={VictoryTheme.material}
              scale={{ x: "time" }}
              containerComponent={
                <VictoryZoomVoronoiContainer
                  allowZoom={false}
                  zoomDomain={zoomDomain2}
                  onZoomDomainChange={setZoomDomain2}
                  labels={d =>
                    `${moment.unix(d.datum._x).format("ddd hh:mma")} - ${
                      d.datum._y
                    }%`
                  }
                />
              }
            >
              <VictoryAxis
                tickFormat={x => moment.unix(x).format("ddd hh:mma")}
              />
              <VictoryAxis
                dependentAxis
                standalone={false}
                tickValues={[20, 30, 40, 50, 60, 70, 80]}
                tickFormat={y => y + "%"}
              />
              <VictoryLine
                labelComponent={<VictoryTooltip />}
                style={{
                  data: { stroke: "#c43a31" },
                  parent: { border: "1px solid #ccc" },
                }}
                data={tempData}
                x="at"
                y="humidity"
                domain={{ y: [20, 80] }}
              />
            </VictoryChart>
          </div>
          <div className="chart-bottom">
            <VictoryChart
              padding={{ top: 0, left: 50, right: 50, bottom: 50 }}
              width={size.width * (3 / 4)}
              theme={VictoryTheme.material}
              height={100}
              scale={{ x: "time" }}
              containerComponent={
                <VictoryBrushContainer
                  brushDimension="x"
                  brushDomain={zoomDomain2}
                  onBrushDomainChange={setZoomDomain2}
                />
              }
            >
              <VictoryAxis
                tickFormat={x => moment.unix(x).format("ddd hh:mma")}
              />
              <VictoryLine
                style={{
                  data: { stroke: "#c43a31" },
                  parent: { border: "1px solid #ccc" },
                }}
                data={tempData}
                x="at"
                y="humidity"
                domain={{ y: [20, 80] }}
              />
            </VictoryChart>
          </div>
        </div>
      </ClientOnly>
    </Layout>
  )
}

export default IndexPage
