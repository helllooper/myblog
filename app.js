var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var expressSanitizer = require("express-sanitizer");
var methodOverride = require("method-override");
var mongoose = require("mongoose");
var Article = require("./modules/articles");
var Video = require("./modules/videos");
var passport = require("passport");
var localStrategy = require("passport-local");
var User = require("./modules/users");
var expressSession = require("express-session");
var flash = require("connect-flash");
var multer = require('multer');
var cloudinary = require('cloudinary');
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
var stripe = require("stripe")("sk_test_pDkae3ldurSzJHkupw0oveI6");




// mongoose.connect("mongodb://localhost:27017/emad-blog", {useNewUrlParser: true});
mongoose.connect("mongodb://emadhassan:emad1987emad@ds111455.mlab.com:11455/emad-blog")
app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(expressSession({
    secret:"Emad's blog",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.set("view engine", "ejs");
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var limitOption =
    {fieldSize: 1000000000, fileSize: 1000000000};
var upload = multer({ storage: storage, limits:limitOption});
cloudinary.config({ 
  cloud_name: 'dp3abctzf', 
  api_key: "977678664345788", 
  api_secret: "diAlXivHgY5cQTaDl1H-JhdDCvc"
});




// db.products.update(
//   { _id: 100 },
//   { $set: { "details.make": "zzz" } }
// )


app.get("/", function(req, res){
   res.render("home"); 
});

app.get("/articles", function(req, res){
    Article.find({}, function(err, allArticles){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            
            res.render("articles", {articles: allArticles});
        }
    });
});

app.get("/articles/new", isEmad, function(req, res){
    res.render("new");
});

app.post("/articles", isEmad, upload.single("image"), function(req, res){
    
    
    //  var title =req.sanitize(req.body.title);
    //  var body = req.sanitize(req.body.body);
    //  var newArticle = {title:title , body:body};
    // Article.create(newArticle, function(err, article){
    //   if(err){
    //       console.log(err);
    //       req.flash("error", err.message);
    //       res.redirect("back");
    //   } 
    //   else{
    //       res.redirect("/articles");
    //   }
    // });
    
    // lhp6tsuvfeydcgfbr9d5
    
    cloudinary.v2.uploader.upload(req.file.path, {invalidate: true}, function(err, result) {
    if(err){
        console.log(err);
    }else {
          // add cloudinary url for the image to the campground object under image property
  req.body.image = result.secure_url;
  req.body.imageId = result.public_id;

  Article.create(req.body, function(err, article) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    res.redirect("/articles");
  });
    }

});

});

app.get("/articles/:id", function(req, res) {
    Article.findById(req.params.id, function(err, foundArticle){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            res.render("show", {article:foundArticle});
        }
    });
});

app.get("/articles/:id/edit", isEmad, function(req, res){
    Article.findById(req.params.id, function(err, foundArticle){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            res.render("edit", {article : foundArticle});
        }
    });
});

// app.put("/articles/:id", isEmad, function(req, res){
//     req.body.title = req.sanitize(req.body.title);
//     req.body.body = req.sanitize(req.body.body);
//     Article.findByIdAndUpdate(req.params.id, req.body, function(err, updatedArticle){
//         if(err){
//             console.log(err);
//             req.flash("error", err.message);
//             res.redirect("back");
//         }else{
//             res.redirect("/articles/" + req.params.id);
//         }
//     });
// });
// zeeksdq45tiwzvwzzoty

app.put("/articles/:id", isEmad,upload.single('image'), function(req, res){
    Article.findById(req.params.id, async function(err, article){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if (req.file) {
              try {
                  await cloudinary.v2.uploader.destroy(article.imageId, {invalidate: true});
                  var result = await cloudinary.v2.uploader.upload(req.file.path, {invalidate: true});
                  article.imageId = result.public_id;
                  article.image = result.secure_url;
              } catch(err) {
                  req.flash("error", err.message);
                  return res.redirect("back");
              }
            }
            article.title =  req.sanitize(req.body.title);
            article.body = req.sanitize(req.body.body);
            article.save();
            req.flash("success","Successfully Updated!");
            res.redirect("/articles/" + article._id);
        }
    });
});
// app.delete("/articles/:id",isEmad , function(req, res){
   
//   Article.findByIdAndRemove(req.params.id, function(err){
//       if(err){
//           console.log(err);
//           req.flash("error", err.message);
//           res.redirect("back");
//       }
//       else {
//           res.redirect("/articles");
//       }
//   });
// });

