import initialState from "./initialState";
import { CLEAR_USER, SET_USER } from "../actions/actionTypes";

const userReducer = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case SET_USER:
      return {
        ...state,
        currentUser: action.currentUser,
        isLoading: false,
      };

    case CLEAR_USER:
      return {
        ...state,
        isLoading: false,
      };

    default:
      return state;
  }
};

export default userReducer;
