// frontend/src/components/Navigation/index.js
import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import CreateSpot from '../CreateSpot'
// import { useHistory } from "react-router-dom";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  // const history = useHistory()

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <div className="profile-menu">
        <Link className='create-link' to='/spots/new'>
          <div>Create a New Spot</div>
        </Link>
        <div className="profile-btn">
          <ProfileButton user={sessionUser} />
        </div>
      </div>
    );
  } else {
    sessionLinks = (
      <div className='profile-btn'>
        <ProfileButton user={sessionUser} />
      </div>
    );
  }

  return (
    <nav>
      <div className="nav-bar">
        <div className='home-link'>
          <NavLink exact to="/">
            Home
          </NavLink>
        </div>
        {isLoaded && sessionLinks}
      </div>
    </nav>
  );
}

export default Navigation;