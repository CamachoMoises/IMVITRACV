const mysql         = require('mysql2');

var connection = mysql.createPool({
    host: 'bgoescmoyuocwga4lecd-mysql.services.clever-cloud.com',
    port: '3306',
    user: 'uy0mqaudoaohlgll',
    password:'9wED4qXlLDQZ3NWMwgKZ',
    database: 'bgoescmoyuocwga4lecd'
});

module.exports = connection.promise();