
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "antd";
import "antd/dist/antd.css";
import { useUserAddress } from "eth-hooks";
import { useDispatch, useSelector } from 'react-redux';
import Address from './Address';
import AddressInput from './AddressInput';
import Sell from './Sell';
import { Transactor } from "../helpers";
import {
useContractLoader,
useContractReader,
useGasPrice,
useUserProvider,
} from "../hooks";
import { LOAD_COLLECTIBLES } from "../actions/types";
import { Grid, makeStyles, Paper } from "@material-ui/core";
import styles from './styles/NFTItems';

const useStyles = makeStyles(styles);

const { BufferList } = require("bl");
// https://www.npmjs.com/package/ipfs-http-client
const ipfsAPI = require("ipfs-http-client");

const ipfs = ipfsAPI({ host: "ipfs.infura.io", port: "5001", protocol: "https" });

// helper function to "Get" from IPFS
// you usually go content.toString() after this...
const getFromIPFS = async hashToGet => {
  for await (const file of ipfs.get(hashToGet)) {
    console.log(file.path);
    if (!file.content) continue;
    const content = new BufferList();
    for await (const chunk of file.content) {
      content.append(chunk);
    }
    console.log(content);
    return content;
  }
};


const NFTItems = () => {
    const { localProvider, injectedProvider, targetNetwork, mainnetProvider, blockExplorer } = useSelector(state => state.networkReducer);
    
    // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
    const userProvider = useUserProvider(injectedProvider, localProvider);
    /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
    const gasPrice = useGasPrice(targetNetwork, "fast");
    // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
    const address = useUserAddress(userProvider);
  
   
    // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks
  
    // The transactor wraps transactions and provides notificiations
    const tx = Transactor(userProvider, gasPrice);
  
   
  
    // Load in your local 📝 contract and read a value from it:
    const readContracts = useContractLoader(userProvider);
  
    // If you want to make 🔐 write transactions to your contracts, use the userProvider:
    const writeContracts = useContractLoader(userProvider);
  
    
    // keep track of a variable from the contract in the local React state:
    const balance = useContractReader(readContracts, "YourCollectible", "balanceOf", [address]);
    console.log("🤗 balance:", balance);

    // 🧠 This effect will update yourCollectibles by polling when your balance changes
    //
    // const yourBalance = balance && balance.toNumber && balance.toNumber();
    const [isLoading, setIsLoading] = useState(false);
    const collectibles = useSelector(state => state.collectiblesReducer);

    const dispatch = useDispatch();

    const updateYourCollectibles = useCallback(async () => {
      const collectibleUpdate = [];
      for (let tokenIndex = 0; tokenIndex < balance && collectibles.length !== balance; tokenIndex++) {
        setIsLoading(true);
        try {
          console.log("Getting token index", tokenIndex);
          const tokenId = await readContracts.YourCollectible.tokenOfOwnerByIndex(address, tokenIndex);
          console.log("tokenId", tokenId);
          const tokenURI = await readContracts.YourCollectible.tokenURI(tokenId);
          console.log("tokenURI", tokenURI);

          const ipfsHash = tokenURI.replace("https://ipfs.io/ipfs/", "");
          console.log("ipfsHash", ipfsHash);

          const jsonManifestBuffer = await getFromIPFS(ipfsHash);

          try {
            const jsonManifest = JSON.parse(jsonManifestBuffer.toString());
            console.log("jsonManifest", jsonManifest);
            collectibleUpdate.push({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          console.log(e);
        }
        setIsLoading(false);
      }
      
      dispatch({
        type: LOAD_COLLECTIBLES,
        payload: collectibleUpdate
      });
      
    }, [address, balance]);
  
    useEffect(() => {
      updateYourCollectibles();
    }, [ updateYourCollectibles]);
  
   
  
    const [transferToAddresses, setTransferToAddresses] = useState({});
    const [approveAddresses, setApproveAddresses] = useState({});

    const classes = useStyles();
    return isLoading ? 'Loading collectibles...' : (
      <Grid container spacing={4}>
        {collectibles.map(collectible => {
          const id = collectible.id.toNumber();
        return (
          <Grid key={`${id}-${collectible.uri}-${collectible.owner}`} item md={4}>
             <p><span style={{ fontSize: 16, marginRight: 8, fontWeight: 'bold' }}>#{id}</span> {collectible.name}</p>
            <Paper elevation={1}>
              <Grid container>
                <div style={{ width: '100%' }}>
                  <img alt={`NFT ${collectible.name}`} src={collectible.image} className={classes.nftImage} />
                </div>
                <div><p>{collectible.description}</p></div>
                {writeContracts && 
                <div>
                    <Address
                      address={collectible.owner}
                      ensProvider={mainnetProvider}
                      blockExplorer={blockExplorer}
                      fontSize={16}
                    />
                    <AddressInput
                      ensProvider={mainnetProvider}
                      placeholder="transfer to address"
                      value={transferToAddresses[id]}
                      onChange={newValue => {
                        const update = {};
                        update[id] = newValue;
                        setTransferToAddresses({ ...transferToAddresses, ...update });
                      }}
                    />
                    <Button
                      onClick={() => {
                        console.log("writeContracts", writeContracts);
                        tx(writeContracts.YourCollectible.transferFrom(address, transferToAddresses[id], id));
                      }}
                    >
                      Transfer
                    </Button>
                    <AddressInput
                      ensProvider={mainnetProvider}
                      placeholder="approve address"
                      value={approveAddresses[id]}
                      onChange={newValue => {
                        const update = {};
                        update[id] = newValue;
                        setApproveAddresses({ ...approveAddresses, ...update });
                      }}
                    />
                    <Button
                      onClick={() => {
                        console.log("writeContracts", writeContracts);
                        tx(writeContracts.YourCollectible.approve(approveAddresses[id], id));
                      }}
                    >
                      Approve
                    </Button>
                    <Sell
                      provider={userProvider}
                      accountAddress={address}
                      ERC721Address={writeContracts.YourCollectible.address}
                      tokenId={id}
                    />
                </div>
                }
              </Grid>

            </Paper>
          </Grid>
      )
    })}

      </Grid>
    );

};

export default NFTItems;