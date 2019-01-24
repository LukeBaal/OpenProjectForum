const express = require('express');
// const exphbs = require('express-handlebars');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');
const User = require('./models/User');
const Project = require('./models/Project');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const Vote = require('./models/Vote');

const app = express();

// Init Passport
require('./config/passport')(passport);

process.env.NODE_ENV = 'test';
// Database
const db = require('./config/database')[process.env.NODE_ENV || 'dev'];

// Test database connection
db.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error(err));

// Create tables in db if they don't exist
User.sync();
Project.sync();
Post.sync();
Comment.sync();
Vote.sync();

// Middleware
// app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
// app.set('view engine', 'handlebars');
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// Static assets folder
// app.use(express.static(path.join(__dirname, 'public')));

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
module.exports = app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`)
);
