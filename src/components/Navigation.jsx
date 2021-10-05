import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Grid } from "@material-ui/core";
import Account from "./Account";
function Navigation(props) {
  return (
    <div className="navigation">
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            NFT Multi-Page Website
          </Link>
          <div>
            <ul className="navbar-nav ml-auto">
              <li
                className={`nav-item  ${
                  props.location.pathname === "/" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/">
                  Home
                  <span className="sr-only">(current)</span>
                </Link>
              </li>
              <li
                className={`nav-item  ${
                  props.location.pathname === "/mint" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/mint">
                  Mint
                </Link>
              </li>
              <li
                className={`nav-item  ${
                  props.location.pathname === "/search-item" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/search-item">
                  Search Item
                </Link>
              </li>
              <li
                className={`nav-item  ${
                  props.location.pathname === "/ipfs-upload" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/ipfs-upload">
                  IPFS Upload
                </Link>
              </li>
              <li
                className={`nav-item  ${
                  props.location.pathname === "/about" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/about">
                  About
                </Link>
              </li>
              <li
                className={`nav-item  ${
                  props.location.pathname === "/contact" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <Grid container justifyContent="flex-end" style={{ minWidth: 480 }}>
              <Grid item>
                <Account />
              </Grid>
            </Grid>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default withRouter(Navigation);
