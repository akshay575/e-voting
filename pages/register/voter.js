import React, { Component } from 'react';
import { Form, Button, Grid, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import { Router } from '../../routes';
import web3 from '../../ethereum/web3';
import Campaign from '../../ethereum/campaign';

class RegisterVoter extends Component {

    state = {
        fullName: '',
        uid: '',
        address: '',
        loading: false,
        errorMessage: ''
    }

    static async getInitialProps(props) {
        console.log(props.query.address);
        return { address: props.query.address}; 
    }

    onSubmit = async (event) => {
        event.preventDefault();

        try {
            this.setState({ loading: true, errorMessage: ''});

            const accounts = await web3.eth.getAccounts();
            const campaign = Campaign(this.props.address);
            await campaign.methods.registerVoter(
                this.state.uid,
                this.state.fullName,
                this.state.address
            ).send({ from: accounts[0] });
            
            Router.pushRoute(`/campaigns/${this.props.address}`);
        }
        catch(err) {
            this.setState({ errorMessage: err.message });
        } 
        this.setState({ loading: false });
    }

    render() {
        return (
            <Layout>
                <div style={{ justifyContent: 'center' }}>
                    <Grid centered>
                        <Grid.Column width={5}>
                            <h3>Voter Registration Form</h3>
                            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                                <Form.Field>
                                    <label>Full Name</label>
                                    <Input placeholder='Full Name' value={this.state.fullName} onChange={event => {this.setState({fullName: event.target.value})}} />
                                </Form.Field>
                                <Form.Field>
                                    <label>Unique Id</label>
                                    <input placeholder='Unique Id' value={this.state.uid} onChange={event => {this.setState({uid: event.target.value})}} />
                                </Form.Field>
                                <Form.Field>
                                    <label>Address</label>
                                    <input placeholder='Address' value={this.state.address} onChange={event => {this.setState({address: event.target.value})}} />
                                </Form.Field>
                                <Message error header="Oops!" content={this.state.errorMessage} />
                                <Form.Field style={{ textAlign: 'right' }}>
                                    <Button primary onClick={() => Router.back()}>Back</Button>
                                    <Button loading={this.state.loading} primary type='submit'>Register</Button>
                                </Form.Field>
                            </Form>
                        </Grid.Column>
                    </Grid>
                </div>
            </Layout>
        );
    }
}

export default RegisterVoter;