import web3 from './web3';
import campaignFactory from './build/CampaignFactory.json';

// const address = '0x0dcb8E8BbeF65aE548F06bb37c9e94cEaF836d60';
const address = '0x6DA1A1D2A68c34B07EC432c528dc063e299c776e';
// const address = '0x29e2f41270fC154E4Cc334276EF5e10862d51256';
// const address = '0xA34bD3cc52A954e3225635FcF6ae6f6dB6C1565E';

const instance = new web3.eth.Contract(
    JSON.parse(campaignFactory.interface),
    address
);

export default instance;