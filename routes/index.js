const express = require('express')
const router = express.Router()
const conn = require('../db/conn')

router.get('/adicionar', (req, res) => {
    res.render('adicionar', {layout: 'main', notValidated: false});
})

router.get('/:nome', (req, res) => {
    const nome = req.params.nome
    const query = `SELECT * FROM CONTATOS WHERE ?? = ?`
    const data = ['nome', nome]
    conn.query(query, data, (err, data) => {
        if (data.length == 0){
            res.status(404).render('notFound', {layout: false});
            return
        }
        const contato = data[0]
        res.render('editarcontato', {layout: 'main', contato, notValidated: false});
    })
})

router.post('/buscarContato', (req, res) => {
    const keyWord = req.body.keyword
    const query = `SELECT * FROM CONTATOS WHERE ?? = ? OR ?? = ? `
    const data = ['nome', keyWord, 'telefone', keyWord]
    conn.query(query, data, (err, data) => {
        if(err){
            console.log(err)
            return
        }
        const contatos = data
        var noContacts = data.length == 0 ? true : false;
        res.render('home', {layout: 'main', contatos, noContacts});
    })

})

router.post('/editarContato', (req, res) => {
    const nome = req.body.nome
    const sobrenome = req.body.sobrenome || ''
    const telefone = req.body.telefone
    const email = req.body.email || ''
    const id = req.body.id
    if (nome == '' || telefone === ''){
        var contato = {
            nome: nome,
            sobrenome: sobrenome, 
            telefone: telefone,
            email: email,
            id: id
        }
        res.render('editarcontato', {layout: 'main', contato, notValidated: true});
        return
    }
    const query = `UPDATE CONTATOS SET ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?`
    const data = ['nome', nome, 'sobrenome', sobrenome, 'telefone', telefone, 'email', email, 'id', id]
    conn.query(query, data, (err) => {
        if(err){
            console.log(err)
            return
        }
        res.redirect('/')
        
    })
})

router.post('/adicionar', (req, res) => {
    const nome = req.body.nome
    const sobrenome = req.body.sobrenome || ''
    const telefone = req.body.telefone
    const email = req.body.email || ''
    if (nome == '' || telefone === ''){
        res.render('adicionar', {layout: 'main', notValidated: true});
        return
    }
    const query = `INSERT INTO CONTATOS (??, ??, ??, ??) 
                   VALUES (?, ?, ?, ?)`
    const data = ['nome', 'sobrenome', 'telefone', 'email', nome, sobrenome, telefone, email]
    conn.query(query, data, (err) => {
        if(err){
            console.log(err)
            return
        }
        res.redirect('/')
    })
})

router.post('/deletarContato/:id', (req, res) => {
    const id = req.params.id
    const query = `DELETE FROM CONTATOS WHERE ?? = ?`
    const data = ['id', id]
    conn.query(query, data)
    res.redirect('/')
})

module.exports = router