const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const FollowingSchema = new mongoose.Schema({
    //  ....
});

module.exports = mongoose.model("Following", FollowingSchema);
