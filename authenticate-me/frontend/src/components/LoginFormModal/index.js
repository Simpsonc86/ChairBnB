// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const loginDemoUser = (e) =>{
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential:'Demo-lition', password:'password' }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  }
  const loginDemoUser2 = (e) =>{
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential:'FakeUser1', password:'password2' }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  }

  return (
    <div className="login-box">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <div className="login">

            {errors.credential && (
              <p className="errors">{errors.credential}</p>
            )}
          <label>
            
            <input
              placeholder="Username or Email"
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          </label>
          <label>
            
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button className={(password.length<6||credential.length<4)?'login-btn-grey':'login-btn-red'}type="submit" disabled={(password.length<6||credential.length<4)}>Log In</button>
        </div>
      </form>
      {/* <br/> */}
      <hr/>
      <Link className='demo-link' onClick={loginDemoUser}>Demo user</Link>
      <hr/>
      <Link className='demo-link' onClick={loginDemoUser2}>Demo user 2</Link>
    </div>
  );
}

export default LoginFormModal;