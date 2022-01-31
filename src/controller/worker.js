const Worker = require('../database/worker');
const cloudinary = require('cloudinary');
const fs 			= require('fs');
const path 			= require('path');

exports.List = async (req, res) => {
    const page= +req.params.page;
    const size = +req.params.size;
    const init= ((page+1)*size)-size 
    const data={
        init: init,
        size: size
    }
    const worker = await Worker.List(data);
    const WK= worker[0][0];
    const dataLength = worker[0][1][0];
    const dataResponse = {
        workers: WK,
        dataLength: dataLength
    }
    return res.json(dataResponse);
}


exports.Add = async (req, res) => {
    const data = {
        code:req.body.code,
        workerType:req.body.workerType,
        firstName:req.body.firstName,
        secondName:req.body.secondName,
        firstLastname:req.body.firstLastname,
        secondLastname:req.body.secondLastname,
        DNI:req.body.DNI,
        type:req.body.type,
        address:req.body.address,
        phone:req.body.phone,
        email:req.body.email,
        medical:req.body.medical,
        license:req.body.license,
        organization:req.body.organization,
        membership:req.body.membership,
        route:req.body.route,
        status:req.body.status,
        absences:req.body.absences,
        observations:req.body.observations,
        linkPhoto:req.body.linkPhoto,
        linkQR:req.body.linkQR,
        dateInit:req.body.dateInit,
        dateEnd:req.body.dateEnd,
    }
    let workerType =  'OPE' 
    if (data.workerType=="0") {  
        workerType='TAX'
        data.type=null;
    }else if (data.workerType=="1"){ 
        data.type=null;
        workerType= 'COL'
    }

    const code = await Worker.Last();
   
    const last = code[0][0].idWorker+1
    const lastOrder= last.toLocaleString('en', {minimumIntegerDigits:4,useGrouping:false}) 
    data.code= `${workerType}-${lastOrder}`
    const add= await Worker.Add(data);
    if (add.err) {
		console.log('Error in the database', add.err);
		return res.status(400).json({ statusCode: 400, message: 'Error in the database', error: add.err });
	}
    return res.status(200).json({ statusCode: 200, message: `data saved` , id:add[0].insertId });
}
exports.Update = async (req, res) => {
    const data = {
        idWorker:+req.params.id,
        code:req.body.code,
        workerType:req.body.workerType,
        firstName:req.body.firstName,
        secondName:req.body.secondName,
        firstLastname:req.body.firstLastname,
        secondLastname:req.body.secondLastname,
        DNI:req.body.DNI,
        type:req.body.type,
        address:req.body.address,
        phone:req.body.phone,
        email:req.body.email,
        medical:req.body.medical,
        license:req.body.license,
        organization:req.body.organization,
        membership:req.body.membership,
        route:req.body.route,
        status:req.body.status,
        absences:req.body.absences,
        observations:req.body.observations,
        linkQR:req.body.linkQR,
        dateInit:req.body.dateInit,
        dateEnd:req.body.dateEnd,
    }

    let workerType =  'OPE' 
    if (data.workerType=="0") {  
        workerType='TAX'
        data.type=null;
    }else if (data.workerType=="1"){ 
        data.type=null;
        workerType= 'COL'
    }
    
    const code= data.idWorker.toLocaleString('en', {minimumIntegerDigits:4,useGrouping:false}) 
    data.code=`${workerType}-${code}`;
    const update= await Worker.Update(data)
    if (update.err) {
		console.log('Error in the database', update.err);
		return res.status(400).json({ statusCode: 400, message: 'Error in the database', error: update.err });
	}
    return res.status(200).json({ statusCode: 200, message: `data updated` });
}

exports.Delete = async (req, res) =>{
    const id=req.params.id;
    console.log('id:', id);
    const deleted= await Worker.Delete(id);
    if (deleted.err){
		console.log('Error in the database delete deleted ' + deleted.err);
		return res.status(400).json({ statusCode: 400, message: 'Error in the database delete ' + deleted.err });
    }
    res.json('successful');
}

exports.fileAdd = (req, res) => {
    const id= req.params.id
    const files = req.files;
	const obj = JSON.parse(JSON.stringify(files));
  

    cloudinary.v2.uploader.upload(__basedir + '/resources/static/assets/uploads/' + obj.myFile[0].originalname,  { 
        folder: "INVITRACV",
        public_id: `file-worker-${id}`,
        overwrite: true, 
    },
    async function(error, result) {
        const data= {
            link: result.secure_url,
            id: id
        }
        const updated= await Worker.AddPhotoLink(data) 
        const response = {
            result: result,
        }
        if (updated.err || error){
            console.log('Error in the database addlink ' + updated.err);
            return res.status(400).json({ statusCode: 400, message: 'Error in the database addlink ' + updated.err });
        }
        fs.unlink(path.join(__basedir + '/resources/static/assets/uploads/', obj.myFile[0].originalname), (err) => {
			if (err) throw err;
		});
        return res.json(response);
    });


}

