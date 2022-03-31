const nodemailer = require('nodemailer');
const day = new Date()

let transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    auth: {
        user: "35phamvantuan35@gmail.com",
        pass: "phamtuan"
    }
});

async function verifyMail(to, token) {
    await transport.sendMail({
        from: "demo project <35phamvantuan35@gmail.com>",
        to,
        subject: "Verify account",
        text: "Dear customer",
        html: `<h2><a href='http://localhost:5000/users/verify/${token}'>click here to verify account</a></h2>`
    })
}

async function registrationMail(to, course, id) {
    await transport.sendMail({
        from: "demo proejct <35phamvantuan35@gmail.com>",
        to,
        subject: "Registration to our class",
        html: `<h2>You've register for class: ${course}</h2><br><h3>Your registration ID: ${id}</h3>`
    })
}

async function reminder(to, course, startTime) {
    await transport.sendMail({
        from: "demo project <35phamvantuan35@gmail.com>",
        to,
        subject: "Attend to class",
        text: "Dear customer",
        html: `<h3>Class:<i> ${course}</></h3><br/>
                <h4>Will start at ${startTime} - ${day.getDate()}/${day.getMonth()}/${day.getFullYear()}</h4><br/>
                <h4 style='color:red;'>Don't forget to attend</h4>`
    })
}


module.exports = { verifyMail, registrationMail, reminder };