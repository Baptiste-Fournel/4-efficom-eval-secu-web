const User = require('./../model/user.schema.js');
const bcrypt = require('bcrypt');
const { id } = require('choco');
const jwt = require('jsonwebtoken');
const { where } = require('sequelize');

const login = async (req, res, next) => {
    const user = await User.findOne({where: {email: req.body.email},include: [Role]});
    if (!user) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }
    res.status(200).json({
        id: user.id,
        email: user.email,
        token: jwt.sign({
            id: user.id,
            roles: user.roles
        }, process.env.JWT_SECRET, {
            expiresIn: 86400 
        })
    });
}

const signIn = async (req,res,next) => {
    let member = await Role.findOne({ where: { id: req.body.roleId } });
    if (!member) {
        return res.status(404).json({ message: "Aucun rôle n'as pas été trouvé" });
    }
    try {
        let result = await User.create({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
            roles: [member.id]
        });
        res.status(201).json(result);
    } catch (e) {
        res.status(400).json({ error : "problème lors de la sécurisation du mot de passe" });
    }
}

module.exports = { login, signIn };