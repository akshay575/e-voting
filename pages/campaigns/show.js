import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import { Link, Router } from '../../routes';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';

class CampaignShow extends Component {
    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address);
        const manager = await campaign.methods.manager().call();
        const summary = await campaign.methods.getSummary().call();
        const complete = await campaign.methods.complete().call();

        console.log(summary, props.query.address);

        return { 
            address: props.query.address,
            complete,
            manager,
            totalVoters: summary[0],
            totalCandidates: summary[1],
            totalVotes: summary[2]
        };
    }

    onResult = async(event) => {
        event.preventDefault();
        console.log('val', event.target.value);
        if(event.target.value === 'Declare Result') {
            const accounts = await web3.eth.getAccounts();
            const campaign = Campaign(this.props.address);
            await campaign.methods.declareResult()
                .send({ from: accounts[0]});
        }
        Router.pushRoute(`/campaigns/${this.props.address}/results`);
    }

    renderCards() {
        const { manager, totalVoters, totalCandidates, totalVotes } = this.props;

        const items = [
            {
                header: manager,
                meta: 'Election Manager Address',
                description: 'Address of the election manager who manages the complete process.',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: totalCandidates,
                meta: (
                    <Link route={`/campaigns/${this.props.address}/details/candidate`}>
                        <a>Registered Candidates</a>
                    </Link>
                ),
                description: 'Total number of candidates registered for the campaign.'
            },
            {
                header: totalVoters,
                meta: (
                    <Link route={`/campaigns/${this.props.address}/details/voter`}>
                        <a>Registered Voters</a>
                    </Link>
                ),
                description: 'Total number of voters registered to vote.'
            },
            {
                header: totalVotes,
                meta: 'Total Votes Polled',
                description: 'Total number of votes polled.'
            }
        ]

        return <Card.Group items={items} />;
    }

    render() {
        console.log(this.props.address);
        return (
            <Layout>
                <h3>Campaign Show</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}
                            {this.props.complete ? '' : (
                                <Link route={`/campaigns/${this.props.address}/vote`}>
                                    <a>
                                        <Button primary style={{ marginTop: '20px' }}>Vote Now</Button>
                                    </a>
                                </Link>
                            )}
                            <Button primary onClick={event => this.onResult(event)} style={{ marginTop: '20px' }} value={this.props.complete ? 'View Results' : 'Declare Result'}>{this.props.complete ? 'View Results' : 'Declare Result'}</Button>
                        </Grid.Column>
                        <Grid.Column width={6}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>Registration</Card.Header>
                                <Card.Description>
                                    You can register a new <strong>voter</strong> or a <strong>candidate</strong> here.
                                </Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                                <div className='ui two buttons' style={{ justifyContent: 'center' }}>
                                    <Link route={`/campaigns/${this.props.address}/register/voter`}>
                                        <a>
                                            <Button basic color='green' style={{ marginRight: '5px' }}>
                                                Register Voter
                                            </Button>
                                        </a>
                                    </Link>
                                    <Link route={`/campaigns/${this.props.address}/register/candidate`}>
                                        <a>
                                            <Button basic color='red'>
                                                Register Candidate
                                            </Button>
                                        </a>
                                    </Link>
                                </div>
                            </Card.Content>
                        </Card>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export default CampaignShow;