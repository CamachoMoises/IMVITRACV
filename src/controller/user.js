const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const User = require('../database/user');

exports.List = async (req, res) => {
	const users = await User.List();
	const US = users[0][0];
	res.json(US);
};
exports.Authenticate = async (req, res, next) => {
	const password = req.body.password;
	let secret = 'some_secret';
	const data = {
		user: req.body.username.toLowerCase(),
		pwd: req.body.password,
	};
	const userVerified = await User.findEmail(req.body.username);
	if (userVerified.err) {
		console.log('Error in the database', userVerified.err);
		return res.status(400).json({ statusCode: 400, message: 'Error in the database' });
	}
	const person = userVerified[0];
	if (person.length < 1) {
		return res.status(400).json({ statusCode: 400, message: 'User not exist', error: 'User not exist' });
	}
	if (person[0].status === 0) {
		return res.status(400).json({ statusCode: 400, message: 'User inactive', error: 'User inactive' });
	}

	const results = await User.Authenticate(data);
	if (results.err) {
		console.log('Error in the database');
		return res.status(400).json({ statusCode: 400, message: 'Error in the database' });
	}
	const user = results[0][0];
	const storedPassword = user.password;
	const userData = {
		userName: user.userName,
		id: user.idUser,
	};
    const isEqual = await bcrypt.compare(password, storedPassword);
	if (!isEqual) {
		console.log(`the password does not match the User: ${data.user}`);
		return res.status(400).json({ statusCode: 400, message: `the password does not match the User: ${data.user}` });
	}
	const token = jwt.sign(userData, secret, { expiresIn: '50m' });
	const userF = {
		userName: user.userName,
		id: user.idUser,
		password: user.password,
		token: token,
		status: user.status,
	};
	return res.json(userF);
};


exports.addNewData = async ()=>{
	console.log('addNewData called');

	Data.forEach( async(newData)=>{
		console.log('Data', typeof newData);
		// const added = await User.addNewData(newData);
	})
}

exports.encrypt = async () => {
    console.log('verify encrypt');
	const Encrypt = async (password) => {
		return await bcrypt.hash(password, saltRounds);
	};
    const UnEncrypt = await User.UnEncrypt();
	if (UnEncrypt.err) {
		console.log('Error in the database', UnEncrypt.err);
	}
    const users= UnEncrypt
    users.forEach(async (user) => {
        console.log('user', user)
         if (user.encryption !==1) {
             const encryptedPassword = await Encrypt(user.password);
             console.log('contraseña', encryptedPassword, user.idUser);
	 		const data = {
	 			idUser: user.idUser,
	 			password: encryptedPassword,
	 		};
             await User.Encrypt(data);
             console.log('Contraseñas aseguradas');
         }
     })

}



const users = ["INSERT INTO users (`idUser`, `userName`, `password`, `encryption`, `status`) VALUES ('1', 'moisescamacho26@gmail.com', '$2a$10$r4B8gGMNjmY3SsteQHWs.esIQs.Gh0U5iaifcsBli7kcY9Pu/21hy', '1', '1');", "INSERT INTO users (`idUser`, `userName`, `password`, `encryption`, `status`) VALUES ('2', 'admin@test.com', 'test2', '1', '1');", "INSERT INTO users (`idUser`, `userName`, `password`, `encryption`, `status`) VALUES ('3', 'test@test.com', '$2a$10$KCwHz9WB7ISIeFbgNgDvWuq0OywHxM1oi5bcrvFZPeUNi8PilGFQW', '1', '1');"];

