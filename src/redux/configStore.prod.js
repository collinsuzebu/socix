import { createStore, applyMiddleware } from "redux";
import mainReducer from "./reducers";
import thunk from "redux-thunk";

function configStore(initialState) {
  return createStore(mainReducer, initialState, applyMiddleware(thunk));
}

export default configStore;
