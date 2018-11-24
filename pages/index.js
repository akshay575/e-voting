import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';
import Campaign from '../ethereum/campaign';

class CampaignIndex extends Component {
    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();

        let campaignNames = [];
        if(campaigns.length > 0) {
            campaignNames = await Promise.all(
                Array(campaigns.length)
                    .fill()
                    .map((element, index) => {
                        const campaign = Campaign(campaigns[index]);
                        return campaign.methods.name().call();
                    })
            )
        }

        return { campaigns, campaignNames };
    }

    renderCampaigns() {
        const items = this.props.campaigns.map((address, index) => {
            return  {
                header: this.props.campaignNames[index],
                meta: address,
                description: (
                    <Link route={`/campaigns/${address}`}>
                        <a>View Campaign</a>
                    </Link>
                ),
                fluid: true
            };
        });

        return <Card.Group items={items} />;
    }

    render() {
        return (
            <Layout>
                <h3>Campaigns</h3>
                <Link route="/campaigns/new">
                    <a>
                        <Button 
                            floated="right"
                            content="Create Campaign"
                            icon="add"
                            primary
                        />
                    </a>
                </Link>
                {this.renderCampaigns()}
            </Layout>
        );
    }
}

export default CampaignIndex;