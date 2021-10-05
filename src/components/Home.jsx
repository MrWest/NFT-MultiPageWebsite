import { Grid, makeStyles } from "@material-ui/core";
import React from "react";
import { useSelector } from 'react-redux';
import NFTItems from "./NFTItems";
import styles from './styles/Home';

const useStyles = makeStyles(styles);

function Home() {
  const { logged } = useSelector(state => state.networkReducer);
  const classes = useStyles();
  return (
    <div className="home">
      <div className="container" style={{ padding: '60px 0px'}}>
      <Grid container spacing={6}>
        <Grid item md={6} >
            <img
              className={classes.nftImage}
              src="images/public/home-nft.jpeg"
              alt="home-nft"
            />
          </Grid>
          <Grid item md={6} >
            <h1 className="font-weight-light">Home</h1>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
          </Grid>
          <Grid item md={12} >
           {logged && <NFTItems />}
          </Grid>
      </Grid>
      </div>
    </div>
  );
}

export default Home;
