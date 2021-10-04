
import React from "react";
import { Button } from "antd";
import { useUserAddress  } from "eth-hooks";
import { Web3Provider } from "@ethersproject/providers";
import { useExchangePrice, useUserProvider  } from "../hooks";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useDispatch, useSelector } from 'react-redux';
import Address from "./Address";
import Balance from "./Balance";
import Wallet from "./Wallet";
import Web3Modal from "web3modal";
import { INFURA_ID } from "../constants";
import { LOGIN, LOGOUT } from "../actions/types";

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
  const price = useExchangePrice(targetNetwork, mainnetProvider);
return (
  <span>
    {address ? (
      <Address address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />
    ) : (
      "Connecting..."
    )}
    <Balance address={address} provider={localProvider} price={price} />
    <Wallet
      address={address}
      provider={userProvider}
      ensProvider={mainnetProvider}
      price={price}
      color="#afa"
    />
  </span>
);
    };



// "eth-hooks": "^2.3.9",
export default function Account() {
  const { logged, localProvider, injectedProvider, targetNetwork, mainnetProvider, blockExplorer } = useSelector(state => state.networkReducer);
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider,localProvider);
  
  const dispatch = useDispatch();
  const loadWeb3Modal = async () => {
    const provider = await web3Modal.connect();
    dispatch({
      type: LOGIN,
      payload: new Web3Provider(provider)
    });
  };
  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    dispatch({
      type: LOGOUT,
      payload: localProvider
    });
    // setTimeout(() => {
    //   window.location.reload();
    // }, 1);
  };

  const modalButtons = [];
  if (web3Modal) {
    if (logged) {
      modalButtons.push(
        <Button
          key="logoutbutton"
          style={{ verticalAlign: "top", marginLeft: 8, marginTop: 4 }}
          shape="round"
          size="large"
          onClick={logoutOfWeb3Modal}
        >
          logout
        </Button>,
      );
    } else {
      modalButtons.push(
        <Button
          key="loginbutton"
          style={{ verticalAlign: "top", marginLeft: 8, marginTop: 4 }}
          shape="round"
          size="large"
          /* type={minimized ? "default" : "primary"}     too many people just defaulting to MM and having a bad time */
          onClick={loadWeb3Modal}
        >
          connect
        </Button>,
      );
    }
  }

  // const { currentTheme } = useThemeSwitcher();

  
  return (
    <div>
    {logged ? <>
    <NetworkInfo localProvider={localProvider} 
    userProvider={userProvider} targetNetwork={targetNetwork}
    mainnetProvider={mainnetProvider} blockExplorer={blockExplorer} />
    <ConnectionButton text="Logout" onClick={logoutOfWeb3Modal} />
    </> :
    <ConnectionButton  text="Connect" onClick={loadWeb3Modal} />
    }
    </div>
  );
}
