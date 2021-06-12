const express = require("express")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const cors = require("cors")
const { readdirSync } = require("fs")
require("dotenv").config()

// app
const app = express();

// middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
      extended: false,
    })
);

// route with middlewares
readdirSync("./routes").map( (r) =>
    app.use("/api", require(`./routes/${r}`)
))

// Using port from .env file if not exist use port 8000
const PORT = process.env.PORT || 8000;

// start server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});