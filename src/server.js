import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import {getArticleById, getArticles} from "../services/articlesServices.js";
import favicon from 'serve-favicon';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const PORT = 4000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(favicon(path.join(__dirname, '../public/favicon.ico')));
app.use(cookieParser());
app.use(cors({
    origin: true,
}));

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.json());


app.get('/', (req, res) => {
    const theme = req.cookies.theme || 'light';
    res.render('index', { theme });
});

app.get('/articles', (req, res) => {
    const articles = getArticles();
    const theme = req.cookies.theme || 'light';
    res.render('articles', { articles, theme });
})

app.get('/articles/:id', (req, res) => {
    const article = getArticleById(req.params.id);
    const theme = req.cookies.theme || 'light';
    if (!article) return res.status(404).send('Article is not found');
    res.render('article', {article, theme});
});

app.get('/set-theme/:theme', (req, res) => {
    const { theme } = req.params;

    if (['light', 'dark'].includes(theme)) {
        res.cookie('theme', theme, { maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 дней
        req.session.theme = theme;
    }

    res.redirect(req.get('Referer'));
});


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})