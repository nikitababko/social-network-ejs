const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

exports.sendVerificationEmail = (data) => {
    const { email, _id, username } = data;

    const token = jwt.sign(
        {
            email,
            _id,
        },
        process.env.JWT_KEY,
        {
            expiresIn: "30m",
        }
    );

    // config for mailserver and mail, input your data
    const config = {
        //    ...
    };

    const sendMail = async ({ mailserver, mail }) => {
        // create a nodemailer transporter using smtp
        let transporter = nodemailer.createTransport(mailserver);

        transporter.use(
            "compile",
            hbs({
                viewEngine: {
                    partialsDir: "./emailViews/",
                    defaultLayout: "",
                },
                viewPath: "./emailViews/",
                extName: ".hbs",
            })
        );

        // send mail using transporter
        await transporter.sendMail(mail);
    };

    sendMail(config).catch((err) => console.log(err));
};
