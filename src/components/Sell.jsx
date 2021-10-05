import React from "react";
import { Button, Input, Tooltip } from "antd";
import { createSellOrder} from "../rarible/createOrders";
import { Grid } from "@material-ui/core";
const { utils } = require("ethers");

export default function Sell(props) {
  const [sellState, setSellState] = React.useState();
  const [sellForEthValue, setSellForEthValue] = React.useState();
  const buttons = (
    <Tooltip placement="right" title="* 10 ** 18" >
      <span
        role="img"
        aria-label="* 10 ** 18"
        style={{ cursor: "pointer" }}
        onClick={async () => {
          try {
            setSellForEthValue(utils.parseEther(sellForEthValue));
          } catch {
            console.log("enter a value");
          }
        }}
      >
        ✴️
      </span>
    </Tooltip>
  );
  return (
    <Grid container justifyContent="center">
      <Button style={{...props.style, marginBottom: 4, minWidth: '60%' }} onClick={() => setSellState("ETH")}>Sell for ETH</Button>
    
      {sellState && sellState === "ETH" ? (
        <>
          <Input
            value={sellForEthValue}
            placeholder="ETH"
            onChange={e => {
              setSellForEthValue(e.target.value);
            }}
            suffix={buttons}
          />
          <Button
            style={{...props.style, marginTop: 4, minWidth: '60%' }}
            onClick={() =>
              createSellOrder("MAKE_ERC721_TAKE_ETH", props.provider, {
                accountAddress: props.accountAddress,
                makeERC721Address: props.ERC721Address,
                makeERC721TokenId: props.tokenId,
                ethAmt: sellForEthValue.toString(),
              })
            }
          >
            Create Sell Order
          </Button>
        </>
      ):   (
      <p style={{ textAlign: 'center', marginTop: 4, fontSize: 10 }}>
      Lorem Ipsum is simply dummy text of the printing and typesetting
      industry. 
     </p>)}
    </Grid>
  );
}
