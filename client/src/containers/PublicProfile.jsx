import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import Section from "../components/Section";
import PageTitle from "../components/PageTitle";
import ProfileDriver from "../components/ProfileDriver";
import ProfileClient from "../components/ProfileClient";
import Review from "../components/Review";
import UserApi from "../api/user";
import ReviewApi from "../api/review";

const PublicProfile = () => {
  const { id } = useParams();
  const global = useContext(GlobalContext);
  const [user, setUser] = useState({});
  const [reviews, setReviews] = useState([]);

  const getProfileData = () => {
    UserApi.findUserById(id)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        global.setAlert({
          type: "danger",
          message: err.response.data.message,
        });
      });
  };
  const getReviews = () => {
    ReviewApi.getReviewsByReceiver(id)
      .then((res) => {
        setReviews(res.data);
      })
      .catch((err) => {
        global.setAlert({
          type: "danger",
          message: err.response.data.message,
        });
      });
  };

  useEffect(() => {
    getProfileData();
    getReviews();
  }, []);

  return (
    <>
      <Section className="bg-light d-flex align-items-center" align="center">
        <PageTitle title="Profile" />

        {user.type == 0 && <ProfileClient user={user} />}
        {user.type == 1 && <ProfileDriver user={user} />}
      </Section>

      <Section className="bg-offwhite d-flex align-items-center" align="center">
        <PageTitle title="Reviews" />
        <div className="col-lg-12">
          {(reviews.length > 0 &&
            reviews.map((review) => {
              return <Review key={review._id} {...review} />;
            })) || <div className="h5 text-center">No reviews yet</div>}
        </div>
      </Section>
    </>
  );
};

export default PublicProfile;
