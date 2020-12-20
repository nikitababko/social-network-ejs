const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");
const Post = mongoose.model("Post");
const Following = mongoose.model("Following");
const Followers = mongoose.model("Follower");
const emailHandler = require("../handlers/emailHandler");

exports.activate = (req, res) => {
    if (process.env.ENABLE_SEND_EMAIL === "false") {
        return res.status(200).header("Content-Type", "text/html").send(`<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="theme-color" content="#000000">
        <style>
            .alert {
                padding: 20px;
                background-color: #f44336;
                color: white;
            }
        </style>
        <title>social-network</title>
    </head>
    
    <body>
        <div class="alert">
            <strong>Error!</strong> Disabled.
        </div>
    
    </body>
    
    </html>
  `);
    }

    try {
        const decoded = jwt.verify(req.params.token, process.env.JWT_KEY);

        User.findByIdAndUpdate(decoded._id, {
            activated: true,
        })
            .then(() => {
                return res.status(200).header("Content-Type", "text/html")
                    .send(`<!DOCTYPE html>
          <html lang="en">
      
          <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
              <meta name="theme-color" content="#000000">
              <style>
                  .alert {
                      padding: 20px;
                      background-color: #4CAF50;
                      color: white;
                  }
              </style>
              <title>social-network</title>
          </head>
          
          <body>
              <div class="alert">
                  <strong>Success!</strong> Account activated.
              </div>
          
          </body>
          
          </html>
          `);
            })
            .catch((err) => {
                console.log(err);
                return res.status(401).header("Content-Type", "text/html")
                    .send(`<!DOCTYPE html>
          <html lang="en">
          
          <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
              <meta name="theme-color" content="#000000">
              <style>
                  .alert {
                      padding: 20px;
                      background-color: #f44336;
                      color: white;
                  }
              </style>
              <title>social-network</title>
          </head>
          
          <body>
              <div class="alert">
                  <strong>Error!</strong> Something went wrong.
              </div>
          
          </body>
          
          </html>
        `);
            });
    } catch (err) {
        return res.status(401).header("Content-Type", "text/html").send(`<!DOCTYPE html>
      <html lang="en">
      
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
          <meta name="theme-color" content="#000000">
          <style>
              .alert {
                  padding: 20px;
                  background-color: #f44336;
                  color: white;
              }
          </style>
          <title>social-network</title>
      </head>
      
      <body>
          <div class="alert">
              <strong>Error!</strong> Invalid token.
          </div>
      
      </body>
      
      </html>
    `);
    }
};

exports.addUser = (req, res) => {
    User.findOne({
        $or: [{ email: req.body.email }, { username: req.body.username }],
    }).then((user) => {
        if (!user) {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({ error: err });
                } else {
                    const user = new User({
                        email: req.body.email,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        username: req.body.username,
                        password: hash,
                    });

                    // user.save()
                    //     .then((user) => {
                    //         const following = new Following({ user: user._id }).save();
                    //         const followers = new Followers({ user: user._id }).save();
                    //         Promise.all([following, followers]).then(() => {
                    //             if (process.env.ENABLE_SEND_EMAIL === "true") {
                    //                 emailHandler.sendVerificationEmail({
                    //                     email: user.email,
                    //                     _id: user._id,
                    //                     username: user.username,
                    //                 });
                    //                 return res.status(201).json({
                    //                     message: "Verify your email address",
                    //                 });
                    //             } else {
                    //                 return res.status(201).json({
                    //                     message: "Account created",
                    //                 });
                    //             }
                    //         });
                    //     })
                    //     .catch((err) => {
                    //         return res.status(500).json({ message: err.message });
                    //     });
                }
            });
        } else {
            if (user.username === req.body.username) {
                return res.status(409).json({
                    message: "Username exists",
                });
            }
            if (user.email === req.body.email) {
                return res.status(409).json({
                    message: "Email exists",
                });
            }
        }
    });
};

exports.resetPassword = (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ message: err });
        } else {
            User.findOneAndUpdate({ email: req.userData.email }, { password: hash })
                .then(() => {
                    return res.status(200).json({ message: "password reseted" });
                })
                .catch((err) => {
                    console.log(err.message);
                    return res.status(500).json({ message: err.message });
                });
        }
    });
};

exports.sendVerificationEmail = (req, res) => {
    User.findOne({ email: req.body.email, activated: false })
        .select("email username")
        .then((user) => {
            if (user) {
                emailHandler.sendVerificationEmail(user);
                return res.status(200).json({ message: "Email sent." });
            }
            return res.status(400).json({ message: "Something went wrong." });
        });
};

exports.sendforgotPasswordEmail = (req, res) => {
    console.log(req.body);
    User.findOne({ email: req.body.email })
        .select("email username")
        .then((user) => {
            if (user) {
                emailHandler.sendPasswordResetEmail(user);
                return res.status(200).json({ message: "Email sent." });
            }
            return res.status(400).json({ message: "Something went wrong." });
        });
};

