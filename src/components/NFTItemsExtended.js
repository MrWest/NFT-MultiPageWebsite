
import React, { useState } from "react";
import { Button } from "antd";
import "antd/dist/antd.css";
import Address from './Address';
import AddressInput from './AddressInput';
import Sell from './Sell';
import { Box, Grid, Paper, Tab, Tabs } from "@material-ui/core";

const TabPanel = props => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1 }} style={{ paddingTop: 16, minHeight: 142 }}>
          {children}
        </Box>
      )}
    </div>
  );
}


function a11yProps(index) {
  return {
    id: index,
    key: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
} 


const NFTItem = ({ classes, collectible, writeContracts, userProvider, address,
   transferToAddresses, approveAddresses, setTransferToAddresses, setApproveAddresses, tx,
   mainnetProvider, blockExplorer }) =>  {
          const id = collectible.id.toNumber();
          const [ selectedIndex, setSelectedIndex] = useState(0);
          const handleTabIndexChange = (event, newValue) =>  setSelectedIndex(newValue);
        return (
          <Grid key={`${id}-${collectible.uri}-${collectible.owner}`} item md={4}>
            <Paper elevation={1}>
              <Grid container className={classes.nftContainer}>
                <div>
                  <p className={classes.nftName}><strong>#{id}</strong> {collectible.name}</p>
                </div>
                <div style={{ minHeight: 285 }}>
                  <img alt={`NFT ${collectible.name}`} src={collectible.image} className={classes.nftImage} />
                </div>
                <div><p className={classes.nftName}>{collectible.description}</p></div>
                {writeContracts && 
                <div>
                    <Address
                      address={collectible.owner}
                      ensProvider={mainnetProvider}
                      blockExplorer={blockExplorer}
                      fontSize={16}
                    />
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <Tabs value={selectedIndex} onChange={handleTabIndexChange} centered aria-label="nft options">
                        <Tab label="Sell" className={classes.tab} {...a11yProps(0)}/>
                        <Tab label="Transfer" className={classes.tab} {...a11yProps(1)}/>
                        <Tab label="Approve" className={classes.tab} {...a11yProps(2)}/>
                      </Tabs>
                    </Box>
                    <TabPanel value={selectedIndex} index={0}>
                      <Grid container justifyContent="center">
                        <Grid item>
                          <Sell
                          provider={userProvider}
                          accountAddress={address}
                          ERC721Address={writeContracts.YourCollectible.address}
                          tokenId={id}
                          />
                        </Grid>
                      </Grid>
                    </TabPanel>
                    <TabPanel value={selectedIndex} index={1}>
                    <Grid container justifyContent="center">
                      <Grid item>
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
                          <Grid container justifyContent="center">
                            <Button
                              onClick={() => {
                                console.log("writeContracts", writeContracts);
                                tx(writeContracts.YourCollectible.transferFrom(address, transferToAddresses[id], id));
                              }}
                              style={{ width: '60%', marginTop: 8 }}
                            >
                              Transfer
                            </Button>
                          </Grid>
                     </Grid>
                    </Grid>
                    </TabPanel>
                    <TabPanel value={selectedIndex} index={2}>
                    <Grid container justifyContent="center">
                      <Grid item>
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
                         <Grid container justifyContent="center">
                            <Button
                              onClick={() => {
                                console.log("writeContracts", writeContracts);
                                tx(writeContracts.YourCollectible.approve(approveAddresses[id], id));
                              }}
                              style={{ width: '60%', marginTop: 8 }}
                            >
                              Approve
                            </Button>
                          </Grid>
                        </Grid>
                    </Grid>
                    </TabPanel>
                    
                </div>
                }
              </Grid>

            </Paper>
          </Grid>
    );

};

export { NFTItem };
