const cors = require('cors');
const Worker = require('../controller/worker');

module.exports = (app) => {
    app.use(cors());
    app.get('/worker', Worker.List)

}