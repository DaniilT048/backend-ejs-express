import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import {getArticleById, getArticles} from "../services/articlesServices.js";
import favicon from 'serve-favicon';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { users, addUser, findUser } from '../services/usersServices.js';

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
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(express.json());

app.use((req, res, next) => {
    res.locals.theme = req.cookies.theme || 'light';
    next();
});


function requireAuth(req, res, next) {
    if (!req.session.user) {
        req.session.message = 'You must login to view the articles';
        return res.redirect('/login');
    }
    next();
}

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/articles', requireAuth, (req, res) => {
    const articles = getArticles();
    res.render('articles', { articles } );
})

app.get('/articles/:id', requireAuth, (req, res) => {
    const article = getArticleById(req.params.id);
    if (!article) return res.status(404).send('Article is not found');
    res.render('article', { article });
});

app.get('/set-theme/:theme', (req, res) => {
    const { theme } = req.params;

    if (['light', 'dark'].includes(theme)) {
        res.cookie('theme', theme, { maxAge: 7 * 24 * 60 * 60 * 1000 });
        req.session.theme = theme;
    }

    res.redirect(req.get('Referer') || '/' );
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.send('Name or password are required');
    }
    if (findUser(username)) {
        return res.send('User is already exist');
    }
    addUser(username, password);
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    const message = req.session.message;
    req.session.message = null;
    res.render('login', { theme: res.locals.theme, message });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.send('Login or password is incorect');
    }

    req.session.user = user;
    res.redirect('/');
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});



app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})