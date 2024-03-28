import app from './app.js' 
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 8989
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


process.on('SIGINT', () => {
    console.log('Bye bye!')
    process.exit()
})