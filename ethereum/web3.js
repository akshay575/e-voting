import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    // we are in the browser and metamask is running
    web3 = new Web3(window.web3.currentProvider);
}
else {
    // we are on the server or the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/b89837cd35fe4b55ab7cbd9ee0e1f432'
    );
    web3 = new Web3(provider);
}

export default web3;