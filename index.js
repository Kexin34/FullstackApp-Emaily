const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');   // to tell passport to use cookie
const bodyParser = require('body-parser');
const keys = require('./config/keys');
require('./models/User');
require('./models/Survey');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(                                // Set up cookie session 
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,   // 30 days
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());         // Tell passport to user cookie
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);


if (process.env.NODE_ENV === 'production') {
  // Express will serve up production assets like our main.js file, or main.css file
  // it look into client/build directory
  app.use(express.static('client/build'));

  // Express will serve up the index.html file if it doesn't recognize the route
  // assume the react-side of appliction will recognaize the route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });

}


const PORT = process.env.PORT || 5000;
app.listen(PORT);
