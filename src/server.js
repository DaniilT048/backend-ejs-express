import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import {getArticleById, getArticles} from "../services/articlesServices.js";

const PORT = 4000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));

app.use(cors({
    origin: true,
}));

app.use(express.json());


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/articles', (req, res) => {
    const articles = getArticles();
    res.render('articles', { articles });
})

app.get('/articles/:id', (req, res) => {
    const article = getArticleById(req.params.id);
    if (!article) return res.status(404).send('Article is not found');
    res.render('article', { article });
});




app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})