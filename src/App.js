import React from "react";
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Navigation, Footer, Home, About, Contact, Mint, RaribleItemIndexer } from "./components";
import IPFSUpload from "./components/IPFSUpload";
import OrderIndexer from "./components/OrderIndexer";
import { initializeStore } from './store';

const store = initializeStore({});

function App() {
  return (
    <div className="App">
      <Provider store={store}>
      <Router>
        <Navigation />
        <Switch>
          <Route path="/" exact component={() => <Home />} />
          <Route path="/mint" exact component={() => <Mint />} />
          <Route path="/search-item" exact component={() => <RaribleItemIndexer />} />
          <Route path="/search-order" exact component={() => <OrderIndexer />} />
          <Route path="/ipfs-upload" exact component={() => <IPFSUpload />} />
          <Route path="/about" exact component={() => <About />} />
          <Route path="/contact" exact component={() => <Contact />} />
        </Switch>
        <Footer />
      </Router>
      </Provider>
    </div>
  );
}

export default App;
