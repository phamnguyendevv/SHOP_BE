import app from './app.js'

const PORT = 8989
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


process.on('SIGINT', () => {
    console.log('Bye bye!')
    process.exit()
})