import { CLEAR_USER, SET_USER } from "./actionTypes";

export const setUser = (user) => {
  return {
    type: SET_USER,
    currentUser: user,
  };
};

export const clearUser = () => {
  return {
    type: CLEAR_USER,
  };
};
