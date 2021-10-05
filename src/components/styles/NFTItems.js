export default () => ({
nftImage: {
    objectFit: 'contain',
    width: '100%',
    maxHeight: 285
},
nftName: { 
    fontSize: 14,
    textAlign: 'center',
},
nftContainer: {
    '& > div': {
        width: '100%'
    }
},
tab: {
    padding: '4px 18px',
    minWidth: 'auto',
    outline: 'none !important'
}
});