import React, { useRef } from "react";
import PropTypes from "prop-types";
import { Map as BaseMap, TileLayer, ZoomControl } from "react-leaflet";

import { isDomAvailable } from "lib/util";
import {
  useConfigureLeaflet,
  useMapServices,
  useRefEffect,
  useInterval
} from "../hooks";

const Map = props => {
  const {
    children,
    className,
    defaultBaseMap = "OpenStreetMap",
    mapEffect,
    ...rest
  } = props;

  const mapRef = useRef();

  useConfigureLeaflet();

  useRefEffect({ ref: mapRef, effect: mapEffect });
  useInterval(() => mapEffect(mapRef.current), 2000);

  const services = useMapServices({
    names: ["OpenStreetMap"]
  });
  const basemap = services.find(service => service.name === defaultBaseMap);

  let mapClassName = `map`;

  if (className) {
    mapClassName = `${mapClassName} ${className}`;
  }

  if (!isDomAvailable()) {
    return (
      <div className={mapClassName}>
        <p className="map-loading">Loading map...</p>
      </div>
    );
  }

  const mapSettings = {
    className: "map-base",
    zoomControl: false,
    ...rest
  };

  return (
    <div className={mapClassName}>
      <BaseMap ref={mapRef} {...mapSettings}>
        {children}
        {basemap && <TileLayer {...basemap} />}
        <ZoomControl position="bottomright" />
      </BaseMap>
    </div>
  );
};

Map.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  defaultBaseMap: PropTypes.string,
  mapEffect: PropTypes.func
};

export default Map;
