const models = require('../models');
const bcryptsjs = require('bcryptjs')
const jwt = require('jsonwebtoken');

function signUp(req, res) {
    // Check if a user with the provided email already exists in the database
    models.User.findOne({ where: { email: req.body.email } }).then(result => {
        if (result) {
            // If a user with the same email exists, return a 409 Conflict status
            res.status(409).json({
                message: "Email already exists!",
            });
        } else {
            // If no user with the provided email exists, continue with user creation

            // Generate a salt for password hashing
            bcryptsjs.genSalt(10, function (err, salt) {
                // Hash the user's password with the generated salt
                bcryptsjs.hash(req.body.password, salt, function (err, hash) {
                    const user = {
                        name: req.body.name,
                        email: req.body.email,
                        password: hash, // Store the hashed password in the database
                    };

                    // Create a new user record in the database
                    models.User.create(user).then(result => {
                        // Return a 201 Created status if user creation is successful
                        res.status(201).json({
                            message: "User Created Successfully",
                        });
                    }).catch(error => {
                        // Return a 500 Internal Server Error status if there's an issue with user creation
                        res.status(500).json({
                            message: "Something Went wrong!",
                        });
                    });

                });
            });
        }
    }).catch(error => {
        // Return a 500 Internal Server Error status if there's an issue with the database query
        res.status(500).json({
            message: "Something Went wrong!",
        });
    });
}

function login(req, res) {
    // Check if a user with the provided email exists in the database
    models.User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user === null) {
            // If no user with the provided email exists, return a 401 Unauthorized status
            res.status(401).json({
                message: "Invalid credentials!",
            });
        } else {
            // If a user with the provided email exists, compare the provided password with the stored hashed password
            bcryptsjs.compare(req.body.password, user.password, function (err, result) {
                if (result) {
                    // If the password is correct, generate a JWT token for the user
                    const token = jwt.sign({
                        email: user.email,
                        userId: user.id, // Note the corrected reference to 'user.id' instead of 'User.id'
                    }, process.env.JWT_KEY, function (err, token) {
                        // Return a 200 OK status with the token for successful authentication
                        res.status(200).json({
                            message: "Authentication successful!",
                            token: token
                        });
                    });
                } else {
                    // If the password is incorrect, return a 401 Unauthorized status
                    res.status(401).json({
                        message: "Invalid Credentials!",
                    });
                }
            });
        }
    }).catch(error => {
        // Return a 500 Internal Server Error status if there's an issue with the database query
        res.status(500).json({
            message: "Something went wrong!",
        });
    });
}


module.exports ={
    signUp: signUp,
    login:login
}