const express = require("express");
const app = express();
const path = require("path");
const engine = require("ejs-mate");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ExpressError = require("./utilities/ExpressError");
const { validateLoggedIn } = require("./utilities/middleware/checkValidations");
const User = require("./models/User");
const session = require("express-session");
const postRoutes = require("./routes/posts");
const authRoutes = require("./routes/authenticate");
const userRoutes = require("./routes/user");

mongoose.connect("mongodb://localhost:27017/poster", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.engine("ejs", engine);

app.use(
  session({
    secret: "notagoodsecrettbh",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
app.use(async (req, res, next) => {
  if (req.session.user_id) {
    const { username } = await User.findOne({ _id: req.session.user_id });
    res.locals.username = username;
  } else {
    res.locals.username = null;
  }
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/", authRoutes);
app.use("/posts", postRoutes);
app.use("/user", userRoutes);

app.all("*", validateLoggedIn, (req, res, next) => {
  next(new ExpressError("Page not found!", 404));
});

app.use((err, req, res, next) => {
  const { message = "Something went wrong!", status = 500 } = err;
  res.render("error", { message, status });
});

app.listen(3000, () => {
  console.log("Listening on Port 3000!");
});
