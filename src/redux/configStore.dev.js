import { createStore } from "redux";
import mainReducer from "./reducers";
import { composeWithDevTools } from "redux-devtools-extension";

function configStore(initialState) {
  const composedEnhancers = composeWithDevTools();

  return createStore(mainReducer, initialState, composedEnhancers);
}

export default configStore;
