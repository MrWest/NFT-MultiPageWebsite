import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { LOGOUT, LOGIN } from '../actions/types';
import { INFURA_ID, NETWORKS } from '../constants';

// 😬 Sorry for all the console logging
const DEBUG = true;
/// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS.ropsten; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

const mainnetInfura = new StaticJsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID);
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_I
// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
console.log('deal: ', localProviderUrlFromEnv, process.env.REACT_APP_PROVIDER, localProviderUrl);
if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new StaticJsonRpcProvider(localProviderUrlFromEnv);

const mainnetProvider = mainnetInfura;



// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;

const NetworkReducer = (state = { logged: false, localProvider, injectedProvider: localProvider, mainnetProvider, targetNetwork, blockExplorer }, action) => {
  switch (action.type) {
    case LOGOUT:
      return  {
        ...state,
        injectedProvider: action.payload,
        logged: false
      };

    case LOGIN:
      return {
        ...state,
        injectedProvider: action.payload,
        logged: true
      };

    default:
      return state.packs
        ? state
        : {
            ...state,
            packs: []
          };
  }
};

export default NetworkReducer;
