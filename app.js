require('dotenv').config()
const cors = require('cors');
const express = require('express');
const router = require('./routes')
const errorHandler = require('./middlewares/errorHandler')

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended : true }));
app.use(express.json());

app.use(router)
app.use(errorHandler)

app.listen(process.env.PORT, () => console.log(`You're listening to radio ${process.env.PORT}`));
