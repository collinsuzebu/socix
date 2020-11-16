import { createStore, applyMiddleware, compose } from "redux";
import mainReducer from "./reducers";
import reduxImmutableStateInvariant from "redux-immutable-state-invariant";
import thunk from "redux-thunk";

function configStore(initialState) {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE_ || compose;
  return createStore(
    mainReducer,
    initialState,
    composeEnhancers(applyMiddleware(thunk, reduxImmutableStateInvariant()))
  );
}

export default configStore;
