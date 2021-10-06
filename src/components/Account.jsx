
import React from "react";
import { Alert, Button } from "antd";
import { useUserAddress  } from "eth-hooks";
import { Web3Provider } from "@ethersproject/providers";
import { useExchangePrice, useUserProvider  } from "../hooks";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useDispatch, useSelector } from 'react-redux';
import Address from "./Address";
import Balance from "./Balance";
import Wallet from "./Wallet";
import Web3Modal from "web3modal";
import { INFURA_ID, NETWORK } from "../constants";
import { LOGIN, LOGOUT } from "../actions/types";
import { Grid } from "@material-ui/core";

/*
  ~ What it does? ~

  Displays an Address, Balance, and Wallet as one Account component,
  also allows users to log in to existing accounts and log out

  ~ How can I use? ~

  <Account
    address={address}
    localProvider={localProvider}
    userProvider={userProvider}
    mainnetProvider={mainnetProvider}
    price={price}
    web3Modal={web3Modal}
    loadWeb3Modal={loadWeb3Modal}
    logoutOfWeb3Modal={logoutOfWeb3Modal}
    blockExplorer={blockExplorer}
  />

  ~ Features ~

  - Provide address={address} and get balance corresponding to the given address
  - Provide localProvider={localProvider} to access balance on local network
  - Provide userProvider={userProvider} to display a wallet
  - Provide mainnetProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide price={price} of ether and get your balance converted to dollars
  - Provide web3Modal={web3Modal}, loadWeb3Modal={loadWeb3Modal}, logoutOfWeb3Modal={logoutOfWeb3Modal}
              to be able to log in/log out to/from existing accounts
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
*/


/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});


const ConnectionButton = ({onClick, text}) => ( <Button
  style={{ verticalAlign: "top", marginLeft: 8, marginTop: 4 }}
  shape="round"
  size="large"
  onClick={onClick}
>
  {text}
</Button>);

const NetworkInfo = ({ userProvider,localProvider, targetNetwork, mainnetProvider, blockExplorer }) =>  {
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const address =  useUserAddress(userProvider);
  console.log('crap: ', userProvider, address);
  //TODO ensure not to use useUserAddress(userProvider) without the provider being a connected valid provvider
  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangePrice(targetNetwork, userProvider);
return (
  <Grid container alignItems="center">
    <Grid  item>
      {address ? (
        <Address address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />
      ) : (
        "Connecting..."
      )}
    </Grid>
    <Grid  item xs>
      <Balance address={address} provider={localProvider} price={price} />
    </Grid>
    <Grid  item>
      <Wallet
        address={address}
        provider={userProvider}
        ensProvider={mainnetProvider}
        price={price}
        color="#afa"
      />
     </Grid>
  </Grid>
);
    };


const NetworkAlerts = ({ localProvider, userProvider, targetNetwork }) => {
  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider?._network?.chainId;
  let selectedChainId = userProvider?.network?.chainId;
 console.log('xxx: ', localChainId, selectedChainId);
    let networkDisplay = "";
  if (localChainId && selectedChainId && localChainId !== selectedChainId) {
    const networkSelected = NETWORK(selectedChainId);
    const networkLocal = NETWORK(localChainId);
    if (selectedChainId === 1337 && localChainId === 31337) {
      networkDisplay = (
        <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
          <Alert
            message="⚠️ Wrong Network ID"
            description={
              <div>
                You have <b>chain id 1337</b> for localhost and you need to change it to <b>31337</b> to work with
                HardHat.
                <div>(MetaMask -&gt; Settings -&gt; Networks -&gt; Chain ID -&gt; 31337)</div>
              </div>
            }
            type="error"
            closable={false}
          />
        </div>
      );
    } else {
      networkDisplay = (
        <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
          <Alert
            message="⚠️ Wrong Network"
            description={
              <div>
                You have <b>{networkSelected && networkSelected.name}</b> selected and you need to be on{" "}
                <b>{networkLocal && networkLocal.name}</b>.
              </div>
            }
            type="error"
            closable={false}
          />
        </div>
      );
    }
  } else {
    networkDisplay = (
      <div style={{ zIndex: -1, position: "absolute", right: 154, top: 28, padding: 16, color: targetNetwork.color }}>
        {targetNetwork.name}
      </div>
    );
  }
  return networkDisplay;
};


// "eth-hooks": "^2.3.9",
export default function Account() {
  const { logged, localProvider, injectedProvider, targetNetwork, mainnetProvider, blockExplorer } = useSelector(state => state.networkReducer);
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider,localProvider);
  
  const dispatch = useDispatch();
  const loadWeb3Modal = async () => {
    const provider = await web3Modal.connect();
    const webProvider = new Web3Provider(provider);
    await webProvider.getNetwork();
    dispatch({
      type: LOGIN,
      payload: webProvider
    });
  };
  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    dispatch({
      type: LOGOUT,
      payload: localProvider
    });
  };
 
  return (
    <Grid container>
      
    {logged ? 
      <Grid item xs>
        <Grid container alignItems="center">
          <Grid item>
            <NetworkInfo localProvider={localProvider} 
            userProvider={userProvider} targetNetwork={targetNetwork}
            mainnetProvider={mainnetProvider} blockExplorer={blockExplorer} />
          </Grid>
          <Grid item>
            <ConnectionButton text="Logout" onClick={logoutOfWeb3Modal} />
          </Grid>
        </Grid>
      </Grid> :
      <Grid item>
        <ConnectionButton  text="Connect" onClick={loadWeb3Modal} />
      </Grid>
    }
      <NetworkAlerts localProvider={localProvider} userProvider={userProvider} targetNetwork={targetNetwork} />
    </Grid>
  );
};
