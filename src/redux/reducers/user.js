import initialState from "./initialState";
import { SET_USER } from "../actions/actionTypes";

const userReducer = (state = initialState.currentUser, action) => {
  const { type } = action;

  switch (type) {
    case SET_USER:
      return {
        currentUser: action.currentUser,
        // isLoading: false,
      };

    default:
      return state;
  }
};

export default userReducer;
