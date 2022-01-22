const Worker = require('../database/worker');

exports.List = async (req, res) => {
    const worker = await Worker.List();
    const WK= worker[0][0];
    return res.json(WK);
}

