import { SET_SEARCH_RESULTS } from "../actions/actionTypes";
import initialState from "./initialState";

const searchResultReducer = (state = initialState.searchResults, action) => {
  const { type } = action;

  switch (type) {
    case SET_SEARCH_RESULTS:
      return action.results;

    default:
      return state;
  }
};

export default searchResultReducer;
