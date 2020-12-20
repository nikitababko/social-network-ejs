const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const FollowerSchema = new mongoose.Schema({
    // ...........
});

module.exports = mongoose.model("Follower", FollowerSchema);
