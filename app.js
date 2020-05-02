const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var mysql = require('mysql')

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: "gestion d'inventaire"
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs');


var obj = {};
app.get('/', function (req, rep) {
    connection.query('SELECT p.*, f.nomfour, r.categorie FROM produit p JOIN fournisseur f ON p.id_foun = f.id JOIN rayon r ON p.id_rayon = r.id', function (err, result) {
        if (err) {
            throw err;
        } else {
            obj = {
                produits: result
            };
            rep.render('produits', obj);
        }
    });
})

app.get('/addfourn', function (req, rep) {
    rep.render('addfourn');
})

app.get('/addcat', function (req, rep) {
    rep.render('addcat');
})

app.get('/fournisseur', function (req, rep) {
    connection.query('SELECT * FROM fournisseur', function (err, result) {
        if (err) {
            throw err;
        } else {
            obj = {
                fournisseurs: result
            };
            rep.render('fournisseur', obj);
        }
    });
})

app.get('/rayon', function (req, rep) {
    connection.query('SELECT * FROM rayon', function (err, result) {
        if (err) {
            throw err;
        } else {
            obj = {
                rayons: result
            };
            rep.render('rayon', obj);
        }
    });
})


app.get('/addprod', function (req, rep) {
    connection.query('SELECT nomfour FROM fournisseur', function (err, result) {
        if (err) {
            throw err;
        } else {
            obj = {
                fournisseurs: result
            };

            connection.query('SELECT categorie FROM rayon', function (err, result) {
                if (err) {
                    throw err;
                } else {
                    obj.rayons = result;
                    rep.render('addprod', obj);
                    console.log(obj)
                }
            });
        }
    });


})




app.post('/addprod', function (req, res, next) {
    let id = null;
    let nom = req.body.nom;
    let quantite = req.body.quantite;
    let prix = req.body.prix;
    let fournisseur = req.body.four;
    let categorie = req.body.categ;
    let errors = false;





    if (!errors) {

        connection.query('SELECT id FROM fournisseur WHERE nomfour = ?', fournisseur, function (err, result) {
            if (err) {
                throw err;
            } else {

                fournisseur = result[0].id
                connection.query('SELECT id FROM rayon WHERE categorie= ?', categorie, function (err, result) {
                    if (err) {
                        throw err;
                    } else {

                        categorie = result[0].id

                        var form_produit = {
                            id: id,
                            nom: nom,
                            quantite: quantite,
                            prix: prix,
                            id_rayon: categorie,
                            id_foun: fournisseur
                        }
                        connection.query('INSERT INTO produit SET ?', form_produit, function (err, result) {
                            if (err) {
                                throw err;


                            } else {
                                res.redirect('/');
                            }
                        })
                    }
                });
            }
        });
    }
})


app.post('/addfourn', function (req, res, next) {

    let id = null;
    let nomfour = req.body.nomfour;
    let mail = req.body.mail;
    let tele = req.body.tele;

    let errors = false;

    if (!errors) {

        var form_fourn = {
            id: id,
            nomfour: nomfour,
            mail: mail,
            tele: tele

        }
        connection.query('INSERT INTO fournisseur SET ?', form_fourn, function (err, result) {
            if (err){
                throw err;


            } else {
                res.redirect('/addprod');
            }
        })
    }
})



