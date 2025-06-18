import React from "react";
import Cookies from "js-cookie";
import FormSearch from "../components/FormSearch";
import Section from "../components/Section";
import SubHeadingTitle from "../components/SubHeadingTitle";
import IconParagraph from "../components/IconParagraph";
import Testimonial from "../components/Testimonial";
import staticImg from "../assets/team_1_img_2.jpg";

const Home = () => {
  const type = Cookies.get("type");
  return (
    <>
      <Section className="bg-dark content_1" align="left">
        <div className="col-lg-6">
          <h1 className="color-white text-center big">Request a ride now</h1>
          <div className="mw-620 mx-auto mt-10  mb-40 f-22 color-white op-7 text-center text-adaptive">
            We help you rent ambulance everywhere!
          </div>

          <div className="form_2">
            <FormSearch btnText="Search" />
          </div>
        </div>
      </Section>

      {/* Content */}
      {!type && (
        <Section className="bg-light" align="center">
          <SubHeadingTitle
            subheading="Find an Ambulance!"
            heading="Sign Up as Client"
            size="h2"
            to="/signup?u=client"
          />
          <SubHeadingTitle
            className="mt-4 mt-sm-0"
            subheading="Start Earning!"
            heading="Sign Up as Driver"
            size="h2"
            to="/signup?u=driver"
          />
        </Section>
      )}

      {/* Feature */}
      <Section className="bg-offwhite feature_1" align="center">
        <div className="col-xl-10 color-main text-center">
          <h2 className="mb-45">How it works</h2>
          <div className="row justify-content-center">
            <IconParagraph
              logo="search"
              title="Find an Ambulance"
              paragraph="Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industrys standard dummy text ever
          since the 1500s"
            />
            <IconParagraph
              logo="calendar-check"
              title="Book the Ambulance"
              paragraph="Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industrys standard dummy text ever
          since the 1500s"
            />
            <IconParagraph
              logo="smile"
              title="Rate Your Experience"
              paragraph="Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industrys standard dummy text
                ever since the 1500s"
            />
          </div>
        </div>
      </Section>

      {/* Testimonial 1 */}
      <Section className="bg-light testimonial_1" align="start">
        <div className="col-xl-2 col-lg-1"></div>
        <div className="col-md-1 col-sm-2">
          <i className="fas fa-quote-left f-36 color-gray"></i>
        </div>
        <Testimonial
          details="Great web application! It comes in very handy to just open the web and request ambulance  at any moments notice with just a few clicks. So far all the drivers we have experienced, have been curtious and very friendly. The drivers are always on time and get us to our destination safe and in a timely manner. We use Ambulance Finder often and will keep using them!"
          propic={staticImg}
          name="John Doe"
          city="Dhaka"
        />
      </Section>
    </>
  );
};

export default Home;
