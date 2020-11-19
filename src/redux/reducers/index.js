import { combineReducers } from "redux";
import user from "./user";
import channel from "./channel";
import color from "./color";

const mainReducer = combineReducers({
  user,
  channel,
  color,
});

export default mainReducer;
