// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route,Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import AllSpots from './components/AllSpots'
import SingleSpot from './components/SingleSpot'
import CreateSpot from "./components/CreateSpot";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && 
      <Switch>
        <Route exact path='/'>
          <AllSpots/>
        </Route>
        <Route exact path='/spots/create'>
          <CreateSpot/>
        </Route>
        <Route exact path='/spots/:spotId'>
          <SingleSpot/>
        </Route>
      </Switch>}
    </>
  );
}

export default App;