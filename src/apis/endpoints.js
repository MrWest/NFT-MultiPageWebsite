
const domain = 'https://api-dev.rarible.com/protocol/v0.1/ethereum/';

const encodeOrderEP = `${domain}order/encoder/order`;
const createSellOrderEP = `${domain}order/orders`;
const getNFTItemsEP = `${domain}nft/items`;
const getNFTCollectionsEP = `${domain}nft/collections`;
const getNFTMintsEP = `${domain}nft/mints`;
const getSellOrdersByItemEP = (collectionContract, tokenId) => `${domain}order/orders/sell/byItem?contract=${collectionContract}&tokenId=${tokenId}&sort=LAST_UPDATE`;
const getSellOrderByCollectionEP =  collectionContract => `${domain}order/orders/sell/byCollection?collection=${collectionContract}&sort=LAST_UPDATE`;
export { encodeOrderEP, createSellOrderEP, getNFTItemsEP, getNFTCollectionsEP,
     getNFTMintsEP, getSellOrdersByItemEP, getSellOrderByCollectionEP};
