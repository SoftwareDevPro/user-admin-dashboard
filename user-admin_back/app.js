
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var passwordHash = require('password-hash');

var app = express();
var User = require('./schemas/user_schema.js');
var mongoose = require('mongoose');

console.log("Environment: " + app.get('env'));

let user_db = app.get('env').trim() == 'development' ? 'testdb' : 'userdb';
console.log('user_db := ' + user_db);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

function isObjectEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}

app.get('/users/:userid', function(req, res) {

  console.log("/users/:userid [" + req.params.userid + "]");
  
  mongoose.connect('mongodb://localhost:27017/' + user_db,  { useNewUrlParser: true, useUnifiedTopology: true }).then(function() {
    
  User.findOne({userid: req.params.userid}, function (err, result) {
    if (isObjectEmpty(result)) {
          res.status(200).json({});
        } else {
          res.status(200).json(result);
        }
    });
  });
});

app.get('/users', function(req, res) {

  console.log("/users");

  mongoose.connect('mongodb://localhost:27017/' + user_db,  { useNewUrlParser: true, useUnifiedTopology: true }).then(function() {

    User.find({})
        .sort('userid')
        .exec(function (err, result) {

          if (isObjectEmpty(result)) {
            res.status(200).json({});
          } else {
            res.status(200).json(result);
          }

    });
  });

});

app.post('/users/delete/:userId', function(req, res) {

  mongoose.connect('mongodb://localhost:27017/' + user_db,  { useNewUrlParser: true, useUnifiedTopology: true }).then(function() {
        
    User.remove({ userid: parseInt(req.params.userId) }, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("update successfull");
      }
    });
  });

  res.redirect('http://localhost:8080/users')
});

app.post('/users/edit/:userId', function(req, res) {

  mongoose.connect('mongodb://localhost:27017/' + user_db,  { useNewUrlParser: true, useUnifiedTopology: true }).then(function() {
        
    User.updateOne({ userid: parseInt(req.params.userId) }, {
      name: req.body.name,
      pass: passwordHash.generate(req.body.pass),
      email: req.body.email
    }, {}, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("update successfull");
      }
    });
  });

  res.redirect('http://localhost:8080/users')

});

app.post('/users/delete', function(req, res) {
  
  mongoose.connect('mongodb://localhost:27017/' + user_db,  { useNewUrlParser: true, useUnifiedTopology: true }).then(function() {

    console.log('Successfully connected');

    User.deleteMany({}, function(err, result) {
      if (err) {
        console.log("Error:" + err);
      } else {
        console.log("User deletion successfull");
      }
    });
  });

  res.redirect('http://localhost:8080/users')

});


app.post('/users/create', function(req, res) {

  let user_obj = {
    name: req.body.name,
    pass: req.body.pass,
    email: req.body.email
  }

  console.log(user_obj);
 
  mongoose.connect('mongodb://localhost:27017/' + user_db,  { useNewUrlParser: true, useUnifiedTopology: true }).then(function() {

    console.log('Successfully connected');

    get_max = function() {
      var promise = new Promise(function(resolve, reject) {

          User.find({})
              .sort('-userid')  // give me the max
              .exec(function (err, result) {
      
            if (typeof(result) != "undefined" && !isObjectEmpty(result)) {
              // at least one result
              console.log("received one result from query");
              resolve(result[0]);
            } else {
              console.log("received 0 results from query");
              resolve(0);
            }
        });
      });
    
      return promise;
    };

    get_max().then(function(result) {

      let new_id = typeof(result) == "number" ?
        (result + 1) :
        (result.userid + 1);
      
      console.log("password:"  + user_obj.pass + ' ' + typeof(user_obj.pass));

      var newUser = new User({
        userid: new_id,
        name: user_obj.name,
        pass: passwordHash.generate(user_obj.pass),
        email: user_obj.email
      });

      newUser.save(function(err) {
        if (err) {
          throw err;
        }

        console.log('User successfully saved.');
      });

    });
    
  }, err => {
    console.log(err);
  })

  console.log("redirecting to users");
  res.redirect('http://localhost:8080/users')
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
