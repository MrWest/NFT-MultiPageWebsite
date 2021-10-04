
import React, { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Input, List, Menu, Row } from "antd";
import "antd/dist/antd.css";
import { useUserAddress } from "eth-hooks";
import { useSelector } from 'react-redux';
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
    const readContracts = useContractLoader(localProvider);
  
    // If you want to make 🔐 write transactions to your contracts, use the userProvider:
    const writeContracts = useContractLoader(userProvider);
  
    // EXTERNAL CONTRACT EXAMPLE:
    //
    // If you want to bring in the mainnet DAI contract it would look like:
    // const mainnetDAIContract = useExternalContractLoader(mainnetProvider, DAI_ADDRESS, DAI_ABI);
  
    // If you want to call a function on a new block
    // useOnBlock(mainnetProvider, () => {
    //   console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`);
    // });
  
    // Then read your DAI balance like:
    // const myMainnetDAIBalance = useContractReader({ DAI: mainnetDAIContract }, "DAI", "balanceOf", [
    //   "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    // ]);
  
    // keep track of a variable from the contract in the local React state:
    const balance = useContractReader(readContracts, "YourCollectible", "balanceOf", [address]);
    console.log("🤗 balance:", balance);
    // 📟 Listen for broadcast events
    // const transferEvents = useEventListener(readContracts, "YourCollectible", "Transfer", localProvider, 1);
    // console.log("📟 Transfer events:", transferEvents);
  
    //
    // 🧠 This effect will update yourCollectibles by polling when your balance changes
    //
    const yourBalance = balance && balance.toNumber && balance.toNumber();
    const [yourCollectibles, setYourCollectibles] = useState();
  
    useEffect(() => {
      const updateYourCollectibles = async () => {
        const collectibleUpdate = [];
        for (let tokenIndex = 0; tokenIndex < balance; tokenIndex++) {
          try {
            console.log("GEtting token index", tokenIndex);
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
        }
        setYourCollectibles(collectibleUpdate);
      };
      updateYourCollectibles();
    }, [address, yourBalance]);
  
   
  
    const [transferToAddresses, setTransferToAddresses] = useState({});
    const [approveAddresses, setApproveAddresses] = useState({});

    return (
        <List
                bordered
                dataSource={yourCollectibles}
                renderItem={item => {
                  const id = item.id.toNumber();
                  return (
                    <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                      <Card
                        title={
                          <div>
                            <span style={{ fontSize: 16, marginRight: 8 }}>#{id}</span> {item.name}
                          </div>
                        }
                      >
                        <div>
                          <img src={item.image} style={{ maxWidth: 150 }} />
                        </div>
                        <div>{item.description}</div>
                      </Card>

                      <div>
                        owner:{" "}
                        <Address
                          address={item.owner}
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
                        ></Sell>
                      </div>
                    </List.Item>
                  );
                }}
              />
    );

};

export default NFTItems;