const Organization 			= require('../controller/organization');
const cors 			= require('cors');


module.exports = (app) => {
    app.use(cors());
    app.get('/organizations', Organization.List)

}