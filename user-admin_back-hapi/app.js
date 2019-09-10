
'use strict';

const Hapi = require('@hapi/hapi');
const passwordHash = require('password-hash');
const User = require('./schemas/user_schema.js');
const mongoose = require('mongoose');

function isObjectEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function get_max() {
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

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {cors: true}
    });

    server.route([{
        method: 'GET',
        path:'/users',
        handler: function(request, h) { 
    
            console.log("/users");

            return new Promise(function(resolve, reject) {
                mongoose.connect('mongodb://localhost:27017/userdb',  { useNewUrlParser: true }).then(function() {
                        User.find({}).sort("userid")
                        .exec(function (err, result) {
                
                        if (typeof(result) != "undefined" && !isObjectEmpty(result)) {
                            // at least one result
                            console.log("received one result from query");
                            resolve(result);
                        } else {
                            console.log("received 0 results from query");
                            resolve({});
                        }
                    });
                });
            });
        }
    },
    {
        method: 'GET',
        path:'/users/{userid}',
        handler: function(request, h) { 
    
            console.log("/users/:userid [" + request.params.userid + "]");

            return new Promise(function(resolve, reject) {
                mongoose.connect('mongodb://localhost:27017/userdb',  { useNewUrlParser: true }).then(function() {
                    User.findOne({userid: request.params.userid}, function (err, result) {
                        if (isObjectEmpty(result)) {
                            resolve({});
                        } else {h
                            resolve(result);
                        }
                    });
                });
            });
        }
    },
    {
        method: 'POST',
        path:'/users/edit/{userId}',
        handler: function(request, h) { 
    
            console.log("/users/edit/:userid [" + request.params.userId + "]");

            mongoose.connect('mongodb://localhost:27017/userdb',  { useNewUrlParser: true }).then(function() {
                User.updateOne({ userid: parseInt(request.params.userId) }, {
                    name: request.payload.name,
                    pass: passwordHash.generate(request.payload.pass),
                    email: request.payload.email
                    }, {}, function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("update successfull");
                    }
                    });
            });

            return h.redirect('http://localhost:8080/users');
        }
    },
    {
        method: 'POST',
        path:'/users/create',
        handler: function(request, h) { 

            let user_obj = {
                name: request.payload.name,
                pass: request.payload.pass,
                email: request.payload.email
            }            
    
            console.log(user_obj);

            mongoose.connect('mongodb://localhost:27017/userdb',  { useNewUrlParser: true }).then(function() {

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
            });

            return h.redirect('http://localhost:8080/users');
        }
    },
    {
        method: 'POST',
        path:'/users/delete/{userId}',
        handler: function(request, h) { 
    
            console.log("/users/delete/:userid [" + request.params.userId + "]");

            mongoose.connect('mongodb://localhost:27017/userdb',  { useNewUrlParser: true }).then(function() {
                User.remove({ userid: parseInt(request.params.userId) }, function(err) {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log("update successfull");
                    }
                  });                
            });

            return h.redirect('http://localhost:8080/users');
        }
    }    
    ]);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
