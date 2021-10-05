import React from "react";
import { Button, Input, Tooltip } from "antd";
import {AddressInput} from './'
import { Grid } from "@material-ui/core";
import { useSelector } from "react-redux";
import { useContractLoader } from "../hooks";

export default function Mint(props) {
  const [mintTo, setMintTo] = React.useState();
  const [ipfsHash, setIpfsHash] = React.useState();
  const [sending, setSending] = React.useState();
  const {  injectedProvider, localProvider, mainnetProvider } = useSelector(state => state.networkReducer);
  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  const writeContracts = useContractLoader(injectedProvider === localProvider ? mainnetProvider : injectedProvider);
  return (
    <div className="container" style={{ padding: '60px 0px' }}>
      <Grid container justifyContent="center" spacing={6}>
        <Grid item md={6} style={{ paddingTop: 70 }}>
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
        <Grid item md={6}>
            <h1 class="font-weight-light">Mint Item</h1>
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
