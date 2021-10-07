import React from "react";
import { Button, Input, List, Card } from "antd";
import { AddressInput } from ".";
import { useUserAddress, useUserProvider } from "eth-hooks";
import { useSelector } from "react-redux";
import { formatEther } from "@ethersproject/units";
import { prepareMatchingOrder } from "../rarible/createOrders";
import { BigNumber } from "@ethersproject/bignumber";
import { useGasPrice } from "../hooks";
import { Transactor } from "../helpers";
import { Grid } from "@material-ui/core";
import { getSellOrderByCollectionEP, getSellOrdersByItemEP } from "../apis/endpoints";

const SellButtonSection = ({ item}) => {
  const { injectedProvider,localProvider, mainnetProvider, targetNetwork } = useSelector(state => state.networkReducer);
    
  const userProvider = useUserProvider(injectedProvider,localProvider);
  const address = useUserAddress(userProvider);
    /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
    const gasPrice = useGasPrice(targetNetwork, "fast");
    // The transactor wraps transactions and provides notificiations
    const tx = Transactor(mainnetProvider, gasPrice);
  return (
    <Button
    onClick={async () =>{
      const preparedTransaction = await prepareMatchingOrder(item, address)
      console.log({preparedTransaction})
      const value = preparedTransaction.asset.value
      const valueBN = BigNumber.from(value)
      const safeValue = valueBN.add(100)
      console.log({safeValue})
      const signer = userProvider.getSigner()
      tx(signer.sendTransaction({to: preparedTransaction.transaction.to, from: address, data: preparedTransaction.transaction.data, value: safeValue}))

    }
    }
  >
    Fill order
  </Button>
  );
};

const OrderIndexer = ({}) => {
    const [collectionContract, setCollectionContract] = React.useState();
    const [tokenId, setTokenId] = React.useState();
    const [downloading, setDownloading] = React.useState();
    const [sellOrderContent, setSellOrderContent] = React.useState();

    const { logged, mainnetProvider } = useSelector(state => state.networkReducer);
    
    return (
        <div className="container" style={{ paddingTop: 60, paddingBottom: 180 }} >
          <Grid container spacing={6}>
              <Grid item md={6}>
            <div >
              <AddressInput
                ensProvider={mainnetProvider}
                placeholder="NFT collection address"
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
            </div>
            <Button
              style={{ margin: 8 }}
              loading={downloading}
              size="large"
              shape="round"
              type="primary"
              onClick={async () => {
                setDownloading(true);
                let sellOrderResult
                if (tokenId) {
                const getSellOrdersByItemUrl = getSellOrdersByItemEP(collectionContract, tokenId);
                sellOrderResult = await fetch(getSellOrdersByItemUrl);
                } else {
                const getSellOrderByCollectionUrl = getSellOrderByCollectionEP(collectionContract);
                sellOrderResult = await fetch(getSellOrderByCollectionUrl);
                }
                const resultJson = await sellOrderResult.json();
                if (resultJson && resultJson.orders) {
                  setSellOrderContent(resultJson.orders);
                }
                setDownloading(false);
              }}
            >
              Get Sell Orders
            </Button>

            {/* <pre style={{ padding: 16, paddingBottom: 150 }}>
              {JSON.stringify(sellOrderContent)}
            </pre> */}
            <div style={{ marginTop: 32, paddingBottom: 32 }}>
              <List
                bordered
                dataSource={sellOrderContent}
                renderItem={item => {
                  const id = item.hash;
                  return (
                    <List.Item key={id}>
                      <Card
                        title={
                          <div>
                            <span style={{ fontSize: 16, marginRight: 8 }}>{item.type}</span>
                          </div>
                        }
                      >
                        <div>
                          <p>maker: {item.maker}</p>
                          <p>selling:</p>
                          <p>collection: {item.make.assetType.contract}</p>
                          <p>tokenId: {item.make.assetType.tokenId}</p>
                          <p>
                            price: {formatEther(item.take.value)}
                            {item.take.assetType.assetClass}
                          </p>
                          <p>createAt: {item.createdAt}</p>
                        </div>
                      </Card>

                      {logged && <SellButtonSection item={item} />}
                    </List.Item>
                  );
                }}
              />
            </div>
            </Grid>
            <Grid item md={6}>
                <h1 class="font-weight-light">Search Order</h1>
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
};

export default OrderIndexer;