// frontend/src/components/Navigation/index.js
import React from "react";
import { NavLink,Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
// import CreateSpot from '../CreateSpot'
// import { useHistory } from "react-router-dom";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  // const history = useHistory()

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <div>
        <Link to='/spots/create'>
          <li>Create a spot</li>
        </Link>
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      </div>
    );
  } else {
    sessionLinks = (
      <li>
      <ProfileButton user={sessionUser} />
    </li>
    );
  }

  return (
    <ul>
      <li>
        <NavLink exact to="/">
          Home
        </NavLink>
      </li>
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;