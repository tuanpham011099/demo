const jwt = require("jsonwebtoken");
const { Admin, Client } = require("../models");

const auth = async(req, res, next) => {
    const headers = req.headers['authorization'];
    const token = headers && headers.split(' ')[1];
    if (!token) return res.status(401).json({ msg: "Not allow" });
    jwt.verify(token, process.env.SECRET, async(error, decoded) => {
        if (error) return res.status(403).json({ error });
        req.user = decoded;
        const user = await Client.findOne({ where: { id: decoded.id } });
        const admin = await Admin.findOne({ where: { id: decoded.id } });
        if (!user && !admin) return res.status(404).json({ msg: 'User not found!' })
        next();
    });

};
const isAdmin = (req, res, next) => {
    if (!req.user.admin)
        return res.status(401).json({ msg: "Not allow" });
    next();
}


module.exports = { auth, isAdmin }