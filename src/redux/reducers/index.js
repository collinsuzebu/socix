import { combineReducers } from "redux";
import user from "./user";
import channel from "./channel";

const mainReducer = combineReducers({
  user,
  channel,
});

export default mainReducer;
