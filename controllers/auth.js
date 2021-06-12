const User = require('../models').user;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if(!name) throw "User is required!";
        if(!email) throw "Email is required!";
        if(!password) throw "Password is required!";

        const newUser = await User.create({ name, email, password })
        if (newUser) {
            res.status(200).json({
                success: true,
                message: "User created successfully.",
                results: newUser
            });
        } else throw "User create failed!"
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) throw "Request missing email or password param!";

        let user = await User.findOne({ where: { email } });

        if(user?.email === email) {

            if(user.banned) throw "Your account has been disable! please contact support."

            const valid = await bcrypt.compare(password, user.password);

            if(valid) {

                // delete user.password;
                const { id, name, email, createdAt, updatedAt } = user

                // GENERATE TOKEN
                let token = jwt.sign({ id, email }, process.env.JWT_SECRET, {
                    expiresIn: '1d'
                });

                res.status(200).json({
                    success: true,
                    message: "Login successfully.",
                    results: { id, name, email, token, createdAt, updatedAt }
                });
            } else throw "Incorrect password!";
        } else throw "Invalid email!";

    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error });
    }
};


const deleteUser = async (req, res) => {

    try {
        if(!req.params.id) throw "Invalid id!";

        const user = await User.destroy({ where: { id: req.params.id } });

        if(user) {
            res.status(200).json({
                success: true,
                message: "User deleted succesfully.",
                results: { userId: req.params.id }
            });
        } else throw "Invalid user!"
        
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error });
    }
};

module.exports = {
    register,
    login,
    deleteUser
};
