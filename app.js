const express = require('express');
const sequelize = require('./database');
const session = require('express-session');
require('dotenv').config();
const userRouter = require('./routes/userRouter');
const recipeRouter = require('./routes/recipeRouter');

const app = express();

app.use(express.json())
app.use(express.static("./assets"))
app.use(express.static("./node_modules/preline"))
app.use(session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true
}));

app.use(function(req, res, next) {
    req.session.userId =   1;
    next()
})

app.use(express.urlencoded({ extended: true }))
app.use(userRouter);
app.use(recipeRouter);

sequelize.authenticate()
  .then(() => {
    console.log('Connecté à la base');
  })
  .catch(err => {
    console.error( err );
  });



app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log(`connecté au port ${process.env.PORT}`);
    }
})


