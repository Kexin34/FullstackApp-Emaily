const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = (app) => {

  app.get('/api/surveys/thanks', (req, res) => {
    res.send('Thanks for voting!');
  })

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients
        .split(',')
        .map((email) => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now(),
    });

    // Great place to send an email!
    const mailer = new Mailer(survey, surveyTemplate(survey));

    try {
      await mailer.send();  //这个是async，上面的route handler也是async
      await survey.save();  // 数据库
      req.user.credits -= 1;
      const user = await req.user.save();

      res.send(user); //send back the updated user model,so header component will update
    } catch (err) {
      res.status(422).send(err);
;    }
  });
};
