const expressJWT	= require('express-jwt');
const User 			= require('../controller/user');
const cors 			= require('cors');
const multer 		= require('multer');

let storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, __basedir + '/resources/static/assets/uploads');
	},
	filename: function (req, file, cb) {
		cb(null, `${file.originalname}`);
	},
});

let upload = multer({ storage: storage });


module.exports = (app) => {
    app.use(cors());
    let secret = 'some_secret';
    //app.use(expressJWT({ secret: secret, algorithms: ['HS256'] }).unless({ path: ['/api/login'] }));

    app.get('/users', User.List);




    app.put(
		'/PhotoTest',
		upload.fields([{ name: 'myFile', maxCount: 1 }]),
		(req, res, next) => {
			const files = req.files;
            console.log('Filessss', files);
			
            if (!files) {
				const error = new Error('Please upload a files');
				error.httpStatusCode = 400;
				return next(error);
			}
			return next();
		},
		User.fileAdd
		
	);


}