import React from "react";
import "./About.css";
const About = () => {
  return (
    <div>
      <div id="about" className="aboutpadding">
        <div className="heading ">
          <span className="text-[#6f82c6]" id="aboutUsId">
            About Us
          </span>
          <h1>Experience Coolness in Motion</h1>
        </div>
        <div className="about-container">
          <div className="box">
            <svg
              className="user"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              width="50"
              height="50"
            >
              <path
                fill="#6f82c6"
                d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"
              />
            </svg>

            <h2 style={{ color: "#6f82c6" }}>Customer-Centric Focus</h2>
            <p>
              At <span>DND RENTALS</span>,We Prioritize Your Journey.Our
              Platform Connects You To Realiable,Affordable And Premium Car
              Rental Options Tailored To Your Dreams.
            </p>
          </div>
          <div className="box">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
              <path
              fill="#6f82c6"
               d="M272 384c9.6-31.9 29.5-59.1 49.2-86.2c0 0 0 0 0 0c5.2-7.1 10.4-14.2 15.4-21.4c19.8-28.5 31.4-63 31.4-100.3C368 78.8 289.2 0 192 0S16 78.8 16 176c0 37.3 11.6 71.9 31.4 100.3c5 7.2 10.2 14.3 15.4 21.4c0 0 0 0 0 0c19.8 27.1 39.7 54.4 49.2 86.2l160 0zM192 512c44.2 0 80-35.8 80-80l0-16-160 0 0 16c0 44.2 35.8 80 80 80zM112 176c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-61.9 50.1-112 112-112c8.8 0 16 7.2 16 16s-7.2 16-16 16c-44.2 0-80 35.8-80 80z" />
            </svg>
            <h2 style={{ color: "#6f82c6" }}>Innovation And Technology</h2>
            <p>
              <span>DND RENTALS</span> Revolutionizes Car Rentals With
              Cutting-Edge Technology.Our Easy-To-Use App Offers Instant
              Bookings,Transparent Pricing,And Advanced Features To Ensure
              You're Always In The Driver's Seat Of Convenience.
            </p>
          </div>
          <div className="box">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
              fill="#6f82c6"
               d="M272 96c-78.6 0-145.1 51.5-167.7 122.5c33.6-17 71.5-26.5 111.7-26.5l88 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-16 0-72 0s0 0 0 0c-16.6 0-32.7 1.9-48.3 5.4c-25.9 5.9-49.9 16.4-71.4 30.7c0 0 0 0 0 0C38.3 298.8 0 364.9 0 440l0 16c0 13.3 10.7 24 24 24s24-10.7 24-24l0-16c0-48.7 20.7-92.5 53.8-123.2C121.6 392.3 190.3 448 272 448l1 0c132.1-.7 239-130.9 239-291.4c0-42.6-7.5-83.1-21.1-119.6c-2.6-6.9-12.7-6.6-16.2-.1C455.9 72.1 418.7 96 376 96L272 96z" />
            </svg>
            <h2 style={{ color: "#6f82c6" }}>Eco-Friendly Initiative</h2>
            <p>
              We're Not Just About Getting You From Point A To B. At{" "}
              <span>DND RENTALS</span>,We're Committed To A Greener
              Planet.Explore A Variety Of Fuel-efficient And Electric Vehicles
              That Combine Sustainability With Style.
            </p>
          </div>
          <div className="box">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
              fill="#6f82c6"
               d="M352 256c0 22.2-1.2 43.6-3.3 64l-185.3 0c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64l185.3 0c2.2 20.4 3.3 41.8 3.3 64zm28.8-64l123.1 0c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64l-123.1 0c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32l-116.7 0c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0l-176.6 0c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0L18.6 160C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192l123.1 0c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64L8.1 320C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6l176.6 0c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352l116.7 0zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6l116.7 0z" />
            </svg>
            <h2 style={{ color: "#6f82c6" }}>Global Reach, Local Touch</h2>
            <p>
              With <span>DND RENTALS</span>, the world is at your
              wheels.Offering rentals across major cities and remote
              destinations, we bring local expertise and global accessibility
              together for travelers everywhere.
            </p>{" "}
          </div>
          <div className="box">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
              fill="#6f82c6"
               d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-224c0-35.3-28.7-64-64-64L80 128c-8.8 0-16-7.2-16-16s7.2-16 16-16l368 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L64 32zM416 272a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
            </svg>
            <h2 style={{ color: "#6f82c6" }}>Luxury and Affordability Combined</h2>
            <p>
              Why choose between luxury and affordability? At{" "}
              <span>DND RENTALS</span>, we bridge the gap by providing a wide
              range of vehicles that cater to every budget and lifestyle.
            </p>
          </div>
          <div className="box">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
              <path
              fill="#6f82c6"
               d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
            </svg>
            <h2 style={{ color: "#6f82c6" }}> Your  Travel Companion</h2>
            <p>
              Think of <span>DND RENTALS</span> as your ultimate travel
              partner.From road trips to business commutes, our car rental app
              ensures you’re always prepared to hit the road.With 24/7 customer
              support and flexible booking options.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