const Data = [
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `address`, `phone`, `email`, `license`, `organization`, `status`, `absences`, `observations`, `linkPhoto`, `dateEnd`) VALUES ('3', '3', '4', 'MAIRA', 'ALEJANDRA', 'LANDAETA', 'MARTINEZ', '16507354', '', '0', '', '1', 'COORDINADORA DE TALENTO HUMANO', '1', '0', '', 'https://res.cloudinary.com/moisesinc/image/upload/v1648322046/INVITRACV/file-worker-3.jpg', '2021-12-05');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('4', '4', '4', 'Pendiente', 'Pendiente', 'Pendiente', 'Pendiente', '0', '0', '1', 'Pendiente', '1', '0', '24/03/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('5', '5', '4', 'JULIO', '', 'MARTINEZ', '', '11641219', '4141071161', 'Ounidesbe@Gmail.Com', '1', 'Jefe De Fiscalizacion ', '1', '0', '21/03/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `firstLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('6', '6', '4', 'Jonathan', 'Coronado', '15267663', '04241055352', 'jcoronadoramos@gmail.com', '1', 'Fiscal', '1', '0', '25/03/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('7', '7', '4', 'Jose', 'Rafael', 'Alvarez', 'Marcano', '14567631', '04129206982', 'JOSERAFAELALVAREZ1978@GMAIL.COM', '1', 'Fiscal', '1', '0', '26/03/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `firstLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('8', '8', '4', 'Cinthya', 'Hernandez', '17964445', '04120156360', 'sianhernandez2020@gmail.com', '1', 'Fiscal', '1', '0', '27/03/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('9', '9', '4', 'Hamdler', 'Jose', 'Navas', 'Fumero', '18930103', '04128202629', '1', 'Fiscal', '1', '0', '28/03/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('10', '10', '4', 'Jose', 'Gregorio', ' Alcocer', 'Carrion', '17922070', '04129201294', '1', 'Fiscal', '1', '0', '29/03/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('11', '11', '4', 'Marvin', 'Eduardo', 'Brizuela', 'Mayora', '26763025', '04241558891', '1', 'Fiscal', '1', '0', '30/03/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('12', '12', '4', 'Enrique', 'Jose', 'Godoy', 'Artigas', '10580620', '04120317043', 'enriquegodoy2014@gmail.com', '1', 'Fiscal', '1', '0', '31/03/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('13', '13', '4', 'Yaneth', 'Yasnilka', 'Garcia ', 'Gonzalez', '6491693', '04127063732', 'yasmilka1965@hotmail.com', '1', 'Fiscal', '1', '0', '01/04/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('14', '14', '4', 'Luis', 'Antonio', 'Leal', 'Gonzalez', '6264305', '04126016961', 'luisleal04@GMAIL.COM', '1', 'Fiscal', '1', '0', '02/04/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('15', '15', '4', 'Franklin', 'Daniel', 'Quiñones', 'Rivero', '19272378', '04129204965', '1', 'Fiscal', '1', '0', '03/04/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('16', '16', '4', 'Samir', 'Eloim', 'Gonzalez', 'York', '26223497', '04122153281', '1', 'Fiscal', '1', '0', '04/04/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('17', '17', '4', 'Jimmy', 'Alexis', 'Bello', 'Briceño', '16724507', '04241821965', '1', 'Fiscal', '1', '0', '05/04/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('18', '18', '4', 'Daniel', 'Jose', 'Ramos', 'Angulo', '11564892', '04165301815', '1', 'Fiscal', '1', '0', '06/04/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('19', '19', '4', 'Pablo', 'Jose', 'Ordaz', '6214443', '04242512540', 'pabloordas@gmail.com', '1', 'Fiscal', '1', '0', '07/04/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('20', '20', '4', 'Julio', 'Cesar', 'Martinez ', 'Valero', '24802856', '04143973379', 'julioduarte1201@gmail.com', '1', 'Fiscal', '1', '0', '08/04/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `firstLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('21', '21', '4', 'Maryeling', 'Hernandez', '12459211', '04129006190', 'ayi2907@gmail.com', '1', 'Coordinadora De Planificacion', '1', '0', '09/04/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('22', '22', '4', 'Pendiente', 'Pendiente', 'Pendiente', 'Pendiente', '0', '0', '1', 'Pendiente', '1', '0', '10/04/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `absences`, `linkPhoto`, `dateEnd`) VALUES ('23', '23', '4', 'Odaliz ', 'Guirado', 'Beltran', '17960146', '04126346413', 'ODALIZBRANGEGUIRADO@GMAIL.COM', '1', 'Asistente De Presidencia', '1', '0', 'https://res.cloudinary.com/moisesinc/image/upload/v1648267278/INVITRACV/file-worker-23.jpg', '11/04/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('24', '24', '4', 'Yecsimar', 'Alexandra', 'Guaiquirian ', '24180978', '04241291126', 'MARPEDRON21@GMAIL.COM', '1', 'Periodista', '1', '0', '12/04/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('25', '25', '4', 'Rafael', 'Antonio', 'Rodriguez', '6480459', '04127752244', 'rafaelantonio60@gmail.com', '1', 'Operador De Camion', '1', '0', '13/04/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('26', '26', '4', 'Belkys', 'Ortencia', 'Rodriguez', 'Barrio', '9996313', '04241427739', '1', 'Fiscal', '1', '0', '14/04/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('27', '27', '4', 'Maryela', 'Del Valle', 'Castro', 'Ball', '11307117', '0', 'maryeelaball@gmail.com', '1', 'Coordinadora De Bienes Municipales', '1', '0', '15/04/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('28', '28', '4', 'Carlos', 'Wladimir', 'Diaz', 'Gutierrez', '20588003', '04129203255', 'wdiazcarlos@gmail.com', '1', 'Fiscal', '1', '0', '16/04/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `linkPhoto`, `dateEnd`) VALUES ('29', '29', '4', 'LADY', '', 'DEVOEE', '12166317', '04142611276', 'ladydevoee17@gmail.com', '1', 'ASISTENTE ADMINISTRATIVO', '1', 'https://res.cloudinary.com/moisesinc/image/upload/v1648318460/INVITRACV/file-worker-116.jpg', '2021-12-04');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `status`, `absences`, `dateEnd`) VALUES ('30', '30', '4', 'Rafael', 'Maria ', 'Canelon', 'Canelon', '6467977', '04142549167', '1', '1', '0', '18/04/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('31', '31', '4', 'Aracelis ', 'Jaspe', 'Izaguirre', '16725285', '04241897103', 'aracelisjaspe810@gmail.com', '1', 'Asistente Administrativo', '1', '0', '19/04/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('32', '32', '4', 'Luis', 'Emilio', 'Farias', 'Meza', '8369015', '04123767869', '1', 'Operador De Transporte', '1', '0', '20/04/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('33', '33', '4', 'Abel', 'Jose', 'Mavarez', 'Villaseñor', '14087641', '04126265916', '1', 'Operador De Transporte', '1', '0', '21/04/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('34', '34', '4', 'Pedro', 'Antonio ', 'Caracciolo', 'Albarran', '6494653', '04142814110', '1', 'Operador De Transporte', '1', '0', '22/04/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('35', '35', '4', 'Jose', 'Leobaldo', 'Echarry', 'Echarry', '9999376', '04266390934', 'ACHJ1973@GMAIL.COM', '1', 'Operador De Transporte', '1', '0', '23/04/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('36', '36', '4', 'Ronald ', 'Lopez', 'Padron', '12459067', '04167830717', '1', 'Operador De Transporte', '1', '0', '24/04/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('37', '37', '4', 'Xiomara', 'Del Valle', 'Palacios', 'Farias', '9998622', '04129402942', 'PALACIOSXIOMARA7@GMAIL.COM', '1', 'Aseadora', '1', '0', '25/04/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('38', '38', '4', 'Yendys', 'Alida', 'Ferrer', 'Rodriguez', '17079143', '04161455088', 'YENDYSFERRER@GMAIL.COM', '1', 'Aseadora', '1', '0', '26/04/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `DNI`, `phone`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('39', '39', '4', 'Cecilio', 'Rodolfo', 'Castellano ', '7995725', '04143656140', '1', 'Ayud. De Serv. Generales', '1', '0', '27/04/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('40', '40', '4', 'Neisi', 'Yesenia', 'Puppo', 'Matos', '10581148', '04242174812', 'NEISIPUPPO@GMAIL.COM', '1', 'Secretaria Ejecutiva Ii', '1', '0', '28/04/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('41', '41', '4', 'Armando', 'Jose', 'Gonzalez', 'Castillo', '11636319', '04241502392', '1', 'Ayud. De Serv. Generales', '1', '0', '29/04/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('42', '42', '4', 'Starlin', 'Jose', 'Arias', 'Perez', '16308064', '04244345559', '1', 'Ayud. De Serv. Generales', '1', '0', '30/04/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `firstLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('43', '43', '4', 'Wilman ', 'Monasterios', '17462414', '04241321291', 'wilmanmonasterios@gmail.com', '1', 'Ayudante De Servicios Generales', '1', '0', '01/05/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('44', '44', '4', 'Ulises', 'Ismael', 'Merlo', 'Montilla', '10580476', '04168248208', '1', 'Chofer', '1', '0', '02/05/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('45', '45', '4', 'Felipe', 'Eduardo', 'Moreno', 'Ortiz', '13672656', '0', '1', 'Ayudante De Servicios Generales', '1', '0', '03/05/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('46', '46', '4', 'Ebi ', 'Wendy', 'Bello', 'Mayora', '20560979', '4261189384', 'ebi_wendy@hotmail.com', '1', 'Asistente Administrativo', '1', '0', '04/05/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('47', '47', '4', 'Yovanni', 'Jose', 'Ayala', 'Colina', '20894751', '04143435013', 'AYALAYOVA21@Gmail.com', '1', 'Seguridad', '1', '0', '05/05/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('48', '48', '4', 'Juan', 'Carlos', 'Gonzalez', 'Martinez', '13827008', '04165182359', '1', 'Seguridad', '1', '0', '06/05/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `status`, `absences`, `dateEnd`) VALUES ('49', '49', '4', 'Iddar', 'Manuel', 'Jaimes', 'Vivas', '8176829', '04122247509', '1', '1', '0', '07/05/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('50', '50', '4', 'Bivian Jose', 'Jose', 'Garcia', 'Espinoza', '14073888', '04160137115', '1', 'Ayud. De Serv. Generales', '1', '0', '08/05/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('51', '51', '4', 'Hector ', 'Hernandez', 'Garcia', '11642386', '04241091446', '1', 'Recep. Informacion', '1', '0', '09/05/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('52', '52', '4', 'Heccary', 'Francis', 'Miranda', 'Gonzalez', '16106992', '04126877505', 'HECCARYF@HOTMAIL.COM', '1', 'Asistente Administrativo', '1', '0', '10/05/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `organization`, `status`, `absences`, `linkPhoto`, `dateEnd`) VALUES ('53', '53', '4', 'Milthon', 'Ruben', 'Barrios', 'Vivas', '11643333', '04129558399', '1', 'AYUD. DE SERV. GENERALES', '1', '0', 'https://res.cloudinary.com/moisesinc/image/upload/v1648319001/INVITRACV/file-worker-53.jpg', '2022-11-05');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('54', '54', '4', 'Rigoberto', 'Jose', 'Marin', '10578847', '04269026104', 'RIGOBERTOJMARIN GMAIL.COM', '1', 'Operador De Transporte', '1', '0', '12/05/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('55', '55', '4', 'Alcides', 'Jose', 'Villegas', 'Guillen', '7990660', '04122540145', '1', 'Operador De Transporte', '1', '0', '13/05/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('56', '56', '4', 'Abelardo', 'Hector Ruperto', 'Bastidas', 'Blanco', '5115082', '04241900496', '1', 'Operador De Transporte', '1', '0', '14/05/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `status`, `absences`, `dateEnd`) VALUES ('57', '57', '4', 'Alvaro', 'Alberto', 'Fernandez', 'Hidalgo', '4850771', '04123660095', '1', '1', '0', '15/05/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('58', '58', '4', 'Ramon', 'Alberto', 'Natera', 'Molina', '6499474', '04142762350', '1', 'Operador De Transporte', '1', '0', '16/05/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `status`, `absences`, `dateEnd`) VALUES ('59', '59', '4', 'Jorge', 'Felix', 'Morillo', 'Aponte', '9995318', '04128034508', '1', '1', '0', '17/05/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `status`, `absences`, `dateEnd`) VALUES ('60', '60', '4', 'Jhonathan', 'Jose', 'Montenegro', 'Ladera', '19445811', '04263189449', '1', '1', '0', '18/05/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('61', '61', '4', 'MIGUEL', 'CORNELIO', 'MORENO', 'ORTIZ', '13828466', '04241371651', 'mcmo0416@gmail.com', '1', 'OPERADOR DE TRANSPORTE', '1', '0', '2021-12-06');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `absences`, `linkPhoto`, `dateEnd`) VALUES ('62', '62', '4', 'JOSE', 'OSCAR', 'BELLO', 'SILVA', '8178190', '04265181597', 'JOSEBELLO@GMAIL.COM', '4', 'GERENTE GENERAL', '1', '0', 'https://res.cloudinary.com/moisesinc/image/upload/v1648320527/INVITRACV/file-worker-62.jpg', '2021-12-06');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('63', '63', '4', 'William', 'Jose', 'Davila', 'Suarez', '16880600', '04140291855', '1', 'Operador De Transporte', '1', '0', '21/05/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('64', '64', '4', 'GUSTAVO', '', 'LOMBANO', 'MAYORA', '6485589', '04268185099', '1', 'ANALISTA DE PRESUPUESTO III', '1', '0', '2021-12-06');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `status`, `absences`, `dateEnd`) VALUES ('65', '65', '4', 'Juan', 'Carlos', 'Veliz', 'Veliz', '12397984', '04120233646', '1', '1', '0', '23/05/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `absences`, `dateEnd`) VALUES ('66', '66', '4', 'Luis', 'Algeny', 'Veitia', 'Rivas', '16308576', '04261001019', 'VEITIALUIS671HOTMAIL.COM', '1', 'Operador De Transporte', '1', '0', '24/05/2022');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `linkPhoto`, `dateEnd`) VALUES ('67', '67', '4', 'ERIC', 'MANUEL', 'RODRIGUEZ', 'LOPEZ', '13225152', '04123191867', '', '1', 'HERRERO', '1', 'https://res.cloudinary.com/moisesinc/image/upload/v1648322438/INVITRACV/file-worker-117.jpg', '2021-12-05');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `license`, `organization`, `status`, `dateEnd`) VALUES ('68', '68', '4', 'HENRY', 'ALFREDO', 'RIVAS', 'VASQUEZ', '6484173', '0412989428', '1', 'JEFE DE TRANSPORTE', '1', '2021-12-06');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `dateEnd`) VALUES ('69', '69', '4', 'JOSE', 'YGNACIO', 'SANOJA', 'LEON', '9997675', '04141878169', 'JOSESANOJA@GMAIL.COM', '1', 'OPERADOR DE TRANSPORTE', '1', '2021-12-06');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `type`, `address`, `phone`, `email`, `medical`, `license`, `organization`, `membership`, `route`, `status`, `absences`, `dateInit`, `dateEnd`) VALUES ('101', '1', '2', 'Moises', 'Alberto', 'Camacho', 'Rojas', '220', '1', 'Distrito Capital, Caracas la cadelaria', '04120894700', 'moisescamacho26@gmail.com', '448854', '4', 'Test', '1', 'La candelaria', '0', '0', '2022-01-18', '2022-01-31');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `address`, `phone`, `email`, `medical`, `license`, `organization`, `membership`, `route`, `status`, `absences`, `observations`, `dateInit`, `dateEnd`) VALUES ('104', '4', '1', 'Carlos', 'R', 'Gonzalez', 'H', '789456', 'saf', '547896', 'carlos@test.com', '4324', '3', 'Test', '5423', 'TEst', '0', '0', 'asdsa', '1969-12-31', '1969-12-31');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `email`, `medical`, `license`, `organization`, `membership`, `status`, `absences`, `linkPhoto`, `dateInit`, `dateEnd`) VALUES ('106', '6', '0', 'Test', 's', 'ss', 'ss', '2134', '123', 'testys@test.com', '123123', '3', 'ewqe', '123', '1', '1', 'https://res.cloudinary.com/moisesinc/image/upload/v1643146493/INVITRACV/file-worker-6.jpg', '2022-01-04', '2022-01-07');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `type`, `address`, `phone`, `email`, `medical`, `license`, `organization`, `membership`, `route`, `status`, `absences`, `observations`, `linkPhoto`, `dateInit`, `dateEnd`) VALUES ('107', '7', '2', 'Marcelo', 'Fedico', 'Rodriguez', 'Perez', '22212131', '2', 'La guaria, calle 123 casa 5', '0412-4198485', 'marcelo@test.com', '234', '3', 'Altamira', '5', 'Altamira', '1', '12', 'Sin observaciones', 'https://res.cloudinary.com/moisesinc/image/upload/v1643212781/INVITRACV/file-worker-7.webp', '2022-01-04', '2022-01-06');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `type`, `address`, `phone`, `email`, `medical`, `license`, `organization`, `membership`, `route`, `status`, `absences`, `observations`, `linkPhoto`, `dateInit`, `dateEnd`) VALUES ('108', '8', '2', 'Daniel', 'Jose', 'Velazques', 'Vargas', '4556452', '2', 'Vargas Calle 3 edificio test', '04124464665', 'testE@test.com', '232123', '4', 'Test', '123', 'Test Ruta', '1', '9', 'Sin ombservaciones', 'https://res.cloudinary.com/moisesinc/image/upload/v1643219993/INVITRACV/file-worker-8.jpg', '2021-12-09', '2022-01-28');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `firstLastname`, `DNI`, `phone`, `medical`, `license`, `organization`, `membership`, `route`, `status`, `absences`, `linkPhoto`) VALUES ('112', '12', '1', 'Juan', 'Caballo', '23', '123', '213', '3', 'wqe', '123', 'qwe', '0', '1', 'https://res.cloudinary.com/moisesinc/image/upload/v1643223347/INVITRACV/file-worker-12.png');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `type`, `phone`, `email`, `medical`, `license`, `organization`, `membership`, `route`, `status`, `absences`) VALUES ('113', '13', '2', 'Mario ', 'F', 'Casas', 'J', '2312', '3', '13213', 'test@test.com', '234', '4', '324', '123', 'test', '1', '3');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `email`, `medical`, `license`, `organization`, `membership`, `route`, `status`, `absences`, `dateInit`, `dateEnd`) VALUES ('114', '14', '3', 'Test', 'test', 'Garcia', 'eers', '34234', '3214324', 'test@tet.cm', '234', '2', 'Test', '23423', 'test', '1', '3', '2022-03-09', '2022-03-24');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `dateEnd`) VALUES ('119', '71', '4', 'ARMANDO', 'JOSÉ', 'LOPEZ', 'AMUNDARAY', '5570758', '04128017124', 'armandol16@hotmail.com', '1', 'FISCAL', '1', '2021-12-06');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `firstLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `dateEnd`) VALUES ('120', '72', '4', 'GIOMAR', 'CAMACHO', '16308261', '04267127333', 'giomarcamac@hotmail.com', '1', 'FISCAL', '1', '2021-12-06');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `dateEnd`) VALUES ('121', '73', '4', 'LORKYS', 'ALEXANDER', 'PEREZ', 'MENDEZ', '15267502', '04167131915', 'perezlorkyz@gmail.com', '1', 'POLICIA', '1', '2021-12-06');",
	"INSERT INTO workers (`idWorker`, `code`, `workerType`, `firstName`, `secondName`, `firstLastname`, `secondLastname`, `DNI`, `phone`, `email`, `license`, `organization`, `status`, `dateEnd`) VALUES ('122', '70', '4', 'GABRIEL', 'ALEJANDRO', 'LADAETA', 'MARTINEZ', '31656275', '0412390433', 'gabriellandaeta2004@gmail', '3', 'ASISTENTE ADMINISTRATIVO', '1', '2021-12-06');",
];