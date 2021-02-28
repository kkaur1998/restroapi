const express = require('express');
const app = express();
const port = 9900;
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const mongourl = "mongodb+srv://kkaur:Singh@10@cluster0.gfkgk.mongodb.net/edurestro?retryWrites=true&w=majority";
const bodyParser= require('body-parser')
let db;


//health check
app.get('/',(req,res)=>{
    res.send("OK, ready to go")
})


//trial

app.get('/trial',(req,res)=>{
    res.send("hi trial")
})

//city

app.get('/city',(req,res)=>{
    db.collection('location').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//cuisine

app.get('/cuisine',(req,res) => {
    db.collection('cuisine').find().toArray((err,result) => {
      if(err) throw err;
      res.send(result);
    })
   
});

//rest

// app.get('/rest',(req,res)=>{
//     var condition={}
//     db.collection('restaurent').find(condition).toArray((err,result)=>{
//         if(err) throw err;
//         res.send(result);
//     })
// });

//rest per city
//this is using param
app.get('/rest/:id',(req,res)=>{
    var id=req.params.id
    db.collection('restaurent').find({city:id}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})


//now query param

app.get('/rest',(req,res)=>{
    var condition = {};
    //Note: order of these combination really matter for example the cost api is on top as 3 argument, then 2 argument, then 1
    //restaurent as per city+cuisine
    //http://localhost:9900/rest?city=2&cuisine=1
    if(req.query.mealtype && req.query.city){
        condition={$and:[{"type.mealtype":req.query.mealtype},{city: req.query.city}]}
    }
    //restaurent meal+cuisine
    //http://localhost:9900/rest?mealtype=2&cuisine=1
    else if(req.query.mealtype && req.query.cuisine){
        condition={$and:[{"Cuisine.cuisine":req.query.cuisine},{"type.mealtype":req.query.cuisine}]}
    }
    db.collection('restaurent').find(condition).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})



//meals

app.get('/meals',(req,res)=>{
    db.collection('mealType').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
});

//post order (to check result we need postman)
//post call to get data from user
app.post('/postorder',(req,res)=>{
    //taking data from user, so body will be threre(req.body......)
    db.collection('order').insert(req.body,(err,result)=>{
        if(err) throw err;
        res.send("data added")
    })
})

//get all order or booking
app.get('/orders',(req,res)=>{
    db.collection('orders').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//connecting to mongodb with nodejs

MongoClient.connect(mongourl,(err,connection)=>{
    if(err) throw err;
    db= connection.db('edurestro')
    app.listen(port,(err)=>{
        if(err) throw err;
        console.log(`running on port no. ${port}`)
    })
})
