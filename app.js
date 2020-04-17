require('dotenv').config()
const cors = require('cors');
const express = require('express');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended : true }));
app.use(express.json());

app.listen(process.env.PORT, () => console.log(`You're listening to radio ${process.env.PORT}`));
