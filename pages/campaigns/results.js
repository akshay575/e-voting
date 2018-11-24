import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import { Router } from '../../routes';

class CampaignResult extends Component {
    static async getInitialProps(props) {
        // get the campaign unique address
        const campaign = Campaign(props.query.address);
        // get the candidate count
        const candidatesCount = await campaign.methods.getCandidatesCount().call();

        let candidates = [];
        if (candidatesCount > 0) {
            // get all registered candidate details
            console.log('count', candidatesCount);
            candidates = await Promise.all(
                Array(parseInt(candidatesCount))
                    .fill()
                    .map((element, index) => {
                        console.log('index', index);
                        return campaign.methods.candidates(index).call();
                    })
            );
        }

        console.log(candidates);

        const isComplete = await campaign.methods.complete().call();

        // if campaign is closed, get the result summary
        if(isComplete) {
            const summary = await campaign.methods.getResult().call();
            const winnerIndex = await campaign.methods.candidateIndex(summary[2]).call();
            const winner = await campaign.methods.candidates(parseInt(winnerIndex)).call();
            console.log('winner', winner, winnerIndex, typeof winnerIndex);
            console.log('summary', summary);
        }

        return { 
            candidates, 
            candidatesCount,
            votesPolled: typeof (summary) !== 'undefined' ? summary[0] : '-',
            votesReceived: typeof (summary) !== 'undefined' ? summary[1] : '-',
            winnerUid: typeof (summary) !== 'undefined' ? summary[2] : '-',
            winnerName: typeof winner !== 'undefined' ? winner.fullName : '-'
         };
    }

    renderRows() {
        const { Row, Cell } = Table;
        // let candidates = this.props.candidates.sort(this.sortVotes);
        console.log(this.props.candidatesCount, this.props.candidates);
        return this.props.candidates.map((voter, index) => {
            return (
                <Row key={index}>
                    <Cell>{index + 1}</Cell>
                    <Cell>{voter.uid}</Cell>
                    <Cell>{voter.fullName}</Cell>
                    <Cell>{voter.location}</Cell>
                    <Cell>{voter.votes}</Cell>
                </Row>
            );
        })
    }

    renderResultRows() {
        const { Row, Cell } = Table;
        const { votesPolled, votesReceived, winnerUid, winnerName } = this.props;
        // let candidates = this.props.candidates.sort(this.sortVotes);
        // console.log(candidates);
            return (
                <Row>
                    <Cell>{winnerUid}</Cell>
                    <Cell>{winnerName}</Cell>
                    <Cell>{votesReceived}</Cell>
                    <Cell>{votesPolled}</Cell>
                    {/* <Cell>{votesReceived*100/votesPolled}%</Cell> */}
                </Row>
            );
    }

    sortVotes(a, b) {
        if (a.votes < b.votes) {
            return -1;
        }
        else {
            return 1;
        }
        return 0;
    }

    render() {
        const { Header, Row, HeaderCell, Body } = Table;
        return (
            <Layout>
                <h3>Result Summary:</h3>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>Unique Id</HeaderCell>
                            <HeaderCell>Full Name</HeaderCell>
                            <HeaderCell>Total Votes Received</HeaderCell>
                            <HeaderCell>Total Votes Polled</HeaderCell>
                            {/* <HeaderCell>Percentage</HeaderCell> */}
                        </Row>
                    </Header>
                    <Body>
                        {this.renderResultRows()}
                    </Body>
                </Table>
                <h3>Detailed Votes Summary By Candidate:</h3>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>Id</HeaderCell>
                            <HeaderCell>Unique Id</HeaderCell>
                            <HeaderCell>Full Name</HeaderCell>
                            <HeaderCell>Address</HeaderCell>
                            <HeaderCell>Votes</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.renderRows()}
                    </Body>
                </Table>
                <div>
                    Found {this.props.candidatesCount} candidates.
                    <Button style={{float: 'right'}} primary onClick={() => Router.back()}>Back</Button>
                </div>
                
            </Layout>
        );
    }
}

export default CampaignResult;