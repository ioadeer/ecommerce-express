const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');

const mongooseMorgan = require('mongoose-morgan');
const app = express();


const db = require('./config/keys').mongoURI;

mongoose.connect(
  db,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
)
  .then(() => console.log('MongoDB successfully connected'))
  .catch((err) => console.log(err));

// app.use(mongooseMorgan({
//   connectionString:db
// }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('query parser', 'simple');
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,PUT');                                                                        
  next();                      
});
app.options("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS'); 
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With,x-access-token');                 
  res.send(200);
});

// app.use(cors());
// Passport middleware
app.use(passport.initialize());
// Passport config
require('./config/passport')(passport);

app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
