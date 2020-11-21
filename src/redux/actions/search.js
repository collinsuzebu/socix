import { SET_SEARCH_RESULTS } from "./actionTypes";

const setSearchResult = (results) => {
  return {
    type: SET_SEARCH_RESULTS,
    results,
  };
};

export default setSearchResult;
