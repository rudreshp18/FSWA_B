require('dotenv').config();
const express = require('express')
const DbConnect = require('./dbConnection')
const app = express()
const cors = require('cors');
const PORT = process.env.PORT
const authRoutes = require('./routes/authRoutes')
const feedRoutes = require('./routes/feedRoutes')
const verify = require('./controllers/verify');
const allowedOrigins = ['https://fswa-f-wyg9.vercel.app', 'http://localhost:5173'];

app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

DbConnect()

app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).send("<h1>Server Live!</h1>")
})

app.use('/feed', verify, feedRoutes)

app.use('/auth', authRoutes)

app.get('*', (req, res) => {
    res.status(404).send("YOU ARE LOST!")
})

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`)
})