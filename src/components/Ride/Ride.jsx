import React from "react";
import "./Ride.css";
const Ride = () => {
  return (
    <div>
      <div id="ride">
        <div className="heading">
          <span style={{ color: "#6f82c6" }}>HOW IT WORKS</span>
          <h1>Rent With 4 Easy Steps</h1>
        </div>
        <div className="ride-container">
          <div className="box items-center">
            <svg
              className="location-dot"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              style={{marginLeft:"36%"}}
            >
              <path
                fill="#6f82c6"
                d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"
              />
            </svg>
            <h2 style={{ color: "#6f82c6" }}>Choose A Location</h2>
            <p>
              Enter a Valid Location <br />
              For Booking a Car.
            </p>
          </div>
          <div class="box">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style={{marginLeft:"36%"}}>
              <path
                fill="#6f82c6"
                d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40L64 64C28.7 64 0 92.7 0 128l0 16 0 48L0 448c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-256 0-48 0-16c0-35.3-28.7-64-64-64l-40 0 0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40L152 64l0-40zM48 192l352 0 0 256c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256z"
              />
            </svg>
            <h2 style={{ color: "#6f82c6" }}>Pick-Up Date</h2>
            <p>
              Represent a date That You
              <br /> Want To Ride Your Dream Car.
            </p>
          </div>
          <div class="box">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{marginLeft:"36%"}}>
              <path
                fill="#6f82c6"
                d="M135.2 117.4L109.1 192l293.8 0-26.1-74.6C372.3 104.6 360.2 96 346.6 96L165.4 96c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32l181.2 0c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2l0 144 0 48c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-48L96 400l0 48c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-48L0 256c0-26.7 16.4-49.6 39.6-59.2zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"
              />
            </svg>
            <h2 style={{ color: "#6f82c6" }}>Book A Car</h2>
            <p>
              Hurry And Book Your Dream <br />
              Car At Our Service Desk
            </p>
          </div>
          <div class="box">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style={{marginLeft:"36%"}}>
              <path
                fill="#6f82c6"
                d="M320 464c8.8 0 16-7.2 16-16l0-288-80 0c-17.7 0-32-14.3-32-32l0-80L64 48c-8.8 0-16 7.2-16 16l0 384c0 8.8 7.2 16 16 16l256 0zM0 64C0 28.7 28.7 0 64 0L229.5 0c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3L384 448c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64z"
              />
            </svg>
            <h2 style={{ color: "#6f82c6" }}>Verify Your Documents</h2>
            <p>
              Verify Your Requested Documents By <br />
              Our Executive Who Delivers The Car
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ride;
