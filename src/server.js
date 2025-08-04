require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const expressEjsLayouts = require('express-ejs-layouts');

const routes = require('./routes');
const database = require('./configs/ormconfig');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  session({
    secret: 'phpi2024',
    resave: false,
    saveUninitialized: true,
  }),
);

app.use(flash());

app.use((req, res, next) => {
  const currentPage = req.originalUrl.split('/')[2]; //
  res.locals.messages = req.flash();
  res.locals.session = req.session;
  res.locals.currentPage = currentPage;
  next();
});

app.use(
  morgan('dev', {
    skip: (req, res) => req.url.startsWith('/assets/'),
  }),
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressEjsLayouts);

app.set('layout', path.join(__dirname, 'views', 'layouts', 'main.ejs'));

database
  .initialize()
  .then(() => {
    console.log('[database]: Connected to the database');
  })
  .catch((error) => {
    console.error('[database]: Error connecting', error);
  });

routes(app);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
