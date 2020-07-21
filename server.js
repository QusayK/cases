const express = require('express')
const helmet = require('helmet')
const compression = require('compression')
require('express-async-error')
app = express()

// Middlewares
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(helmet())
app.use(compression())
//Error middleware
app.use(require('./middlewares/error'))

app.use('/api/user', require('./routes/user'))
app.use('/api/auth', require('./routes/auth'))

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server is running on port ${port}`))