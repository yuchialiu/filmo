require('dotenv').config();

const { API_VERSION, SESSION_SECRET, SERVER_IP } = process.env;

// Express Initialization
const express = require('express');

const app = express();

app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

// session
const session = require('express-session');

const { sessionStore } = require('./server/models/mysqlcon');

app.use(
  session({
    secret: SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

app.get('/', (req, res) => res.redirect('https://filmo.site/home?locale=en-US'));

app.use('/user', [require('./server/routes/user_route')]);
app.use('/', [require('./server/routes/page_route')]);

// API Routes
app.use(`/api/${API_VERSION}/user`, [require('./server/routes/user_route')]);
app.use(`/api/${API_VERSION}`, [require('./server/routes/crawler_route'), require('./server/routes/movie_route')]);

// Server Port
const port = 3000;
app.listen(port, () => {
  console.log(`server.js listening on port ${port}`);
});
