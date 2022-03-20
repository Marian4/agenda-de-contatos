const express = require('express')
const exphbs = require('express-handlebars')
const conn = require('./db/conn')
const app = express()
const routes = require('./routes')
const PORT = 3000;
const favicon = require('serve-favicon')

const hbs = exphbs.create({
    partialsDir: ['views/partials']
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.use(favicon(__dirname + '/public/img/favicon.ico'));

app.use(express.static('public'))

app.use(express.urlencoded({
    extended: true
}))

app.use(express.json())

app.use('/', routes)

app.get('/', (req, res) => {
    const query = 'SELECT * FROM CONTATOS'
    const countQuery = 'SELECT COUNT(id) FROM CONTATOS'
    var count;
    conn.query(countQuery, (err, data) => {
        count = data[0]['COUNT(id)']
    })
    conn.query(query, (err, data) => {
        if(err){
            console.log(err)
            return
        }
        const contatos = data
        res.render('home', {layout: 'main', contatos, count});
    })
})

app.use((req, res, next) => {
    res.status(404).render('notFound', {layout: false})
})

app.listen(PORT, () => {
    console.log("servidor rodando na porta", PORT)
})