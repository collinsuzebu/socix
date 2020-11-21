import { combineReducers } from "redux";
import user from "./user";
import channel from "./channel";
import color from "./color";
import searched from "./search";

const mainReducer = combineReducers({
  user,
  channel,
  color,
  searched,
});

export default mainReducer;
