// require express server
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
require('dotenv').config({});

//require expressLeyouts for EJS
const expressLayouts = require('express-ejs-layouts');

//require session
const session = require('express-session');

//require flash
const flash = require('connect-flash');

// require mongoose
const mongoose = require('mongoose');
const dbUri = process.env.DB_URI || 'mongodb://localhost:27017/chating';

//require method override
const methodOverride = require('method-override');

//require passport and passport-local
const passport = require('passport');
const LocalStrategy = require('passport-local');

//require user model
const User = require('./models/user');

//require routes
const user = require('./routes/user');
const home = require('./routes/home');

// connect to DB
mongoose.connect(dbUri, {
   useNewUrlParser: true,
   useCreateIndex: true,
   useUnifiedTopology: true,
   useFindAndModify: false,
});

// check DB connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
   console.log('Database connected');
});

//EJS setup
app.set('views', __dirname + '/views'); //app.set("views", path.join(__dirname, "/views")); this does the same job (require path)
app.set('view engine', 'ejs');
app.use(expressLayouts);

//use urlencoded
app.use(express.urlencoded({ extended: true }));

//use methodOverride
app.use(methodOverride('_method'));

//Join paths
app.use(express.static('dist')); // app.use(express.static(path.join(__dirname, "dist"))); this does the same job (require path)

//use session
const sessionConfig = {
   secret: 'sessionsecrit', //solve deprecated warnings
   resave: false, //solve deprecated warnings
   saveUninitialized: true, //solve deprecated warnings
   cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //set expiration date
      maxAge: 1000 * 60 * 60 * 24 * 7, //set max age
   },
};
app.use(session(sessionConfig));

//use flash
app.use(flash());

app.use((req, res, next) => {
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   res.locals.sign_in_error = req.flash('sign_in_error');
   res.locals.sign_up_error = req.flash('sign_up_error');
   next();
});

//use passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(
   new LocalStrategy(
      {
         usernameField: 'email', //can be 'email' or 'whateveryouwant'
         passwordField: 'password', //same thing here the defult is password //--- so in this case it is not required ---//
      },
      User.authenticate()
   )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//use router
app.use('/user', user);
app.use(home);

//error handling
app.use((err, req, res, next) => {
   if (process.env.NODE_ENV !== 'production') {
      const { statusCode = 500 } = err;
      if (!err.message) err.message = 'Oops, Somthing went wrong';
      res.status(statusCode).render('error', {
         err,
         title: 'Oops | Somthing went wrong',
      });
   } else {
      return res.redirect('/');
   }
});
//express server
const PORT = 3000 || process.env.PORT;

server.listen(PORT, () =>
   console.log(`Server running in ${process.env.NODE_ENV} on port: ${PORT}`)
);
