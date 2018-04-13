'use strict'

var express = require('express')
var path = require('path')
//var session = require('express-session')
var app = express()
var mysql = require('mysql')
var mime = require('mime-types')
var bodyParser = require('body-parser')
var argon2 = require('argon2')
var session = require('express-session') 
var mijnid = 1

require('dotenv').config({
    path: path.resolve('./', '.env')
}) 



var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

connection.connect()

app.set('view engine', 'ejs')
app.set('views', 'view')
app.use(express.static('static'))
app.use(express.static('static'))
    .use(bodyParser.urlencoded({
        extended: true
    }))
    .use(bodyParser.json())
app.get('/', index)
app.get('/eigenprofiel', eigenprofiel)
app.get('/matchen', matchen)
app.get('/registreren', registreren)
app.get('/:id', details)
app.get('/profielbewerken', profielbewerken)
app.post('/registrerenPost', add)
app.post('/lekkerToevoegen', lekkertoevoeg)
app.post('/log-in', login)
app.post('/bewerkprofiel', bewerkenprofiel)
app.post('./verwijderlekker', verwijderlekker)
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
}))
app.listen(7000)

console.log("Luistert naar LocalPort 7000")

function index(req, res) {
    var result = {
        errors: [],
        data: undefined
    }
    res.format({
        html: () => res.render('log-in.ejs', {})
    })
}

function eigenprofiel(req, res, next) {
    connection.query('SELECT * FROM gebruiker WHERE id= 1', done)
//    if (req.session.user) {
//        var email = req.session.user.email
//        connection.query('SELECT * FROM gebruiker WHERE gebruiker.email =?', email, done)
//
//
        function done(err, data) {
            res.render('eigenprofiel.ejs', {
                data: data
            })

        }
//    }

    //    var result = {
    //        errors: [],
    //        data: undefined
    //    }
    //    res.format({
    //        html: () => res.render('ingelogd.ejs', {
    //            data:data
    //        })
    //    })
}

function profielbewerken(req, res, next) {
    connection.query('SELECT * FROM gebruiker WHERE id= 1', done)

    function done(err, data) {
        if (err) {
            next(err)
        } else {
            res.render('profielbewerken.ejs', {
                data: data
            })
        }
    }
}

function verwijderlekker(req, res, next) {
    connection.query('UPDATE gebruiker SET lekker = NULL WHERE id = 1', done)

    function done(err) {
        if (err) {
            next(err)
        } else {
            res.redirect('/eigenprofiel')
        }
    }
}



function login(req, res, next) { // jim van de ven credits to
    var email = req.body.email
    var wachtwoord = req.body.wachtwoord

    if (!email || !wachtwoord) {
        res
            .status(400)
            .send('Emailadres of wachtwoord mist')
        return
    }
    connection.query('SELECT * FROM gebruiker WHERE email = ?', email, done)

    function done(err, data) {
        console.log(data + data[0])
        var user = data && data[0] // 
        if (err) {
            next(err)
        } else if (user) {
            argon2
                .verify(user.hash, wachtwoord)
                .then(onverify, next)
        } else {
            res
                .status(401)
                .send('Email bestaat niet')
        }

        function onverify(match) {
            if (match) {
//                req.session.user = {
//                    email: user.email
//                }
                res.redirect('/eigenprofiel')
            } else {
                res.status(401).send('Wachtwoord is incorrect')
            }
        }
    }

}





function matchen(req, res) {
    //    var result = {
    //        errors: [],
    //        data: undefined
    //    }
    //    res.format({
    //        html: () => res.render('matchen.ejs', Object.assign({}, result))
    //    })
    connection.query('SELECT * FROM gebruiker', done)

    function done(err, data) {
        if (err) {
            next(err)
        } else {
            res.render('matchen.ejs', {
                data: data
                //                gebruiker: req.session.gebruiker
            })
        }
    }
}

function details(req, res, next) {
    var id = req.params.id
    connection.query('SELECT * FROM gebruiker WHERE id = ?', id, done)


    function done(err, data) {
        if (err) {
            next(err)
        } else if (data.length === 0) {
            next()

        } else {
            res.render('details.ejs', {
                data: data
            })


        }
    }
}

function registreren(req, res) {
    //    if (req.session.gebruiker)
    var result = {
        errors: [],
        data: undefined
    }
    res.format({
        html: () => res.render('registreren.ejs', Object.assign({}, result))
    })
}

function lekkertoevoeg(req, res, next) {
    var lekker = req.body.lekker
    connection.query('UPDATE gebruiker SET lekker= CONCAT(lekker,?)  WHERE id =1', lekker, done)


    function done(err) {
        if (err) {
            next(err)
        } else {
            res.redirect('/eigenprofiel')
        }
    }

}

function bewerkenprofiel(req, res, next) {
    var vName = req.body.vName
    var geslacht = req.body.geslacht
    var geboortedatum = req.body.geboortedatum
    var woonplaats = req.body.woonplaats
    var email = req.body.email
    var id = req.session.user.id



    connection.query('UPDATE gebruiker SET ? WHERE id=1', [{ // insert met hash 
        vName: vName,
        geslacht: geslacht,
        geboortedatum: geboortedatum,
        woonplaats: woonplaats,
        email: email
    }, id],done)


    function done(err) {
        if (err) {
            next(err)
        } else {
            res.redirect('/eigenprofiel')
        }
    }
}


function add(req, res, next) {

    var vName = req.body.vName
    var geslacht = req.body.geslacht
    var geboortedatum = req.body.geboortedatum
    var woonplaats = req.body.woonplaats
    var email = req.body.email
    var lekker = req.body.lekker
    var nietlekker = req.body.nietlekker
    var lekkergerecht = req.body.lekkergerecht
    var nietlekkergerecht = req.body.nietlekkergerecht
    var wachtwoord = req.body.wachtwoord
    var wachtwoordbevestigen = req.body.wachtwoordbevestigen
    var min = 8
    var max = 160

    if (!email || !wachtwoord) { // wannneer er geen email of wachtwoord ingevuld is dan word de volgende if statement gestart
        res
            .status(400)
            .send("email of wachtwoord mist er")
        return
    }

    if (wachtwoord.length < min || wachtwoord.length > max) { // wanneer de wachtwoord input groter is dan max of kleiner is dan min 
        res
            .status(400)
            .send(`Wachtwoord moet tussen ${min} en ${max}`)
    }

    connection.query('SELECT * FROM gebruiker WHERE email = ?', email, done) // hier word er de vName uit de database gehaald

    function done(err, data) { // in deze functie word er gekeken of het email adres al in gebruik is
        if (err) {
            next(err)
        } else if (data.length !== 0) {
            res.status(409).send('Email is al in gebruik')
        } else {
            argon2.hash(wachtwoord).then(onhash, next) // van de wachtwoord word er een code gemaakt zodat je het niet kan ontcijferen
        }
    }

    function onhash(hash) {
        connection.query('INSERT INTO gebruiker SET ?', { // insert met hash 
            vName: vName,
            geslacht: geslacht,
            geboortedatum: geboortedatum,
            woonplaats: woonplaats,
            email: email,
            lekker: lekker,
            nietlekker: nietlekker,
            lekkergerecht: lekkergerecht,
            nietlekkergerecht: nietlekkergerecht,
            hash: hash
        }, oninsert)
    }

    function oninsert(err) {
        if (err) {
            next(err)
        } else {
//            req.session.user = {
//                email: email
//            }
            res.redirect('/eigenprofiel')
        }
    }
}
