const routes = require('next-routes')();

routes
    .add('/campaigns/new', '/campaigns/new')
    .add('/campaigns/:address', '/campaigns/show')
    .add('/campaigns/:address/results', '/campaigns/results')
    .add('/campaigns/:address/register/voter', '/register/voter')
    .add('/campaigns/:address/register/candidate', '/register/candidate')
    .add('/campaigns/:address/details/voter', '/details/voter')
    .add('/campaigns/:address/details/candidate', '/details/candidate')
    .add('/campaigns/:address/vote', '/campaigns/vote');

module.exports = routes;