import React from "react";
import { Button, Input, Tooltip } from "antd";
import {AddressInput} from './'
import { Grid } from "@material-ui/core";

export default function Mint(props) {
  const [mintTo, setMintTo] = React.useState();
  const [ipfsHash, setIpfsHash] = React.useState();
  const [sending, setSending] = React.useState();
  console.log({writeContracts: props.writeContracts})
  const writeContracts = props.writeContracts
  return (
    <div className="container" style={{ padding: '60px 0px' }}>
      <Grid container justifyContent="center">
        <Grid item md={6}>
          <AddressInput
            ensProvider={props.ensProvider}
            placeholder="Recipient Address"
            value={mintTo}
            onChange={newValue => {
              setMintTo(newValue);
            }}
          />
          <Input
            value={ipfsHash}
            placeholder="IPFS Hash"
            onChange={e => {
              setIpfsHash(e.target.value);
            }}
          />
          <Button
            style={{ margin: 8 }}
            loading={sending}
            size="large"
            shape="round"
            type="primary"
            onClick={async () => {
              setSending(true);
              console.log("sending");
              await writeContracts.YourCollectible.mintItem(mintTo, ipfsHash)
              setSending(false);
            }}
          >
            Mint
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
