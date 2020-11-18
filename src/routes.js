import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory } from "react-router-dom";
import firebase from "./firebase";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import HomePage from "./components/HomePage";
import { clearUser, setUser } from "./redux/actions/user";
import Spinner from "./Spinner";

const BaseRouter = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.user.isLoading);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(setUser(user));
        history.push("/");
      } else {
        dispatch(clearUser());
        history.push("/login");
      }
    });
  }, []);

  return isLoading ? (
    <Spinner />
  ) : (
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
    </Switch>
  );
};

export default BaseRouter;
