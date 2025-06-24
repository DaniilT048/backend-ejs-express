import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';

const PORT = 4000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(cors({
    origin: true,
}));

app.use(express.json());


app.get('/', (req, res) => {
    res.render('index');
});




app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})