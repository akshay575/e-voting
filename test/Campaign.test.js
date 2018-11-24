const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    console.log('in before each');
    // get the accounts
    accounts = await web3.eth.getAccounts(); 
    
    // create and deploy campaign factory
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '3000000' });

    // create a new campaign
    await factory.methods.createCampaign('TestCampaign').send({
        from: accounts[0],
        gas: '3000000'
    });

    // get the created campaign address
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

    // get access to the created campaign
    campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
});

describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert(factory.options.address);
        assert(campaign.options.address);
    });

    it('marks caller as the manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert(manager, accounts[0]);
    })

    it('allows voters to register', async () => {
        await campaign.methods.registerVoter(1234567890, 'Narendra Modi', 'India')
            .send({ from: accounts[0], gas: '1000000' });

        const voter = await campaign.methods.voters(0).call();
        assert(voter.uid, 1234567890);
    })

    it('allows candidate to register', async () => {
        await campaign.methods.registerCandidate(1234567890, 'Akshay Kumar', 'India')
            .send({ from: accounts[0], gas: '1000000'});

        const candidate = await campaign.methods.candidates(0).call();
        assert(candidate.uid, 1234567890);
    })

    it('allows voter to poll vote', async () => {
        await campaign.methods.registerCandidate(1234567899, 'Akshay Kumar', 'India')
            .send({ from: accounts[0], gas: '1000000'});

        await campaign.methods.registerVoter(1234567890, 'Narendra Modi', 'India')
            .send({ from: accounts[0], gas: '1000000' });

        await campaign.methods.pollVote(1234567890, 1234567899)
            .send({ from: accounts[0], gas: '1000000' });
        const votes = await campaign.methods.totalVotes().call();
        assert(votes > 0);
    })

    it('allows manager to declare result', async () => {
        await campaign.methods.registerCandidate(1234567899, 'Akshay Kumar', 'India')
            .send({ from: accounts[0], gas: '1000000'});

        await campaign.methods.registerVoter(1234567890, 'Narendra Modi', 'India')
            .send({ from: accounts[0], gas: '1000000' });
            
        await campaign.methods.pollVote(1234567890, 1234567899)
            .send({ from: accounts[0], gas: '1000000' });

        await campaign.methods.declareResult()
            .send({ from: accounts[0], gas: '1000000' });

        const winner = await campaign.methods.winner().call();
        assert(winner, 1234567899);
    })

    it('gets summary of result', async () => {
        await campaign.methods.registerVoter(1234567890, 'Narendra Modi', 'India')
            .send({ from: accounts[0], gas: '1000000'});

        await campaign.methods.registerCandidate(1234567899, 'Akshay Kumar', 'India')
            .send({ from: accounts[0], gas: '1000000' });
            
        await campaign.methods.pollVote(1234567890, 1234567899)
            .send({ from: accounts[0], gas: '1000000' });

        await campaign.methods.declareResult()
            .send({ from: accounts[0], gas: '1000000' });

        const summary = await campaign.methods.getResult().call();
        assert(summary);
    })
})