import express from 'express';
import cors from 'cors';
import { pollRouter } from './routes/poll.routers.js';
import { choiceRouter } from './routes/choice.routers.js';

const app = express();
app.use(cors());
app.use(express.json()); 

app.use(pollRouter);
app.use(choiceRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on port ${port}`));