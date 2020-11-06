const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

// Take the token got from front-end server,
// and exchange it for an actual billing to the user's credit card 
module.exports = (app) => {
  app.post('/api/stripe', requireLogin, async (req, res) => {
    
    // Actual billing with stripe
    const charge = await stripe.charges.create({    
      amount: 500,
      currency: 'usd',
      description: '$5 for 5 credits',
      source: req.body.id,
    });

    // Update user credit in database
    req.user.credits += 5;
    const user = await req.user.save();

    res.send(user);
  });
};
