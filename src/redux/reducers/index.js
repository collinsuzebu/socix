import { combineReducers } from "redux";
import user from "./user";

const mainReducer = combineReducers({
  user,
});

export default mainReducer;
