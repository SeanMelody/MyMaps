// Import all the React Goodness!
import React, { useEffect, useState } from "react";
import { listEvents } from "../../utils/API";
import { Link } from "react-router-dom"

// Function to delete the event from the database by ID
const deleteEvent = (dashboardEvent) => {
  fetch(`/api/location/${dashboardEvent._id}`, {
    method: 'DELETE'
    // Json that response
  })
    .then((response) => response.json())
    .then((data) => {
      // Console log the data
      // console.log(data)
    })

  //SWITCH ALERT TO TOAST HERE FOR EVENT UPDATE
  alert(`${dashboardEvent.name} Deleted`)

  // Refresh the page so that the event is no longer shown
  window.location.reload()

}

// Dashboard Page Component
const Dashboard = () => {

  // State for getting the list of events saved for the dashboardPage
  const [dashboardList, setDashboardList] = useState([]);

  // getListEvents function gets the list of events from the Mongo Database
  const getListEvents = async () => {
    // Await the List events function in Utils/API
    const showList = await listEvents();
    // Console.log it
    console.log(showList);
    // Set State for the event list
    setDashboardList(showList);
  };

  // UseEffect to call the function when the page loads
  useEffect(() => {
    getListEvents();
  }, []);


  // Styles for the cards.
  const cardStyles = {
    margin: "10px",
    width: "18rem"
  }

  const pageStyles = {
    height: "5000px !important",
    margin: "auto",
    position: "absolute",
    overFlow: "scroll !important"
  }

  // Console log to show that the axios request is working
  // console.log(dashboardList);

  return (
    <div style={pageStyles}>
      {/* Title of page */}
      <h1 className="text-center">Your Events</h1>
      {/* Set up a div for the table */}
      <div className="table-responsive">
        {/* Table */}
        <table className="table table-striped text-center table-hover">
          {/* Table header */}
          <thead>
            <tr >
              <th>Event Name</th>
              <th>Latitude/Longitude
              </th>

              <th>Date</th>
              <th>Description</th>
              {/* <th>View Event</th> */}
              <th>Delete Event</th>
            </tr>
          </thead>
          {/* If there is an event, display it */}
          {dashboardList.length ? (

            <tbody>
              {/* Map through the events and display them*/}
              {
                dashboardList.map((event) => (

                  <tr key={event._id}>
                    <td><h4>{event.name}</h4></td>
                    <td>
                      <p>{event.location[0].latitude}</p>
                      <p>{event.location[0].longitude}</p>
                    </td>
                    <td><p>{event.date}</p></td>
                    <td><p>{event.description}</p></td>

                    {/* Button to view the event if we want it */}
                    {/* <td>
                      <button
                        className="btn btn-info"
                        onClick={() => console.log(`VIEW ${event.title} ID: ${event._id}`)}
                      >
                        View Event
                      </button>
                    </td> */}

                    {/* Button to delete the event */}
                    <td>
                      {/* Link to send you to edit event page  */}
                      <Link className="btn btn-info"
                        to={{
                          pathname: "/editEvent",
                          // event sent via props
                          editEventProps: {
                            event
                            // name: dashboardEvent.name
                          }
                        }} >
                        Edit Event
                        </Link>
                      <button
                        className="btn btn-danger"
                        // Call the delete Event by it's ID function on click
                        onClick={() => deleteEvent(event)}
                      >
                        Delete Event
                    </button>
                    </td>
                  </tr>
                  // End of each event
                ))


              }
            </tbody>
          ) : (
              // If no events, display this
              <tbody>
                <tr>
                  <td><h1>No Events yet, save some events!  Have some fun!</h1></td>
                </tr>
              </tbody>
            )
          }

        </table>
      </div>
    </div >
  )
};

export default Dashboard;
