import React, { useState } from "react";
import { Grid, makeStyles, TextField } from "@material-ui/core";
import styles from './styles/RaribleItemIndexer';
import { Button, Typography } from "antd";

const useStyles = makeStyles(styles);

const ipfsAPI = require("ipfs-http-client");

const ipfs = ipfsAPI({ host: "ipfs.infura.io", port: "5001", protocol: "https" });


const { Text } = Typography;

export default function IPFSUpload(props) {
  const [json, setJson] = useState({ attributes: [
    {
      trait_type: "BackgroundColor",
      value: "green",
    },
    {
      trait_type: "Eyes",
      value: "googly",
    },
    {
      key: "Stamina"
    }
  ]});
  const [sending, setSending] = useState();
  const [ipfsHash, setIpfsHash] = useState();

  const handleOnChange = ({ target }) => setJson(prev => ({ ... prev, [target.id]: target.value }))
  const classes = useStyles();
  return (
    <div className="container" style={{ paddingTop: 60 }}>
      <Grid container spacing={6} >
        <Grid item md={6}>

        <div style={{ paddingTop: 32, width: '100%', margin: "auto", textAlign: "left" }}>
            <div style={{ marginBottom: 6 }}>
              <TextField id="name" placeholder="Name" className={classes.textFlield} value={json.name} onChange={handleOnChange} />
            </div>
            <div style={{ marginBottom: 6 }}>
              <TextField id="description"  placeholder="Description" className={classes.textFlield} value={json.description} onChange={handleOnChange} />
            </div>
            <div style={{ marginBottom: 6 }}>
              <TextField id="external_url" placeholder="External url" className={classes.textFlield} value={json.external_url} onChange={handleOnChange} />
            </div>
            <div style={{ marginBottom: 6 }}>
              <TextField id="image" placeholder="Image url" className={classes.textFlield} value={json.image} onChange={handleOnChange} />  
            </div>
        </div>

            <Button
              style={{ margin: 8, marginTop: 16 }}
              loading={sending}
              size="large"
              shape="round"
              type="primary"
              onClick={async () => {
                console.log("UPLOADING...", json);
                setSending(true);
                setIpfsHash();
                const result = await ipfs.add(JSON.stringify(json)); // addToIPFS(JSON.stringify(yourJSON))
                if (result && result.path) {
                  setIpfsHash(result.path);
                }
                setSending(false);
                console.log("RESULT:", result);
              }}
            >
              Upload to IPFS
            </Button>
            {ipfsHash && <div style={{ padding: 16, paddingBottom: 150, textAlign: 'center' }}>
              <Text copyable={{ text: ipfsHash }} className="copyicon">
                <span>{ipfsHash}</span>
              </Text>
            </div>}
        </Grid>
        <Grid item md={6}>
            <h1 class="font-weight-light">IPFS Upload</h1>
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
