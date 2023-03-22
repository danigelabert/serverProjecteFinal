//NodeJS: localhost:4080

const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json(), cors());

port = 4080;
app.listen(port, () => {
    console.log(`Port::${port}`);
});

var admin = require("firebase-admin");

var serviceAccount = require(".\\usuaris-e30d6-firebase-adminsdk-6aa2i-283c975af3.json");

const {getFirestore} = require("firebase-admin/firestore");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore();

app.post('/registre', cors(), (req, res)=>{

    const user={'Usuari': req.body.user,
        'email': req.body.email,
        'contrasenya': req.body.password};
    db.collection('usuaris').add(user);
    console.log(user);
})

app.get('/api/check', async (req,res)=>{
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
    const email=req.query.email
    var documento=""
    const docs = db.collection('usuaris')
    const snapshot = await docs.where('email', '==', email).get();
    snapshot.forEach(doc =>{
        documento=doc.data();
    })
    res.json(documento)
});



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

