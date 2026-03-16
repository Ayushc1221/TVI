const { authenticate, authenticateClient, authorize } = require('./auth.middleware');
const validate = require('./validate.middleware');

module.exports = {
    authenticate,
    authenticateClient,
    authorize,
    validate,
};
