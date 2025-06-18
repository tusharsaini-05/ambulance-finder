import { useLocation } from "react-router-dom"
import Section from "../components/Section"
import SubHeadingTitle from "../components/SubHeadingTitle"
import SignupDriver from "./Driver/Signup"
import SignupClient from "./Client/Signup"

const Signup = () => {
  const user = new URLSearchParams(useLocation().search).get("u")

  return (
    <>
      {!user && (
        <Section className="bg-light d-flex align-items-center sign_up" align="center">
          <SubHeadingTitle
            subheading="Find an Ambulance!"
            heading="Sign Up as Client"
            size="h1 big"
            to="/signup?u=client"
          />
          <SubHeadingTitle
            className="mt-5 mt-sm-0"
            subheading="Start Earning!"
            heading="Sign Up as Driver"
            size="h1 big"
            to="/signup?u=driver"
          />
        </Section>
      )}
      {user && (
        <>
          {/* client */}
          {user === "client" && <SignupClient />}
          {/* driver */}
          {user === "driver" && <SignupDriver />}
        </>
      )}
    </>
  )
}

export default Signup
