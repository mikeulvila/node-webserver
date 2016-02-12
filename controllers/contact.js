'use strict'

module.exports.index = (req, res) => {
  res.render('contact');
};

module.exports.newContact = (req, res) => {
  // from Contact mongoose Schema
  const contactData = new Contact({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  });

  contactData.save((err, doc) => {
      if (err) throw err;

      console.log(doc);
      res.send(`<h1>Thanks for contacting us ${contactData.name}`);

  });
};