exports.loginUser = (req, res, next) => {
    User.aggregate([
        {
            $match: {
                $or: [{ email: req.body.email }, { username: req.body.email }],
            },
        },
        {
            $project: {
                _id: 1,
                username: 1,
                email: 1,
                password: 1,
            },
        },
    ])
        .then((users) => {
            if (users.length < 1) {
                return res.status(400).json({
                    message: "Incorrect credentials.",
                });
            } else {
                bcrypt.compare(req.body.password, users[0].password, (err, result) => {
                    if (err) {
                        return res.status(400).json({
                            message: "Incorrect credentials.",
                        });
                    }
                    if (result) {
                        const token = jwt.sign(
                            {
                                email: users[0].email,
                                userId: users[0]._id,
                                username: users[0].username,
                            },
                            process.env.JWT_KEY,
                            {
                                expiresIn: "30m",
                            }
                        );

                        const user = {
                            _id: users[0]._id,
                            token: "Bearer " + token,
                        };
                        req.body.user = user;
                        next();
                        return;
                    }
                    return res.status(400).json({ message: "Incorrect credentials." });
                });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: err });
        });
};

exports.deleteUser = (req, res) => {
    User.remove({ _id: req.userData.userId }).then((result) => {
        res.status(200)
            .json({
                message: "User deleted",
            })
            .catch((err) => {
                res.status(500).json({
                    error: err,
                });
            });
    });
};
// //{ $match: { $or: [{ email: req.body.email }, { username: req.body.username }], _id: { $not: req.userData.username }} }
// exports.updateUser = (req, res) => {
//     User.find({
//         $and: [
//             { $or: [{ email: req.body.email }, { username: req.body.username }] },
//             { _id: { $ne: req.userData.userId } },
//         ],
//     })
//         .select("username email")
//         .then((user) => {
//
//             } else {
//
//                 )
//                     .select("firstName lastName username email bio")
//                     .then((user) => {
//                         const token = jwt.sign(
//                             {
//                                 email: user.email,
//                                 userId: user._id,
//                                 username: user.username,
//                             },
//                             process.env.JWT_KEY,
//                             {
//                                 expiresIn: "30m",
//                             }
//                         );

//                         return res.status(200).json({ user, token: "Bearer " + token });
//                     })
//                     .catch((err) => {
//                         console.log(err);
//                         return res.status(500).json({ message: err });
//                     });
//             }
//         });
// };

exports.getUserData = (req, res, next) => {
    let q;
    if (req.body.profilePage) {
        q = [
            { $match: { _id: mongoose.Types.ObjectId(req.userData.userId) } },
            {
                $lookup: {
                    from: "followings",
                    localField: "_id",
                    foreignField: "user",
                    as: "followings",
                },
            },
            {
                $lookup: {
                    from: "followers",
                    localField: "_id",
                    foreignField: "user",
                    as: "followers",
                },
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    username: 1,
                    email: 1,
                    bio: 1,
                },
            },
        ];
    } else {
        q = [
            { $match: { _id: mongoose.Types.ObjectId(req.userData.userId) } },
            {
                $lookup: {
                    from: "followings",
                    localField: "_id",
                    foreignField: "user",
                    as: "followings",
                },
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    username: 1,
                },
            },
        ];
    }

    // exports.sendUserData = (req, res) => {
    //     return res.status(200).json({ user: req.body.user });
    // };

    // exports.getUserProfileData = (req, res, next) => {
    //     if (req.userData.username === req.body.username) {
    //         return res.status(200).json({ user: { loggedInUser: true } });
    //     }

    //     User.aggregate([
    //         { $match: { username: req.body.username } },
    //         {
    //             $lookup: {
    //                 from: "followings",
    //                 localField: "_id",
    //                 foreignField: "user",
    //                 as: "followings",
    //             },
    //         },
    //         {
    //             $lookup: {
    //                 from: "followers",
    //                 localField: "_id",
    //                 foreignField: "user",
    //                 as: "followers",
    //             },
    //         },
    //         {
    //             $project: {
    //                 firstName: 1,
    //                 lastName: 1,
    //                 username: 1,
    //                 bio: 1,
    //                 profilePicture: 1,
    //                 followings: {
    //                     $size: { $arrayElemAt: ["$followings.following", 0] },
    //                 },
    //                 followers: {
    //                     $size: { $arrayElemAt: ["$followers.followers", 0] },
    //                 },
    //             },
    //         },
    //     ])
    //         .then((user) => {
    //             if (user.length < 1) {
    //                 return res.status(404).json({
    //                     message: "User not found",
    //                 });
    //             }

    //             Post.find({
    //                 author: mongoose.Types.ObjectId(user[0]._id),
    //             })
    //                 .countDocuments()
    //                 .then((postsCount) => {
    //                     let data = {
    //                         ...user[0],
    //                         postsCount,
    //                     };
    //                     req.body.user = data;
    //                     next();
    //                 })
    //                 .catch((err) => {
    //                     return res.status(500).json({
    //                         message: err.message,
    //                     });
    //                 });
    //         })
    //         .catch((err) => {
    //             return res.status(500).json({
    //                 message: err.message,
    //             });
    //         });
    // };
};
