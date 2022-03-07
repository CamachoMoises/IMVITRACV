const cors = require('cors');
const Worker = require('../controller/worker');
const multer = require('multer');

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
    app.get('/worker/list/:page/:size/:filter', Worker.List);
    app.post('/worker/newWorker', Worker.Add);
	app.delete('/worker/delete/:id', Worker.Delete);
	app.put('/worker/Update/:id', Worker.Update);
	app.get('/worker/dashboard', Worker.Dashboard);
	app.put(
		'/worker/photo/:id',
		upload.fields([{ name: 'myFile', maxCount: 1 }]),
		(req, res, next) => {
			const files = req.files;
    
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