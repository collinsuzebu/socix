import { SET_CURRENT_CHANNEL, SET_PRIVATE_CHANNEL } from "./actionTypes";

export function setCurrentChannel(channel) {
  return {
    type: SET_CURRENT_CHANNEL,
    currentChannel: channel,
  };
}

export function setPrivateChannel(isPrivateChannel) {
  return {
    type: SET_PRIVATE_CHANNEL,
    isPrivateChannel,
  };
}
