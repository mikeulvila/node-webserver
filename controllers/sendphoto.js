'use strict'

// send photo page
module.exports.index = (req, res) => {
  res.render('sendphoto');
};

module.exports.newPhoto = (req,res) => {
  console.log(req.body, req.file);
  imgur.uploadFile(req.file.path)
    .then(function (json) {
        const imgurLink = json.data.link;
        db.collection('images').insertOne({link: imgurLink}, (err, doc) => {
          if (err) throw err;

          console.log('Saved Imgur link to database');
        });

        //delete the uploaded file from local storage
        fs.unlink(req.file.path, () => {
          console.log('Removed file from tmp/uploads.');
          res.send('<h1>Thansk for sending your photo');
        });
    })
    .catch(function (err) {
        console.error('IMGUR ERROR', err.message);
    });
};
