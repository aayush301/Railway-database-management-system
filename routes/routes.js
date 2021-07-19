const express= require('express');
const con= require('../dbService');
const router=express.Router();



router.get('/', async function(req,res) {
    
    const query=`select route_id,s1.station_name as src_name, s2.station_name as dest_name,distance from route,station s1,station s2 where route.station_id=s1.station_id and route.next_station_id=s2.station_id`;
    const result=await new Promise(function(resolve,reject){
        con.query(query, function(err,res){
            resolve(res);
        });
    });
    res.render('routes',{
        routes: result
    });

});


router.get('/:id/view', async function(req,res) {
    
    const query1=`select* from route where route_id=?`;
    const result1=await new Promise(function(resolve,reject){
        con.query(query1, [req.params.id], function(err,res){
            resolve(res);
        });
    });
    
    const query2=`select station_name from station where station_id=${result1[0].station_id};`;
    const query3=`select station_name from station where station_id=${result1[0].next_station_id}`;
    const results=await new Promise(function(resolve,reject){
        con.query(query2+query3, function(err,res){
            resolve(res);
        });
    });
    result1[0].station=results[0][0].station_name;
    result1[0].next_station=results[1][0].station_name;

    res.render('route',{
        route: result1[0]
    });

});


router.get('/add', async function(req,res){
   
    const query1=`select station_id,station_name from station order by station_name asc`;
    const result1=await new Promise(function(resolve,reject){
        con.query(query1, function(err,res){
            resolve(res);
        });
    });

    const query2=`select route_id from route`;
    const result2=await new Promise(function(resolve,reject){
        con.query(query2, function(err,res){
            resolve(res);
        });
    });

    res.render('addRoute',{
        stations:result1,
        routes: result2
    });

});

router.post('/add', function(req,res){
    
    const id=req.body.id;
    const src=req.body.src;
    const dest=req.body.dest;
    const distance=req.body.distance;

    const query=`insert into route values (?,?,?,?)`;
    con.query(query, [id,src,dest,distance], function(err,result){
        if(err)throw err;
    });
    
    res.redirect('/routes');

});


router.get('/:id/edit', function(req,res) {
    const query1=`select* from route where route_id=${req.params.id};`;
    const query2=`select station_id,station_name from station order by station_name asc;`;
    const query3=`select route_id from route`;
    con.query(query1+query2+query3, function(err,results){
        if(err)throw err;
        res.render('editRoute',{
            route: results[0][0],
            stations: results[1],
            routes: results[2]
        });
    });
});


router.post('/update', function(req,res){
    const id=req.body.new_id;
    const src=req.body.src;
    const dest=req.body.dest;
    const dist=req.body.dist;

    const query=`update route set route_id=?,station_id=?, next_station_id=?, distance=? where route_id=?`;
    con.query(query, [id,src,dest,dist,req.query.old_id], function(err,result){
        if(err)throw err;
    });
    res.redirect('/routes/'+id+'/view');
});


router.get('/delete', function(req,res){

    const query=`delete from route where route_id=?`;
    con.query(query, [req.query.id], function(err,result){
        if(err)throw err;
    });
    res.redirect('/routes');
});



module.exports=router;