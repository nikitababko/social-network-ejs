const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const logger = require("morgan");
const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config({ path: "variables.env" });

// connect to DB
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on("error", (err) => {
    console.error(err.message);
});

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("autoIndex", false);

require("./models/User");

const app = express();

const userController = require("./controllers/userController");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // limit each IP to 200 requests per windowMs
});

const usersRouter = require("./routes/user");

app.use(helmet());
if (process.env.NODE_ENV === "production") {
    app.use(limiter);
    app.use(
        logger("common", {
            stream: fs.createWriteStream("./access.log", { flags: "a" }),
        })
    );
} else {
    app.use(logger("dev"));
}
app.use(express.static("public"));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/user/", usersRouter);

app.get("/auth/reset/password/:jwt", function (req, res) {
    return res.status(404).json({ message: "go to port 3000" });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    console.log(err);

    // render the error page
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message,
        },
    });
});

module.exports = app;
