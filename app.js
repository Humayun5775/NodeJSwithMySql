const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const postsRoute = require('./routes/post');
const userRoute = require('./routes/user');

app.use(bodyParser.json());

app.use("/post", postsRoute)
app.use("/user", userRoute);


module.exports = app;
