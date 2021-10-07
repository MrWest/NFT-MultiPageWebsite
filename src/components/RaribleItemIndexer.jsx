import React from "react";
import { Button, Input, List, Card } from "antd";
import {AddressInput, Sell} from './index'
import { Grid, makeStyles } from "@material-ui/core";
import { useContractLoader, useGasPrice } from "../hooks";
import { useSelector } from "react-redux";
import styles from './styles/RaribleItemIndexer';
import { Transactor } from "../helpers";
import { getNFTItemsEP } from "../apis/endpoints";
import { useUserProvider } from "eth-hooks";

const useStyles = makeStyles(styles);

export default function RaribleItemIndexer(props) {
  const [collectionContract, setCollectionContract] = React.useState();
  const [approveAddress, setApproveAddress] = React.useState();
  const [tokenId, setTokenId] = React.useState();
  const [downloading, setDownloading] = React.useState();
  const [items, setItems] = React.useState();

  const { injectedProvider,localProvider, mainnetProvider, targetNetwork } = useSelector(state => state.networkReducer);
  //const userProvider = useUserProvider(injectedProvider,localProvider);
   
  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  const writeContracts = useContractLoader(mainnetProvider);
  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
   const gasPrice = useGasPrice(targetNetwork, "fast");
  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(mainnetProvider, gasPrice);

  const classes = useStyles();
  return (
    <div className="container" style={{ paddingTop: 60, paddingBottom: 120 }}>
      <Grid container spacing={6} >
        <Grid item md={6}>
      <div style={{ paddingTop: 32, width: '100%', margin: "auto" }}>
      <AddressInput
        ensProvider={mainnetProvider}
        placeholder="contractAddress"
        value={collectionContract}
        onChange={newValue => {
          setCollectionContract(newValue);
        }}
      />
      <Input
        value={tokenId}
        placeholder="tokenId"
        onChange={e => {
          setTokenId(e.target.value);
        }}
      />
      <Button
        style={{ margin: 8 }}
        loading={downloading}
        size="large"
        shape="round"
        type="primary"
        onClick={async () => {
                const getItemMetaByIdUrl = `${getNFTItemsEP}/${collectionContract}:${tokenId}/meta`;
                setDownloading(true);
                const getItemMetaResult = await fetch(getItemMetaByIdUrl);
                const metaResultJson = await getItemMetaResult.json();
                if (metaResultJson) {
                  setItems([{id: `${collectionContract}:${tokenId}`, name: metaResultJson.name, description: metaResultJson.description, image: metaResultJson.image.url.ORIGINAL}])
                }
                setDownloading(false);
        }}
      >
        Get Item
      </Button>
    </div>
    <div style={{ width: '100%', margin: "auto", marginTop: 32, paddingBottom: 32 }}>
      <List
        bordered
        dataSource={items}
        renderItem={item => {
          const id = item.id;
              return (
                    <List.Item key={id}>
                      <Grid container>
                        <div style={{ width: '100%' }}>
                          <h4 className={classes.imgTitle}>{item.name}</h4>
                        </div>
                        <Grid item md={12}>
                          <img alt={`NFT-${item.name}`} src={item.image} className={classes.nftImage} />
                        </Grid>
                        <div style={{ width: '100%' }}>
                          <p className={classes.imgTitle} style={{ marginTop: 8 }}>{item.description}</p>
                        </div>
                      <Grid item md={12}>
                        <AddressInput
                          ensProvider={mainnetProvider}
                          placeholder="approve address"
                          value={approveAddress}
                          onChange={newValue => {
                            setApproveAddress(newValue);
                          }}
                        />
                        <Grid container spacing={6}>
                          <Grid item xs>
                             <Button
                               style={{ width:'100%' }}
                                onClick={() => {
                                  console.log("writeContracts", writeContracts);
                                  const thisERC721Rarible = writeContracts.ERC721Rarible.attach(collectionContract)
                                  tx(thisERC721Rarible.approve(approveAddress, tokenId));
                                }}
                              >
                                Approve
                              </Button> 
                          </Grid>
                         <Grid item xs>
                              <Sell
                                provider={localProvider}
                                accountAddress={mainnetProvider}
                                ERC721Address={collectionContract}
                                tokenId={tokenId}
                                style={{ width:  '100%' }}
                                />
                         </Grid>
                      </Grid>
                      <div style={{ paddingTop: 16, width: '100%', paddingBottom: 16 }}>
                        {items?.map(i => {
                          const properties = Object.keys(i);
                          return (<div>
                            {properties.map(key => (<p key={key} className={classes.itemProperties}><strong>{key}: </strong>{i[key]}</p>))}
                          </div>)
                        })}
                      </div>
                    </Grid>
                  </Grid>
                    </List.Item>
                  );
                }}
              />
            </div>
        </Grid>
        <Grid item md={6}>
            <h1 class="font-weight-light">Search Item</h1>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy text
                ever since the 1500s, when an unknown printer took a galley of
                type and scrambled it to make a type specimen book.
              </p>
          </Grid>
        </Grid>
    </div>
  );
}
