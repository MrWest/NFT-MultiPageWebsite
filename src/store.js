import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import reducers from "./reducers";
import throttle from "lodash/throttle";
import { saveState, loadState } from "./apis/LocalStorage";
let loadedInitialState = loadState();

export function initializeStore(initialState = loadedInitialState) {
  const store = createStore(
    reducers,
    loadedInitialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );

  store.subscribe(
    throttle(() => {
      saveState(store.getState());
    }, 1000)
  );
  return store;
}
