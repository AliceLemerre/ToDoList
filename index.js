
const express = require('express')
const bodyParser = require('body-parser')
const nodemailer = require("nodemailer");
const app = express()
const port = 3000
 

const database = [{
  title: "Tâche 1", description: "Description de la tâche 1", id: 1},];

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'jaeden.reynolds@ethereal.email',
      pass: 'gsEDUb6JpVTefekRDx'
  }
});

async function sendMail(subject, text) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <jaeden.reynolds@ethereal.email>',
    to: "jaeden.reynolds@ethereal.email, ", 
    subject: subject,
    text: text, 
    html: text,
  });
  console.log("Message sent: %s", info.messageId);

}

sendMail().catch(console.error);


app.get('/', (request, response) => {
  response.send('Hello World!')
})

app.get('/tasks', (request, response) => {
  response.send(database)
})


app.get('/task/:id', (req, res) => {
  const index = database.findIndex(obj => obj.id == req.params.id);
  res.send(database[index]);
})


app.post('/create', (request, response) => {
  //console.log(request.body)
  database.push(request.body)
  response.send("tâche créée");

  sendMail("Nouvelle tâche", "Une nouvelle tâche a été créée");
  
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



app.put('/update/:id', (req, res) => {
  //res.send(`${req.params.id}`) // et req.body.id = 1
const index = database.findIndex(obj => obj.id == req.params.id);
//Update object's name property.
//database[index].name = "Laila";
  database[index]=req.body;
  console.log(database[index]);
  res.send(database);
  sendMail("Tâche modifiée", "Une tâche a été modifiée");



})


app.delete('/delete/:id', (request, response) => {
  const index = database.findIndex(obj => obj.id == request.params.id);
  database.splice(index, 1);
  response.send(database);
  console.log(database);
  sendMail("Tâche supprimée", "Une tâche a été supprimée");

})

