import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import { Router } from '../../routes';

class VoterDetails extends Component {
    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address);
        const votersCount = await campaign.methods.getVotersCount().call();

        let voters = [];
        if(votersCount > 0) {
            voters = await Promise.all(
                Array(parseInt(votersCount))
                    .fill()
                    .map((element, index) => {
                        return campaign.methods.voters(index).call();
                    })
            );
        }

        return { voters, votersCount };
    }

    renderRows() {
        const { Row, Cell } = Table;
        return this.props.voters.map((voter, index) => {
            return (
                <Row key={index}>
                    <Cell>{index + 1}</Cell>
                    <Cell>{voter.uid}</Cell>
                    <Cell>{voter.fullName}</Cell>
                    <Cell>{voter.location}</Cell>
                    <Cell>{voter.voted ? 'Yes' : 'No'}</Cell>
                </Row>
            );
        })
    }
    
    render() {
        const { Header, Row, HeaderCell, Body } = Table;
        return (
            <Layout>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>Id</HeaderCell>
                            <HeaderCell>Unique Id</HeaderCell>
                            <HeaderCell>Full Name</HeaderCell>
                            <HeaderCell>Address</HeaderCell>
                            <HeaderCell>Voted</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.renderRows()}
                    </Body>
                </Table>
                <div>
                    Found {this.props.votersCount} voters.
                    <Button style={{float: 'right'}} primary onClick={() => Router.back()}>Back</Button>
                </div>
            </Layout>
        );
    }
}

export default VoterDetails;