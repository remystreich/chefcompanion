const express = require('express');
const sequelize = require('./database');
const session = require('express-session');
require('dotenv').config();
const userRouter = require('./routes/userRouter');

const app = express();

app.use(express.json())
app.use(express.static("./assets"))
app.use(session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true
}));

app.use(express.urlencoded({ extended: true }))
app.use(userRouter);

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


