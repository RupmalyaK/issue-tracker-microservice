'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var expect      = require('chai').expect;
var cors        = require('cors');
var mongoClient = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
const xssFilter = require('x-xss-protection');

var apiRoutes         = require('./routes/api.js');
var fccTestingRoutes  = require('./routes/fcctesting.js');
var runner            = require('./test-runner');

var app = express();
app.use(xssFilter({ setOnOldIE: true }));
app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Sample front-end
app.route('/:project/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/issue.html');
  });

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);
const CONNECTION_STRING = process.env.DB; 
mongoClient.connect(CONNECTION_STRING, { "useNewUrlParser": true },  (err, client) => {
  
  if(err)
  {
    throw err; 
  }
  
  console.log("Connected to DB"); 
  const db = client.db("issueDB");
  
  apiRoutes(app , db , "issue");
  
  
  //404 Not Found Middleware
  app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//5b86b782fcf57c02c9d46266
//5b86c675a93d372687c74ab  
//db.collection("test").remove({}).then(doc => console.log(doc));
});


    



//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + process.env.PORT);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 3500);
  }
});

module.exports = app; //for testing

