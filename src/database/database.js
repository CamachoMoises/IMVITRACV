const mysql = require('mysql2');

var connection = mysql.createPool({
	database: 'dbimvitracv',
	user: '88gprkwh5969',
	host: '2y2w1cve4pwx.us-east-3.psdb.cloud',
	password: 'pscale_pw_PVRLnJ6NFXfRadF_0KQ88emAME6MXi4ovvpPfyI95JI',
	ssl: {
		rejectUnauthorized: false,
	},
	/**
    host: 'bgoescmoyuocwga4lecd-mysql.services.clever-cloud.com',
    port: '3306',
    user: 'uy0mqaudoaohlgll',
    password:'9wED4qXlLDQZ3NWMwgKZ',
    database: 'bgoescmoyuocwga4lecd'
      
     */
});

module.exports = connection.promise();