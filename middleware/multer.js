"use strict"
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase();
       let name_ = name.replace(/ /g,"-");
        cb(null,name_,function(err,succ) {
          if(err)
          throw err;
        });
      }
});
const upload = multer({ storage: storage });

module.exports = upload;
