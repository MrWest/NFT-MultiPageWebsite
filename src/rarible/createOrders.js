// import { utils } from "ethers";
// import { sign, getMessageHash } from "./order";
import { createSellOrderEP, encodeOrderEP } from "../apis/endpoints";
import { sign } from "./order";

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

async function prepareOrderMessage(form) {
  const res = await fetch(encodeOrderEP, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });
  const resJson = await res.json();
  console.log('kkk3', { resJson });
  return resJson.signMessage;
}

function createERC721ForEthOrder(maker, contract, tokenId, price, salt) {
  return {
    type: "RARIBLE_V1",
    maker: maker,
    make: {
      assetType: {
        assetClass: "ERC721",
        contract: contract,
        tokenId: tokenId,
      },
      value: "1",
    },
    take: {
      assetType: {
        assetClass: "ETH",
      },
      value: price,
    },
    data: {
      dataType: "RARIBLE_V2_DATA_V1",
      payouts: [],
      originFees: [],
    },
    salt,
  };
}

function createEthForERC721Order(maker, contract, tokenId, price, salt) {
  return {
    type: "RARIBLE_V2",
    maker: maker,
    take: {
      assetType: {
        assetClass: "ERC721",
        contract: contract,
        tokenId: tokenId,
      },
      value: "1",
    },
    make: {
      assetType: {
        assetClass: "ETH",
      },
      value: price,
    },
    data: {
      dataType: "RARIBLE_V2_DATA_V1",
      payouts: [],
      originFees: [],
    },
    salt,
  };
}
export const createSellOrder = async (type, provider, params) => {
  let order;
  let signature;
  const salt = random(1,1000)
  console.log('kkk1', {params});
  switch (type) {
    case "MAKE_ERC721_TAKE_ETH":
      order = createERC721ForEthOrder(
        params.accountAddress,
        params.makeERC721Address,
        params.makeERC721TokenId,
        params.ethAmt,
        salt
      );
      console.log('kkk2', { order });
      const preparedOrder = await prepareOrderMessage({...order, signature: '0x45461654b86e856686e7a2e9a9213b29f8dc32a731046e0c2f1aa01e4eaa991e41ebc67535fac14c333ad5b0d0d821ef518edc9ed08ad7efc0af572620c045ce1c'});
      console.log({preparedOrder})
      signature = await sign(provider, preparedOrder, params.accountAddress);

      break;

    default:
      break;
  }

  const raribleOrderResult = await fetch(createSellOrderEP, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...order,
      signature,
    }),
  });
  console.log({ raribleOrderResult });
};

export const matchSellOrder = async (sellOrder, params) => {
  const matchingOrder = createEthForERC721Order(
    params.accountAddress,
    sellOrder.make.assetType.contract,
    sellOrder.make.assetType.tokenId,
    sellOrder.take.value,
    params.salt || 0,
  );
  const preparedOrder = await prepareOrderMessage(matchingOrder);
  console.log({ preparedOrder });
  
  console.log({sellOrder})
  
  const preparedSellOrder = await prepareOrderMessage(createERC721ForEthOrder(
    sellOrder.maker,
    sellOrder.make.assetType.contract,
    sellOrder.make.assetType.tokenId,
    sellOrder.take.value,
    parseInt(Number(sellOrder.salt), 10)
  ))
  return {preparedOrder, preparedSellOrder};
};

export async function prepareMatchingOrder(sellOrder, accountAddress) {
  const rariblePrepareTxUrl = `${createSellOrderEP}/${sellOrder.hash}/prepareTx`
  const res = await fetch(rariblePrepareTxUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      maker: accountAddress,
      amount: 1,
      payouts: [],
      originFees: []
    }),
  });
  const resJson = await res.json();
  console.log({ resJson });
  return resJson;
}

export const matchOrder = async (provider, order) => {};
