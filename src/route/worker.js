const cors = require('cors');
const Worker = require('../controller/worker');
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
    app.get('/worker', Worker.List)

    app.put(
		'/PhotoTest',
		upload.fields([{ name: 'myFile', maxCount: 1 }]),
		(req, res, next) => {
			const files = req.files;
            console.log('Files', files);s
            if (!files) {
				const error = new Error('Please upload a files');
				error.httpStatusCode = 400;
				return next(error);
			}
			return next();
		},
		Worker.fileAdd
		
	);

}