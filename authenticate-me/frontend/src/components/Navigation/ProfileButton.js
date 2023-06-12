// frontend/src/components/Navigation/ProfileButton.js
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css'
import {Link,useHistory} from 'react-router-dom';

function ProfileButton({ user }) {
  const history = useHistory()
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    history.push(`/`)
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button className='menu-btn' onClick={openMenu}>
        <i className="fa-solid fa-bars"></i>
        &nbsp;&nbsp;&nbsp;
        <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <div>Hello, {user.username}</div>
            <div>{user.email}</div>
            <hr/>
            <div><Link id='manage-spots-profile-link'to={`/current`}>Manage Spots</Link></div>
            <hr/>
            <div className="logout-btn-div">
              <button id='logout-btn'onClick={logout}>Log Out</button>
            </div>
          </>
        ) : (
          <>
            <div>
              <OpenModalButton
                id='manage-spots-profile-link'
                buttonText="Sign Up"
                modalComponent={<SignupFormModal />}
              />
            </div>
            <br/>
            <div>
              <OpenModalButton
              id='manage-spots-profile-link'
                buttonText="Log In"
                modalComponent={<LoginFormModal />}
              />
            </div>
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;