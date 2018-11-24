import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import { Router } from '../../routes';

class CandidateDetails extends Component {
    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address);
        const candidatesCount = await campaign.methods.getCandidatesCount().call();

        let candidates = [];
        if (candidatesCount > 0) {
            candidates = await Promise.all(
                Array(parseInt(candidatesCount))
                    .fill()
                    .map((element, index) => {
                        return campaign.methods.candidates(index).call();
                    })
            );
        }

        return { candidates, candidatesCount };
    }

    renderRows() {
        const { Row, Cell } = Table;
        return this.props.candidates.map((voter, index) => {
            return (
                <Row>
                    <Cell>{index + 1}</Cell>
                    <Cell>{voter.uid}</Cell>
                    <Cell>{voter.fullName}</Cell>
                    <Cell>{voter.location}</Cell>
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
                        </Row>
                    </Header>
                    <Body>
                        {this.renderRows()}
                    </Body>
                </Table>
                <div>
                    Found {this.props.candidatesCount} candidates.
                    <Button style={{ float: 'right' }} primary onClick={() => Router.back()}>Back</Button>
                </div>
            </Layout>
        );
    }
}

export default CandidateDetails;