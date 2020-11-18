import {
  SET_CURRENT_CHANNEL,
  SET_PRIVATE_CHANNEL,
} from "../actions/actionTypes";
import initialState from "./initialState";

export default function channelReducer(state = initialState.channel, action) {
  const { type } = action;

  switch (type) {
    case SET_CURRENT_CHANNEL:
      return { ...state, currentChannel: action.currentChannel };

    case SET_PRIVATE_CHANNEL:
      return { ...state, isPrivateChannel: action.isPrivateChannel };

    default:
      return state;
  }
}
