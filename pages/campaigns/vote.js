import React, { Component } from 'react';
import { Form, Input, Button, Dropdown, Grid, Card, Image, List, Message } from 'semantic-ui-react';
import { Router } from '../../routes';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';

class Vote extends Component {
    state = {
        selectedVoter: '',
        selectedCandidate: '',
        loading: false,
        errorMessage: ''
    };

    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address);
        const voterIds = await campaign.methods.getVoterIds().call();
        const candidateIds = await campaign.methods.getCandidateIds().call();

        let voterList = [];
        voterIds.map((id, index) => {
            voterList.push({
                key: index,
                value: index,
                text: id
            });
        })

        let candidateList = [];
        candidateIds.map((id, index) => {
            candidateList.push({
                key: index,
                value: index,
                text: id
            });
        })

        return { address: props.query.address, voterList, candidateList };
    }

    onSelectVoter = async (event, data) => {
        event.preventDefault();
        console.log(data.value);
        const campaign = Campaign(this.props.address);
        const voter = await campaign.methods.voters(data.value).call();
        console.log(voter);

        this.setState({
            selectedVoter: voter
        });
    }

    onSelectCandidate = async (event, data) => {
        event.preventDefault();
        console.log(data.value);
        const campaign = Campaign(this.props.address);
        const candidate = await campaign.methods.candidates(data.value).call();
        console.log(candidate);

        this.setState({
            selectedCandidate: candidate
        });

        // console.log('gas left', await web3.eth.gasleft())
    }

    onSubmit = async (event) => {
        event.preventDefault();
        console.log('onSubmit');

        try {
            this.setState({ loading: true, errorMessage: ''});

            debugger;
            const campaign = Campaign(this.props.address);
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.pollVote(
                this.state.selectedVoter.uid, this.state.selectedCandidate.uid
            ).send( {
                from: accounts[0]
            })
            
            Router.back();
        }
        catch(err) {
            this.setState({ errorMessage: err.message });
        } 
        this.setState({ loading: false });
    }

    render() {
        return (
            <Layout>
                <Grid centered>
                    <Grid.Column width={5}>
                        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                            <Form.Field>
                                <label>Select Voter Id</label>
                                <Dropdown placeholder='Search Voter' search selection options={this.props.voterList} onChange={this.onSelectVoter} />
                            </Form.Field>
                            {
                                this.state.selectedVoter ? (
                                    <Form.Field>
                                        <Card fluid>
                                            <Card.Content>
                                                <Image floated='right' size='mini' src='/static/images/steve.jpg' />
                                                <Card.Header>{this.state.selectedVoter.fullName}</Card.Header>
                                                <Card.Meta>{this.state.selectedVoter.uid}</Card.Meta>
                                                <Card.Description>{this.state.selectedVoter.location}</Card.Description>
                                            </Card.Content>
                                            {/* <Card.Content extra style={{ justifyContent: 'center' }}>
                                                <Button primary>
                                                    Vote Now
                                                </Button>
                                            </Card.Content> */}
                                        </Card>
                                    </Form.Field>
                                ) : ''
                            }
                            <Form.Field>
                                <label>Select Candidate Id</label>
                                <Dropdown placeholder='Search Candidate' search selection options={this.props.candidateList} onChange={this.onSelectCandidate} />
                            </Form.Field>
                            {
                                this.state.selectedCandidate ? (
                                    <Form.Field>
                                        <Card fluid>
                                            <Card.Content>
                                                <Image floated='right' size='mini' src='/static/images/jenny.jpg' />
                                                <Card.Header>{this.state.selectedCandidate.fullName}</Card.Header>
                                                <Card.Meta>{this.state.selectedCandidate.uid}</Card.Meta>
                                                <Card.Description>{this.state.selectedCandidate.location}</Card.Description>
                                            </Card.Content>
                                            <Card.Content extra style={{ justifyContent: 'center' }}>
                                                <Button loading={this.state.loading} primary>
                                                    Vote Now
                                                </Button>
                                                <Message error header="Oops!" content={this.state.errorMessage} />
                                            </Card.Content>
                                        </Card>
                                    </Form.Field>
                                ) : ''
                            }

                        </Form>
                    </Grid.Column>
                    <Grid.Column width={5}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>Instructions</Card.Header>
                                <Card.Description>
                                    <List as='ol'>
                                        <List.Item as='li'>Enter/Select the VoterId</List.Item>
                                        <List.Item as='li'>Enter/Select the CandidateId</List.Item>
                                        <List.Item as='li'>Confirm the selected details</List.Item>
                                        <List.Item as='li'>Cast the vote</List.Item>
                                    </List>
                                </Card.Description>
                            </Card.Content>
                        </Card>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>Note</Card.Header>
                                <Card.Description>Once a vote is casted you can't change or cancel it, hence please be careful and select the desired option.</Card.Description>
                            </Card.Content>
                        </Card>
                        <Button style={{float: 'right'}} primary onClick={() => Router.back()}>Back</Button>
                    </Grid.Column>
                </Grid>
            </Layout>
        );
    }
}

export default Vote;