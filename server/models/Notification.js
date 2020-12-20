const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const NotificationSchema = new mongoose.Schema({
    // ...
});

module.exports = mongoose.model("Notification", NotificationSchema);
