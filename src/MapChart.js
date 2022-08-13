import React, { useEffect, useState, useMemo, memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import sortBy from "lodash/sortBy";
import axios from "axios";

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-continents.json";

const MapChart = ({ setTooltipContent }) => {
  const [data, setData] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [maxValue, setMaxValue] = useState(0);

  const BACKEND_URL = "https://mapprojectapinodejs.herokuapp.com/";

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(BACKEND_URL)
        .then((res) => {
          setCitiesData(res.data.data.citiesData);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchData();
  }, []);

  useEffect(() => {
    const sortedCities = sortBy(citiesData, (o) => -o.data_usage);
    setMaxValue(sortedCities[0]?.data_usage);
    setData(sortedCities);
  }, [citiesData]);

  const popScale = useMemo(
    () => scaleLinear().domain([0, maxValue]).range([0, 20]),
    [maxValue]
  );

  return (
    <div data-tip="">
      <ComposableMap
        projectionConfig={{ rotate: [-10, 0, 0] }}
        style={{ height: "95vh", width: "100%" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              return <Geography key={geo.rsmKey} geography={geo} fill="#bad" />;
            })
          }
        </Geographies>
        {data?.map((country) => {
          return (
            <Marker
              key={country.city_code}
              coordinates={[country.lng, country.lat]}
            >
              <circle
                fill={
                  country.data_usage > 470
                    ? "#1E3F66"
                    : country.data_usage < 470 && country.data_usage > 430
                    ? "#2E5984"
                    : country.data_usage < 430 && country.data_usage > 390
                    ? "#528AAE"
                    : country.data_usage < 390 && country.data_usage > 345
                    ? "#73A5C6"
                    : country.data_usage < 345 && country.data_usage > 270
                    ? "#91BAD6"
                    : "#BCD2E8"
                }
                stroke="#FFF"
                r={popScale(country.data_usage)}
                onMouseEnter={() => {
                  setTooltipContent({
                    country: country.country,
                    city: country.city,
                    data_usage: country.data_usage,
                    networks_available: country.networks_available,
                  });
                }}
                onMouseLeave={() => {
                  setTooltipContent(null);
                }}
              />
            </Marker>
          );
        })}
      </ComposableMap>
    </div>
  );
};

export default memo(MapChart);
