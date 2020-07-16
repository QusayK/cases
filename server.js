const express = require('express')
const helmet = require('helmet')
const compression = require('compression')
app = express()

// Middlewares
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(helmet())
app.use(compression())

app.use('/user', require('./routes/user'))

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server is running on port ${port}`))