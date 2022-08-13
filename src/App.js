import React, { useState } from "react";
import ReactTooltip from "react-tooltip";
import "./App.css";
import MapChart from "./MapChart";

function App() {
  const [content, setContent] = useState(null);
  return (
    <div className="app">
      <div className="main__header">
        <h1>Worldwide Network Availability & Data Usage</h1>
      </div>
      <MapChart setTooltipContent={setContent} />
      {content && (
        <ReactTooltip>
          <div className="country__details">
            <p className="country__name">{`Country: ${content?.country}`}</p>
            <p className="city__name">{`City: ${content?.city}`}</p>
            <p className="country__networks">{`Available Networks: ${content?.networks_available}`}</p>
            <p className="country__datausage">{`Data Usage: ${content?.data_usage} Million GB`}</p>
          </div>
        </ReactTooltip>
      )}
    </div>
  );
}

export default App;
