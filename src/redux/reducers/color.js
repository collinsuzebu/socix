import { SET_COLORS } from "../actions/actionTypes";
import initialState from "./initialState";

const colorReducer = (state = initialState.color, action) => {
  const { type } = action;
  switch (type) {
    case SET_COLORS:
      return {
        primary: action.color.primary,
        secondary: action.color.secondary,
      };

    default:
      return state;
  }
};

export default colorReducer;