app.post('/addcat', function (req, res, next) {

    let id = null;
    let categorie = req.body.categorie;


    let errors = false;



    if (!errors) {

        var form_cat = {
            id: id,
            categorie: categorie


        }
        connection.query('INSERT INTO rayon SET ?', form_cat, function (err, result) {
            if (err) {
                throw err;


            } else {
                res.redirect('/addprod');
            }
        })
    }
})










    app.get('/updateproduct/:id', function (req, rep, next) {

    let id = req.params.id

    connection.query("SELECT * FROM produit WHERE id = '" + id + "' ",(err,result) =>{
      if(!err){

        rep.render('updateprod', {test : result })


      }
      else {
        rep.send(err)

      }
    })

  })

  app.post('/updateproduct/:id',(req,res)=>{

    let id = req.params.id ;
    let nom = req.body.nom;
    let quantite = req.body.quantite;
    let prix = req.body.prix;



    connection.query("UPDATE produit SET nom = '" + nom + "', quantite = '" + quantite + "', prix = '" + prix + "' WHERE id = '" + id + "'",(err,result) =>{
      if(!err){
        res.redirect("/")
    }
    else{
      res.send(err)

    }

  })

  })



  app.get('/updatedepartment/:id', function(req,res){

    let depId = req.params.id

    connection.query("SELECT * FROM rayon WHERE id = '" + depId + "' ",(err,result) =>{
      if(!err){
        res.render('update department.ejs',{test : result})

      }
      else {
        res.send(err)
      }
    })

  })

  app.post('/updatedepartment/:id',(req,res)=>{

    let id = req.params.id ;
    let categorie = req.body.categorie;



    connection.query("UPDATE rayon SET categorie = '" + categorie + "' WHERE id = '" + id + "'",(err,result) =>{
      if(!err){
        res.redirect("/rayon")
    }
    else{
      res.send(err)

    }

  })

  })



  app.get('/updatefourni/:id', function(req,res){

    let fourId = req.params.id

    connection.query("SELECT * FROM fournisseur WHERE id = '" + fourId + "' ",(err,result) =>{
      if(!err){
        res.render('update fournisseur.ejs',{test : result})

      }
      else {
        res.send(err)
      }
    })

  })

  app.post('/updatefourni/:id',(req,res)=>{

    let id = req.params.id ;
    let nomfour = req.body.nomfour;
    let mail = req.body.mail;
    let tele = req.body.tele;



    connection.query("UPDATE fournisseur SET nomfour = '" + nomfour + "', mail = '" + mail + "', tele = '" + tele + "' WHERE id = '" + id + "'",(err,result) =>{
      if(!err){
        res.redirect("/fournisseur")
    }
    else{
      res.send(err)

    }

  })

  })



app.get('/delete/(:id)', function (req, res, next) {
    let id = req.params.id;
    connection.query('DELETE FROM produit WHERE id = ' + id, function (err, result) {
        if (err) {

            res.redirect('/')
        } else {

            res.redirect('/')
        }
    })
})

app.get('/delete/four/(:id)', function (req, res, next) {
    let id = req.params.id;
    connection.query('DELETE FROM fournisseur WHERE id = ' + id, function (err, result) {
        if (err) {

            res.redirect('/fournisseur')
        } else {

            res.redirect('/fournisseur')
        }
    })
})

app.get('/delete/cat/(:id)', function (req, res, next) {
    let id = req.params.id;
    connection.query('DELETE FROM rayon WHERE id = ' + id, function (err, result) {
        if (err) {

            res.redirect('/rayon')
        } else {

            res.redirect('/rayon')
        }
    })
})






connection.connect((err) => {
  if(!err)
      console.log('DB connection succeded.')
  else
      console.log('DB connection failed \n Error :' + JSON.stringify(err,undefined, 2))
})

app.get('/deletequantite/:id', function (req, rep, next) {

    let id = req.params.id
    connection.query("UPDATE produit SET quantite = quantite - 1 WHERE id = ?", id, (err, result) => {
        if (!err) {


            rep.redirect('/')


        } else {

            rep.send(err)



        }
    })

})

app.get('/addquantite/:id', function (req, rep, next) {

    let id = req.params.id
    connection.query("UPDATE produit SET quantite = quantite + 1 WHERE id = ?", id, (err, result) => {
        if (!err) {


            rep.redirect('/')


        } else {

            rep.send(err)



        }
    })

})




app.listen(3000, () => console.log('Listening on port 3000...'))
