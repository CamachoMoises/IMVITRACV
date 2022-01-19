const Worker = require('../database/worker');

exports.List = async (req, res) => {
    const worker = await Worker.List();
    const WK= worker[0][0]
    console.log('List employees', WK);
    res.json(WK);
} 
