const express = require("express");
const router = express.Router();
const User = require("../models/users");
const multer = require("multer");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const fs = require("fs");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
}).single("image");

router.post("/add", upload, (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: req.file.filename,
  });
  user
    .save()
    .then(() => {
      req.session.message = {
        message: "User registered successfully",
        type: "success",
      };
      res.redirect("/");
    })
    .catch((error) => {
      res.json({
        message: err.message,
        type: "danger",
      });
    });
});
// Get all users
router.get("/", (req, res) => {
  // res.send("All Users");
  User.find()
    .exec()
    .then((users) => {
      res.render("index", {
        title: "Home Page",
        users,
      });
    })
    .catch((err) => {
      res.json({
        message: err.message,
      });
    });
});
router.get("/add", (req, res) => {
  // res.send("All Users");
  res.render("add_users", { title: "Add Users" });
});
// Edit an user route
// router.get("/edit/:id", (req, res) => {
//   let id = req.params.id;
//   User.findById(id).then((user) => {
//     if (user == null) res.redirect("/");
//     else
//       res.render("edit_users", {
//         title: "Edit User",
//         user,
//       });
//   })
//   .catch((error) => {
//     console.error('Error executing query:', error);
//   });
// });
router.get("/edit/:id", (req, res) => {
  let id = req.params.id;

  // Check if the id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.redirect("/");
  }

  // Convert the id to a ObjectId
  const objectId = new ObjectId(id);

  User.findById(objectId)
    .then((user) => {
      if (!user) {
        return res.redirect("/");
      } else {
        res.render("edit_users", {
          title: "Edit User",
          user: user,
        });
      }
    })
    .catch((error) => {
      console.error("Error executing query:", error);
      // Handle the error here
    });
});

//Update user route
router.post("/update/:id", upload, (req, res) => {
  let id = req.params.id;

  // Check if the id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.redirect("/");
  }

  // Convert the id to a ObjectId
  const objectId = new ObjectId(id);

  let new_image = "";
  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync("./uploads/" + req.body.old_image);
    } catch (error) {
      console.log(error);
    }
  } else {
    new_image = req.body.old_image;
  }
  User.findByIdAndUpdate(objectId, {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: new_image,
  })
    .then(() => {
      req.session.message = {
        type: "success",
        message: "User Updated successfully",
      };
      res.redirect("/");
    })
    .catch((err) => {
      res.json({
        message: err.message,
        type: "danger",
      });
      res.redirect("/");
    });
});
// delete user route
router.get("/delete/:id", function (req, res) {
  let id = req.params.id;

  // Check if the id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.redirect("/");
  }

  // Convert the id to a ObjectId
  const objectId = new ObjectId(id);
  User.findByIdAndDelete(objectId)
    .then((result) => {
      if(result.image != '') {
        try {
          fs.unlinkSync('./uploads/' + result.image);
        } catch (error) {
          console.log(error);
        }
      }
      req.session.message = {
        type: "info",
        message: "User Deleted successfully",
      };
      res.redirect("/");
    })
    .catch((err) => {
      res.json({
        message: err.message,
        type: "danger",
      });
      res.redirect("/");
    });
});
module.exports = router;
