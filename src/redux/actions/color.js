import { SET_COLORS } from "./actionTypes";

export const setColors = (primary, secondary) => {
  return {
    type: SET_COLORS,
    color: {
      primary,
      secondary,
    },
  };
};
