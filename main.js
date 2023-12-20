require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const URI = process.env.DB_URI;
// const URI = 'mongodb://localhost:27017/node_crud';
// DATABASE CONNECTION
mongoose.connect(URI);

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to the database"));

// mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
// .then(() => {
//     console.log('Connected to MongoDB');
// })
// .catch((error) => {
//     console.error('Error connecting to MongoDB:', error);
// });


//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended:false }));

app.use(session ({
  secret:'my secret key',
  saveUninitialized: true,
  resave:false,
}))

// Storing session information/message
app.use((req, res, next) =>{
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
})

app.use(express.static("uploads"));

// SET TEMPLATE ENGINE
app.set('view engine', 'ejs');

// Route Prefix
app.use("",require("./routes/routes"));
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
