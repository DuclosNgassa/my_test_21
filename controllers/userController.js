const User = require('../models/User');
const auth = require('../controllers/authenticationController');

//Insert User
exports.create = async function (req, res, next) {
    const {name, email, phone_number, device_token, deviceid, created_at, rating, user_status} = req.body;
    try {
        let newUser = await User.create({
            name,
            email,
            phone_number,
            device_token,
            deviceid,
            created_at,
            rating: 5,
            user_status: 'active'
        }, {
            fields: ["name", "email", "phone_number", "device_token", "deviceid", "created_at", "rating", "user_status"]
        });
        if (newUser) {
            //Create a Token
            const token = auth.createToken(newUser.id);
            res.header('auth-token', token);
            res.send({
                result: 'ok',
                token: token,
                data: newUser
            });
        } else {
            res.send({
                result: 'failed',
                data: {},
                message: `Insert a new User failed. Error: ${error}`
            });
        }
    } catch (error) {
        res.send({
            result: 'failed',
            data: {},
            message: `Insert a new User failed. Error: ${error}`
        });
    }
};

//Query all Users from DB
exports.readAll = async function (req, res, next) {
    try {
        await User.findAll({
            attributes: ['id', 'name', 'email', 'phone_number', 'device_token', 'deviceid', 'created_at', 'rating', 'user_status'],
        }).then(users => {
            res.json({
                result: 'ok',
                data: users,
                length: users.length,
                message: "Query list of Users successfully"
            });
        });
    } catch (error) {
        res.json({
            result: 'failed',
            data: [],
            length: 0,
            message: `Query list of Users failed. Error ${error}`
        });
    }
};

//Query all active Users from DB
exports.readAllActive = async function (req, res, next) {
    try {
        await User.findAll({
            attributes: ['id', 'name', 'email', 'phone_number', 'device_token', 'deviceid', 'created_at', 'rating', 'user_status'],
            where: {
                user_status: 'active'
            }
        }).then(users => {
            res.json({
                result: 'ok',
                data: users,
                length: users.length,
                message: "Query list of active Users successfully"
            });
        });
    } catch (error) {
        res.json({
            result: 'failed',
            data: [],
            length: 0,
            message: `Query list of active Users failed. Error ${error}`
        });
    }
};

//Query all blocked Users from DB
exports.readAllBlocked = async function (req, res, next) {
    try {
        await User.findAll({
            attributes: ['id', 'name', 'email', 'phone_number', 'device_token', 'deviceid', 'created_at', 'rating', 'user_status'],
            where: {
                user_status: 'blocked'
            }
        }).then(users => {
            res.json({
                result: 'ok',
                data: users,
                length: users.length,
                message: "Query list of blocked Users successfully"
            });
        });
    } catch (error) {
        res.json({
            result: 'failed',
            data: [],
            length: 0,
            message: `Query list of blocked Users failed. Error ${error}`
        });
    }
};

//Query User by given id
exports.findById = async function (req, res, next) {
    const {id} = req.params;
    try {
        await User.findOne({
            attributes: ['id', 'name', 'email', 'phone_number', 'device_token', 'deviceid', 'created_at', 'rating', 'user_status'],
            where: {
                id: id
            },
        }).then(user => {
            res.json({
                result: 'ok',
                data: user,
                message: "Query User by email successfully"
            });
        });
    } catch (error) {
        res.json({
            result: 'failed',
            data: {},
            message: `Query User by id failed. Error ${error}`
        });
    }
};

exports.findbyEmail = async function (req, res, next) {
    const {email} = req.params;
    try {
        await User.findOne({
            attributes: ['id', 'name', 'email', 'phone_number', 'device_token', 'deviceid', 'created_at', 'rating', 'user_status'],
            where: {
                email: email
            },
        }).then(user => {
            if (user) {
                const token = auth.createToken(user.id);
                res.json({
                    result: 'ok',
                    data: user,
                    token: token,
                    message: "Query User by email successfully"
                });
            } else {
                res.json({
                    result: 'ok',
                    data: user,
                    message: "Query User by email successfully"
                });
            }
        });
    } catch (error) {
        res.json({
            result: 'failed',
            data: null,
            message: `Query User by email failed. Error ${error}`
        });
    }
};

exports.findbyDeviceToken = async function (req, res, next) {
    const {device_token} = req.params;
    try {
        await User.findOne({
            attributes: ['id', 'name', 'email', 'phone_number', 'device_token', 'deviceid', 'created_at', 'rating', 'user_status'],
            where: {
                device_token: device_token
            },
        }).then(user => {
            res.json({
                result: 'ok',
                data: user,
                message: "Query User by email successfully"
            });
        });
    } catch (error) {
        res.json({
            result: 'failed',
            data: null,
            message: `Query User by email failed. Error ${error}`
        });
    }
};

//Update User
exports.update = async function (req, res, next) {
    const {id} = req.params;
    const {name, email, phone_number, device_token, deviceid, created_at, rating, user_status} = req.body;
    try {
        await User.findOne({
            attributes: ['id', 'name', 'email', 'phone_number', 'device_token', 'deviceid', 'created_at', 'rating', 'user_status'],
            where: {
                id
            }
        }).then(async user => {
            await user.update({
                name: name ? name : user.name,
                email: email ? email : user.email,
                phone_number: phone_number ? phone_number : user.phone_number,
                device_token: device_token ? device_token : user.device_token,
                deviceid: deviceid ? deviceid : user.deviceid,
                created_at: created_at ? created_at : user.created_at,
                rating: rating ? rating : user.rating,
                user_status: user_status ? user_status : user.user_status,
            }).then(user => {
                const token = auth.createToken(user.id);
                res.json({
                    result: 'ok',
                    token: token,
                    data: user,
                    message: 'Update user successfully'
                });
            });
        });

    } catch (error) {
        res.json({
            result: 'failed',
            data: null,
            message: `Cannot find user to update. Error: ${error}`
        });
    }
};

//Delete a User by id
exports.delete = async function (req, res, next) {
    const {id} = req.params;
    try {
        await User.destroy({
            where: {
                id
            }
        }).then(numberOfdeletedRows => {
            res.json({
                result: 'ok',
                message: 'Delete a User by id successfully',
                count: numberOfdeletedRows
            });
        });
    } catch (error) {
        res.json({
            result: 'failed',
            message: `Delete a User by id failed. Error ${error}`,
            count: 0
        });
    }
};

//Delete a User by email
exports.deleteByEmail = async function (req, res, next) {
    const {email} = req.params;
    try {
        await User.destroy({
            where: {
                email
            }
        }).then(numberOfdeletedRows => {
            res.json({
                result: 'ok',
                message: 'Delete a User by email successfully',
                count: numberOfdeletedRows
            });
        });
    } catch (error) {
        res.json({
            result: 'failed',
            message: `Delete a User by email failed. Error ${error}`,
            count: 0
        });
    }
};