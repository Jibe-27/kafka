import express from 'express';
import bodyParser from 'body-parser';
import { sendEvent } from './Producer';
import { entryEvents, exitEvents } from './Consumer';

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index', { entryEvents, exitEvents });
});

app.post('/entry', (req, res) => {
    const event = req.body;
    sendEvent('entry-events', event);
    res.status(200).send('Entry event sent');
});

app.post('/exit', (req, res) => {
    const event = req.body;
    sendEvent('exit-events', event);
    res.status(200).send('Exit event sent');
});

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
