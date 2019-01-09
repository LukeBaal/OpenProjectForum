const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Database
const db = require('./config/database');

// Test database connection
db.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error(err));

// Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

// @route GET /
// @desc Home route
app.get('/', (req, res) => {
  res.render('index');
});

app.use('/user', require('./routes/user'));

app.use('/projects', require('./routes/projects'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
