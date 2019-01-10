const express = require('express');
// const exphbs = require('express-handlebars');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');

const app = express();

// Init Passport
require('./config/passport')(passport);

// Database
const db = require('./config/database');

// Test database connection
db.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error(err));

// Middleware
// app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
// app.set('view engine', 'handlebars');
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Form override methods
app.use(methodOverride('_method'));

app.use(passport.initialize());
app.use(passport.session());

// @route GET /
// @desc Home route
app.get('/', (req, res) => {
  res.render('index');
});

app.use('/user', require('./routes/user'));

app.use('/projects', require('./routes/projects'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