app.delete('/articles/:id',isEmad, function(req, res) {
  Article.findById(req.params.id, async function(err, article) {
    if(err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    try {
        await cloudinary.v2.uploader.destroy(article.imageId, {invalidate:true});
        article.remove();
        req.flash('success', 'Article deleted successfully!');
        res.redirect('/articles');
    } catch(err) {
        if(err) {
          req.flash("error", err.message);
          return res.redirect("back");
        }
    }
  });
});

app.post("/articles/:id",isLoggedIn ,  function(req, res){
    req.body.text = req.sanitize(req.body.text);
   Article.findById(req.params.id, function(err, article){
       if(err){
           console.log(err);
           req.flash("error", err.message);
           res.redirect("back");
       }
       else{
         console.log(req.user);
         req.body.user = req.user.username;
         article.comments.push(req.body);
                article.save();
                req.flash("success", "Comment added");
                res.redirect("/articles/" + req.params.id);
         
         }
         });  
       }
   ); 


app.get("/register", function(req, res){
   res.render("register"); 
});

app.post("/register", function(req, res){
    User.register(User({username:req.body.username, email:req.body.email}), req.body.password, function(err, account){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/register");
        }
        else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Signed up successfully");
                res.redirect("/");
            });
        }
    });
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login",passport.authenticate('local', { 
    successRedirect: '/',
    failureRedirect: '/login',
    successFlash: "You are logged in successfully",
    failureFlash: true}), function(req, res){
    
});

app.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out");
   res.redirect("/");
});

app.delete("/articles/:id/:commentId", isEmad, function(req, res){
    Article.findById(req.params.id, function(err, foundArticle){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            foundArticle.comments.id(req.params.commentId).remove();
            foundArticle.save(function(err){
                if(err){
                    console.log(err);
                    req.flash("error", err.message);
                    res.redirect("back");
                }
            });
            req.flash("success", "Comment deleted");
            res.redirect("/articles/" + req.params.id);

            }
            });
    });
    
    app.get("/login/email", function(req, res){
        res.render("email");
    });
    
    app.post('/login/email', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (err || !user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/login/email');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'emadsblog@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'emadsblog@gmail.com',
        subject: 'Emads-Blog/Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/login/email');
  });
});
    
    app.get("/reset/:token" , function(req, res){
         User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (err || !user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/login/email');
    }
    res.render('newPassword', {token: req.params.token});
  });
    });
    
    app.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (err || !user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          });
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'emadsblog@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'emadsblog@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
      if(err){
          console.log(err);
      }else{
             res.redirect('/articles');
          
      }
  });
});

app.get("/videos", function(req, res){
    Video.find({}, function(err, allVideos){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            
            res.render("videos", {videos: allVideos});
        }
    });
});

app.get("/videos/:id/edit", isEmad, function(req, res){
    Video.findById(req.params.id, function(err, foundVideo){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            res.render("editVideo", {video : foundVideo});
        }
    });
});

app.put("/videos/:id", isEmad,upload.single('url'), function(req, res){
    Video.findById(req.params.id, async function(err, video){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if (req.file) {
              try {
                  await cloudinary.v2.uploader.destroy(video.videoId, {invalidate: true});
                  var result = await cloudinary.v2.uploader.upload(req.file.path, {resource_type:"video", invalidate: true, });
                  video.videoId = result.public_id;
                  video.url = result.secure_url;
              } catch(err) {
                  req.flash("error", err.message);
                  return res.redirect("back");
              }
            }
            video.title =  req.sanitize(req.body.title);
            video.body = req.sanitize(req.body.body);
            video.save();
            req.flash("success","Successfully Updated!");
            res.redirect("/videos");
        }
    });
});

app.delete('/videos/:id',isEmad, function(req, res) {
  Video.findById(req.params.id, async function(err, video) {
    if(err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    try {
        await cloudinary.v2.uploader.destroy(video.videoId, {invalidate:true});
        video.remove();
        req.flash('success', 'Video deleted successfully!');
        res.redirect('/videos');
    } catch(err) {
        if(err) {
          req.flash("error", err.message);
          return res.redirect("back");
        }
    }
  });
});

app.get("/videos/newVideo", isEmad, function(req, res){
   res.render("newVideo");
});

app.post("/videos", isEmad,upload.single('url'),function(req, res){
       cloudinary.v2.uploader.upload(req.file.path, {resource_type:"video", invalidate: true}, function(err, result) {
    if(err){
        req.flash('error', err.message);
        console.log(err);
    }else {
          // add cloudinary url for the image to the campground object under image property
  req.body.url = result.secure_url;
  req.body.videoId = result.public_id;

  Video.create(req.body, function(err, video) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    res.redirect("/videos");
  });
    }

}); 
});

app.get("/about", function(req, res){
    res.render("about");
});

app.get("/contact", function(req, res){
   res.render("contact"); 
});

app.post("/contact", function(req, res){
    var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'emadsblog@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: "helllooper@gmail.com",
        from: 'emadsblog@gmail.com',
        subject: req.body.title,
        text: req.body.message + "\n\n" + req.body.email,
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        if(err){
            console.log(err);
            req.flash(err.message);
            res.redirect("back");
        }
        else {
            console.log('mail sent');
            req.flash('Contact has been sent');
            res.redirect("/");
        }
        
        
      });
});

function isLoggedIn (req, res, next){
 if(req.isAuthenticated()){
     return next();
 }
 req.flash("error", "You must be logged in");
 res.redirect("/login");
}

function isEmad (req, res, next){
    if(res.locals.currentUser && res.locals.currentUser.username === "Emad"){
        return next();
    }
    else {
        req.flash("error", "Unauthorized");
        res.redirect("back");
    }
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
});