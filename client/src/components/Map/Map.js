import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom"
import ReactMapGL, {
  Marker,
  Popup,
  GeolocateControl,
  NavigationControl,
} from "react-map-gl";
import EntryForm from "./EntryForm";
import { listEvents } from "../../utils/API";
import ControlPanel from "./Control-Panel";
import Pin from "./pin";
import Geocoder from "react-map-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "./Map.css";
require("dotenv").config();


const Map = () => {
  // map setup
  const api = `pk.eyJ1IjoiZnJhbmNpc24yMSIsImEiOiJja2x1amVuNGQwYmVkMm9vZW9xc3VwOW9jIn0.eh8hBFzSr0tJUxungpfu3A`;
  const mapstyle = "mapbox://styles/francisn21/cklv81byf44mx17ql4bv4chxl";
  const [showevents, setEvents] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEventLocation, setEventLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 37.0902,
    longitude: -95.7129,
    zoom: 10,
  });

  // useeffect for calling API to load saved events to markers on the map
  // reusable backend call to fetch event database
  const getEvents = async () => {
    try {
      const showMarkers = await listEvents();
      console.log(showMarkers);
      setEvents(showMarkers);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  //
  const geolocateStyle = {
    top: 0,
    right: 0,
    margin: 10,
  };
  const positionOptions = { enableHighAccuracy: true };

  //===========TEST CONTAINER============//
  const navStyle = {
    position: "absolute",
    top: 40,
    right: 30,
    padding: "10px",
  };

  // ===========ENDS HERE============ //
  //  GeoCoder Location //
  const mapRef = useRef();
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };

      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides,
      });
    },
    [handleViewportChange]
  );

  // new Event section //

  const addEventPopup = (event) => {
    const [longitude, latitude] = event.lngLat;
    setEventLocation({
      latitude,
      longitude,
    });
  };
  //  delete and edit popup ==== //


  // Function to delete the event from the database by ID
  const deleteEvent = (event) => {
    fetch(`/api/location/${event._id}`, {
      method: 'DELETE'
      // Json that response
    })
      // Json the response
      .then((response) => response.json())
      .then((data) => {
        // Console log the data
        // console.log(data)
      })
    // Refresh the page so that the event is no longer shown
    window.location.reload()


    //SWITCH ALERT TO TOAST HERE FOR EVENT DELETE
    alert(`${event.name} Deleted`)
  }

  return (
    <div className="map">
      <ReactMapGL
        ref={mapRef}
        {...viewport}
        mapboxApiAccessToken={api}
        mapStyle={mapstyle}
        onClick={() => setShowPopup({})}
        onDblClick={addEventPopup}
        onViewportChange={handleViewportChange}
      >
        {/* display marker section */}
        {showevents.map((event) => (
          <React.Fragment key={event._id}>
            <Marker
              // className="event-pin"
              latitude={event.location[0].latitude}
              longitude={event.location[0].longitude}
              offsetTop={-20}
              offsetLeft={-10}
            >
              {/* div wrapper to add onclick to the markers on the map to show the event info */}
              <div
                onClick={() =>
                  setShowPopup({
                    // ...showPopup,
                    [event._id]: true,
                  })
                }
              >
                <Pin color="#1f4980" />
              </div>
            </Marker>
            {showPopup[event._id] ? (
              <Popup
                latitude={event.location[0].latitude}
                longitude={event.location[0].longitude}
                closeButton={true}
                closeOnClick={false}
                dynamicPosition={true}
                onClose={() => setShowPopup({})}
                anchor="top"
              >
                <div className="popup">
                  <h3>{event.name}</h3>
                  <p>{event.description}</p>
                  <p>{event.date}</p>
                  {/* Link to send you to edit event page */}
                  <Link
                    className="btn btn-primary"
                    to={{
                      pathname: "/editEvent",
                      // Send event to edit event page via props
                      editEventProps: {
                        event
                      }
                    }} >
                    edit
                  </Link>
                  {/* <button className="btn btn-primary"
                    onClick={() => editEvent(event)}
                  >edit</button> */}
                  <button className="btn btn-danger"
                    onClick={() => deleteEvent(event)}
                  >delete</button>
                </div>
              </Popup>
            ) : null}
          </React.Fragment>
        ))}
        {/* display marker section END*/}
        {/* New Location section */}
        {addEventLocation ? (
          <>
            <Marker
              latitude={addEventLocation.latitude}
              longitude={addEventLocation.longitude}
              offsetTop={-30}
              offsetLeft={-10}
            >
              <div>
                <Pin color="red" />
              </div>
            </Marker>
            <Popup
              latitude={addEventLocation.latitude}
              longitude={addEventLocation.longitude}
              closeButton={true}
              closeOnClick={false}
              dynamicPosition={true}
              onClose={() => setEventLocation(null)}
              anchor="top"
            >
              <div className="popup">
                <EntryForm
                  onClose={() => {
                    setEventLocation(null);
                    getEvents();
                  }}
                  location={addEventLocation}
                />
              </div>
            </Popup>
          </>
        ) : null}
        {/* New Location section end*/}
        {/* location search */}
        <Geocoder
          mapRef={mapRef}
          onViewportChange={handleGeocoderViewportChange}
          mapboxApiAccessToken={api}
          position="top-left"
        />

        {/* Utilities Section */}

        {/* looks for user location */}
        <GeolocateControl
          style={geolocateStyle}
          positionOptions={positionOptions}
          trackUserLocation
          auto
        />
        {/*  */}
        <div className="nav" style={navStyle}>
          <NavigationControl />
        </div>
      </ReactMapGL>
    </div >
  );
};

export default Map;
