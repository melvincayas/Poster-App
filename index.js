if (process.env.NODE_ENV === "production") {
	require("dotenv").config();
}

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
const searchRoutes = require("./routes/search");
const MongoStore = require("connect-mongo");
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/poster";

mongoose
	.connect(dbUrl, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then(() => {
		console.log("Mongo DB connected!");
	})
	.catch(err => {
		console.log(err);
	});

app.engine("ejs", engine);

const secret = process.env.SECRET || "thisshouldbeabettersecret";

const sessionConfig = {
	name: "session",
	secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
	store: MongoStore.create({
		mongoUrl: dbUrl,
		secret,
		touchAfter: 24 * 60 * 60,
	}),
};

app.use(session(sessionConfig));
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
		const { username, viewedNotifications } = await User.findOne({
			_id: req.session.user_id,
		});

		res.locals.username = username;
		res.locals.viewedNotifications = viewedNotifications;
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
app.use("/search", searchRoutes);
app.use("/posts", postRoutes);
app.use("/user", userRoutes);

app.all("*", validateLoggedIn, (req, res, next) => {
	next(new ExpressError("Page not found!", 404));
});

app.use((err, req, res, next) => {
	const { message = "Something went wrong!", status = 500 } = err;
	res.render("error", { message, status });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Listening on Port ${port}!`);
});
