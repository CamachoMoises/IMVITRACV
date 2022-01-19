const Organization = require('../database/organization');


exports.List = async (req, res) => {
    const organization = await Organization.List();
    const OR= organization[0][0]
    console.log('List employees', OR);
    res.json(OR);
} 