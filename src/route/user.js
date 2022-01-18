const expressJWT	= require('express-jwt');
const User 			= require('../controller/user');
const cors 			= require('cors');

module.exports = (app) => {
    app.use(cors());
    let secret = 'some_secret';
    //app.use(expressJWT({ secret: secret, algorithms: ['HS256'] }).unless({ path: ['/api/login'] }));

    app.get('/users', User.List);



}