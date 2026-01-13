const { authenticate, authorize } = require('./auth.middleware');
const validate = require('./validate.middleware');

module.exports = {
    authenticate,
    authorize,
    validate,
};
