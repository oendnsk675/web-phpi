require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const expressEjsLayouts = require('express-ejs-layouts');

const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressEjsLayouts);

app.set('layout', path.join(__dirname, 'views', 'layouts', 'main.ejs'));

routes(app);

app.get('/members', (req, res) => {
  res.render('pages/members', {
    title: 'Community Members',
    members: [
      { name: 'John Doe', role: 'Admin' },
      { name: 'Jane Smith', role: 'Member' },
      { name: 'Chris Johnson', role: 'Moderator' },
    ],
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
