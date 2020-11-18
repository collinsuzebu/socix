import React from "react";
import { render as rtlRender, RenderOptions } from "@testing-library/react";
// import { Provider } from "react-redux";
// import reducer from "../../redux/reducers/auth";
import { Router, Route } from "react-router-dom";
import { createStore } from "redux";
import { createMemoryHistory } from "history";

// import thunk from "redux-thunk";

// const middlewares = [thunk];

const history = createMemoryHistory();

function render(
  ui,
  {
    initialState,
    // store = createStore(reducer, initialState),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Router history={history}>{children}</Router>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from "@testing-library/react";

// override render method
export { render };
