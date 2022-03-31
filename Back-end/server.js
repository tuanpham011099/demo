const app = require("./index");
const CJ = require("./utils/cj");
const { sequelize } = require('./models');
const cron = require('node-cron');

cron.schedule('* 0 0 * * *', CJ)


app.listen(process.env.PORT || 5000, async() => {
    try {
        await sequelize.authenticate();
    } catch (error) {
        console.log(error);
    }
    console.log("App is running");
})