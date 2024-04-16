import app from './app.js'
import dotenv from 'dotenv';

const PORT = 8989
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


process.on('SIGINT', () => {
    console.log('Bye bye!')
    process.exit()
})