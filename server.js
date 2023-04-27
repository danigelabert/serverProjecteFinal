//NodeJS: localhost:4080

const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs')
const uuid = require('uuid');
const {initModels} = require("./models/init-models");
const {Sequelize} = require("sequelize");

app.use(express.json(), cors());

port = 4080;
app.listen(port, () => {
    console.log(`Port::${port}`);
});

var resultat;

//Conexció BDD ----------------------------------------------------------------------------
const datos= async function (){
    const readableStream = fs.createReadStream("./bdd_connect", 'utf8');
    readableStream.on('data', (chunk)=>{
        resultat = chunk;
    });
}
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const admin = require("firebase-admin");
const {getFirestore}=require("firebase-admin/firestore");
var serviceAccount;

const dbExecucio=async function (){
    if (resultat!==""){
        datos()
        await timeout(2000);
    }
    serviceAccount= require(resultat);
    if (admin.apps.length===0){
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
}
dbExecucio();

//-----------------------------------------------------------------------------------------

// Obtener datos actuales -----------------------------------------------------------------

app.post('/api/logs',(req, res) => {
    let data=new Date()
    var dataFinal= ((data.getDay()+19)+"/"+(data.getMonth()+1)+"/"+data.getUTCFullYear()+" "+(data.getUTCHours()+1)+":"+data.getUTCMinutes()+":"+data.getSeconds())
    var {usuario, accion}=req.body;
    var text=dataFinal+": Usuario: "+usuario+" -> "+accion+"\n"
    const escriure=fs.createWriteStream("./LogsUsuarios",{flags:'a+'})
    escriure.write(text)
    console.log("Registro guardado.")
})

//-----------------------------------------------------------------------------------------


app.post('/registre', cors(), (req, res)=>{
    const db=getFirestore()
    const user={'Usuari': req.body.user,
                'email': req.body.email,
                'contrasenya': req.body.password,
                'admin': req.body.admin};
    db.collection('usuaris').add(user);
    console.log(user);
})

app.get('/api/check', async (req,res)=>{
    const db=getFirestore()
    let correu = {email: req.query.email}
    let resultat = false;
    const docs = db.collection('usuaris')
    const snapshot = await docs.where('email', '==', correu.email).get()
    snapshot.forEach(doc =>{
        resultat = true
    })
    res.json(resultat)
});

app.get('/inicisessio', async (req,res)=>{
    const db=getFirestore()
    let correu = {email: req.query.email}
    let resultat = false;
    const docs = db.collection('usuaris')
    const snapshot = await docs.where('email', '==', correu.email).get()
    snapshot.forEach(doc =>{
        resultat = true
    })
    res.json(resultat)
});


app.get('/contrasenya', async (req,res)=>{
    const db=getFirestore()
    let correu = {name: req.query.name}
    let resultat = false;
    const docs = db.collection('usuaris')
    const snapshot = await docs.where('contrasenya', '==', correu.name).get()
    snapshot.forEach(doc =>{
        resultat = true
    })
    res.json(resultat)
});

const axios = require('axios');

async function sendEmail(name, email) {
    const data = JSON.stringify({
        "Messages": [{
            "From": {"Email": "daniel.gelabert@institutvidreres.cat", "Name": "Dani"},
            "To": [{"Email": email, "Name": name}],
            "Subject": "Cambiar tu contraseña",
            "TextPart": "Hola buenas, \n"+
                "Hemos recibido una solicitud de cambio de contraseña, en caso de ser tu quien ha solicitado esto, entra en el link que tienes a continuación. En caso contrario alguien esta intentando acceder a tu cuenta. \n" +
                "" +
                "http://localhost:4200/canvi \n\n" +
                "" +
                "Attentamente:  \n\n" +
                "" +
                "Amazon."
        }]
    });

    const config = {
        method: 'post',
        url: 'https://api.mailjet.com/v3.1/send',
        data: data,
        headers: {'Content-Type': 'application/json'},
        auth: {username: 'd150a24fda9b232d888c504e789d068f', password: '509e73dde62817d0a7aad8a30a182227'},
    };

    return axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
}

app.post('/api/sendemail/', function (req, res) {
    console.log("Correu Enviat")
    const {name, email} = req.body;
    sendEmail(name, email);
});

app.post('/api/contrasenya', async (req,res)=>{
    const db=getFirestore()
    const {email, contra}=req.body
    var documento=""
    const docs = db.collection('usuaris')
    const snapshot = await docs.where('email', '==', email).get();
    snapshot.forEach(doc =>{
        documento=doc.id;
    })
    const moddify = await db.collection('usuaris').doc(documento).set({contrasenya: contra}, {merge:true})
    res.json(contra)
})

app.get('/api/nombre', async (req,res)=>{
    const db=getFirestore()
    const email=req.query.email
    var documento=""
    const docs = db.collection('usuaris')
    const snapshot = await docs.where('email', '==', email).get();
    snapshot.forEach(doc =>{
        documento=doc.data();
    })
    res.json(documento)
});

app.get('/api/admin', async (req,res)=>{
    const db = getFirestore()
    let correu = {email: req.query.email}
    let resultat;
    const docs = db.collection('usuaris')
    const snapshot = await docs.where('email', '==', correu.email).get()
    snapshot.forEach(doc =>{
        resultat = doc.data();
    })
    res.json(resultat)
});

app.post('/formularioconsulta',(req, res) => {
    const nombreArchivo = `${uuid.v4()}.txt`;
    var {usuario, correu, missatge}=req.body;
    var text="User: "+ usuario +"\n"+"Correu: "+correu+"\n"+"Missatge: "+missatge;
    const escriure=fs.createWriteStream(nombreArchivo)
    escriure.write(text)
})

app.get('/user', async (req,res)=>{
    let correu = {name: req.query.name}
    let resultat = false;
    const docs = db.collection('usuaris')
    const snapshot = await docs.where('Usuari', '==', correu.name).get()
    snapshot.forEach(doc =>{
        resultat = true
    })
    res.json(resultat)
});






//Conexció MYSQL ----------------------------------------------------------------------------


const credentials = fs.readFileSync('mysqlConnect.txt', 'utf8')
    .split('\n')
    .reduce((acc, line) => {
        const [key, value] = line.split(/[^\w-]+/);
        acc[key] = value;
        return acc;
    }, {});
const mysql = require('mysql');


const auto = new Sequelize(credentials.database, credentials.user, credentials.password, {
    host: credentials.host,
    dialect: 'mysql'
});
const models = initModels(auto);



//PRODUCTES
app.get('/periferics', async (req, res)=>{
    const p= await models.producte.findAll({where:{prod_tipus: "perifèrics"}});
    res.send(p)
    console.log(p)
})

app.get('/ordenadors', async (req, res)=>{
    const p= await models.producte.findAll({where:{prod_tipus: "ordenadores"}});
    res.send(p)
    console.log(p)
})

app.get('/mobils', async (req, res)=>{
    const p= await models.producte.findAll({where:{prod_tipus: "moviles"}});
    res.send(p)
    console.log(p)
})



//IMATGES
//images ordiandor
app.get('/images/ordinador/msimodern', async (req, res) => {
    res.sendFile(__dirname+'\\images\\MSI Modern.png');
});
app.get('/images/ordinador/hpomen', async (req, res) => {
    res.sendFile(__dirname+'\\images\\HP Omen.png');
});
app.get('/images/ordinador/asustuf', async (req, res) => {
    res.sendFile(__dirname+'\\images\\Asus TUF.png');
});
app.get('/images/ordinador/asusf515', async (req, res) => {
    res.sendFile(__dirname+'\\images\\Asus F515.png');
});
app.get('/images/ordinador/macbook', async (req, res) => {
    res.sendFile(__dirname+'\\images\\Apple MacBook.png');
});


//images mobils
app.get('/images/mobil/iphone14', async (req, res) => {
    res.sendFile(__dirname+'\\images\\iPhone 14 Pro Max.png');
});
app.get('/images/mobil/iphone13', async (req, res) => {
    res.sendFile(__dirname+'\\images\\iPhone 13.png');
});
app.get('/images/mobil/realmegt', async (req, res) => {
    res.sendFile(__dirname+'\\images\\realme.png');
});
app.get('/images/mobil/oppofind', async (req, res) => {
    res.sendFile(__dirname+'\\images\\Asus F515.png');
});
app.get('/images/mobil/xiaomi12t', async (req, res) => {
    res.sendFile(__dirname+'\\images\\oppo.png');
});
app.get('/images/mobil/s22', async (req, res) => {
    res.sendFile(__dirname+'\\images\\s22 ultra.png');
});


//images periferics
app.get('/images/periferics/newskill', async (req, res) => {
    res.sendFile(__dirname+'\\images\\newskill.png');
});
app.get('/images/periferics/logitech', async (req, res) => {
    res.sendFile(__dirname+'\\images\\k120.png');
});
app.get('/images/periferics/forgeon', async (req, res) => {
    res.sendFile(__dirname+'\\images\\forgeon.png');
});
app.get('/images/periferics/razer', async (req, res) => {
    res.sendFile(__dirname+'\\images\\razer.png');
});
app.get('/images/periferics/asus', async (req, res) => {
    res.sendFile(__dirname+'\\images\\Asus P307.png');
});


//foto slider pagina principal
app.get('/images/slider/foto1', async (req, res) => {
    res.sendFile(__dirname+'\\images\\foto1.png');
});
app.get('/images/slider/foto2', async (req, res) => {
    res.sendFile(__dirname+'\\images\\foto2.png');
});
app.get('/images/slider/foto3', async (req, res) => {
    res.sendFile(__dirname+'\\images\\foto3.png');
});
app.get('/images/slider/foto4', async (req, res) => {
    res.sendFile(__dirname+'\\images\\foto4.png');
});

//foto buscador
app.get('/images/buscador/logo', async (req, res) => {
    res.sendFile(__dirname+'\\images\\logo.png');
});

//foto css
app.get('/images/css/lupa', async (req, res) => {
    res.sendFile(__dirname+'\\images\\lupa.png');
});

app.get('/images/css/carrito', async (req, res) => {
    res.sendFile(__dirname+'\\images\\carrito.png');
});

app.get('/images/css/login', async (req, res) => {
    res.sendFile(__dirname+'\\images\\login.png');
});

app.get('/images/css/exit', async (req, res) => {
    res.sendFile(__dirname+'\\images\\exit.png');
});

app.get('/images/css/collage1', async (req, res) => {
    res.sendFile(__dirname+'\\images\\colage1.png');
});

app.get('/images/css/collage2', async (req, res) => {
    res.sendFile(__dirname+'\\images\\colage2.png');
});

app.get('/images/css/collage3', async (req, res) => {
    res.sendFile(__dirname+'\\images\\colage3.png');
});

app.get('/images/css/primevideo', async (req, res) => {
    res.sendFile(__dirname+'\\images\\amazon-prime-video.jpg');
});

app.get('/images/css/sorpresa', async (req, res) => {
    res.sendFile(__dirname+'\\images\\sorpresa.jpg');
});

//foto contacto
app.get('/images/css/fot1', async (req, res) => {
    res.sendFile(__dirname+'\\images\\fot1.png');
});

app.get('/images/css/fot2', async (req, res) => {
    res.sendFile(__dirname+'\\images\\fot2.png');
});

app.get('/images/css/fot3', async (req, res) => {
    res.sendFile(__dirname+'\\images\\fot3.png');
});

app.get('/images/css/fot4', async (req, res) => {
    res.sendFile(__dirname+'\\images\\fot4.png');
});

app.get('/images/css/fot5', async (req, res) => {
    res.sendFile(__dirname+'\\images\\fot5.png');
});

app.get('/images/css/fot6', async (req, res) => {
    res.sendFile(__dirname+'\\images\\fot6.png');
});

app.get('/images/css/fot7', async (req, res) => {
    res.sendFile(__dirname+'\\images\\fot7.png');
});

app.get('/images/css/fot8', async (req, res) => {
    res.sendFile(__dirname+'\\images\\fot8.png');
});

app.get('/images/css/fot9', async (req, res) => {
    res.sendFile(__dirname+'\\images\\fot9.png');
});

app.get('/images/css/basura', async (req, res) => {
    res.sendFile(__dirname+'\\images\\basura.png');
});

app.get('/images/css/minilogo', async (req, res) => {
    res.sendFile(__dirname+'\\images\\minilogo.jpg');
});
