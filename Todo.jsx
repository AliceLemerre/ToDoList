import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';

const app: express.Application = express();
const port: number = 3000;

interface Task { 
  title: string;
  description: string;
  id: number;
}

const database: Task[] = [{
  title: "Tâche 1", description: "Description de la tâche 1", id: 1
}];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'jaeden.reynolds@ethereal.email',
    pass: 'gsEDUb6JpVTefekRDx'
  }
});

async function sendMail(subject: string, text: string): Promise<void> {
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <jaeden.reynolds@ethereal.email>',
    to: "jaeden.reynolds@ethereal.email",
    subject: subject,
    text: text,
    html: text,
  });
  console.log("Message sent: %s", info.messageId);
}

sendMail("Initial Mail", "This is an initial mail").catch(console.error);

app.get('/', (request: Request, response: Response): void => {
  response.send('Hello World!');
});

app.get('/tasks', (request: Request, response: Response): void => {
  response.send(database);
});

app.get('/task/:id', (req: Request, res: Response): void => {
  const index: number = database.findIndex(obj => obj.id === parseInt(req.params.id));
  res.send(database[index]);
});

app.post('/create', (request: Request, response: Response): void => {
  database.push(request.body);
  response.send("tâche créée");
  sendMail("Nouvelle tâche", "Une nouvelle tâche a été créée");
});

app.listen(port, (): void => {
  console.log(`Example app listening on port ${port}`);
});

app.put('/update/:id', (req: Request, res: Response): void => {
  const index: number = database.findIndex(obj => obj.id === parseInt(req.params.id));
  database[index] = req.body;
  console.log(database[index]);
  res.send(database);
  sendMail("Tâche modifiée", "Une tâche a été modifiée");
});

app.delete('/delete/:id', (request: Request, response: Response): void => {
  const index: number = database.findIndex(obj => obj.id === parseInt(request.params.id));
  database.splice(index, 1);
  response.send(database);
  console.log(database);
  sendMail("Tâche supprimée", "Une tâche a été supprimée");
});