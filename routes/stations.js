const express= require('express');
const con= require('../dbService');
const router=express.Router();



router.get('/', async function(req,res) {
    const query1=`select* from station`;
    const result1=await new Promise(function(resolve,reject){
        con.query(query1, function(err,res){
            resolve(res);
        });
    });


    for(var i=0;i<result1.length;i++)
    {
        const query2=`select employee_name from employee where employee_id=${result1[i].station_master_id}`;
        const result2=await new Promise(function(resolve,reject){
            con.query(query2, function(err,res){
                resolve(res);
            });
        });
        result1[i].station_master=result2[0].employee_name;
    }
    
    res.render('stations',{
        stations: result1,
    });

});


router.get('/search', async function(req,res) {
    
    const name=req.query.name;
    const city=req.query.city;
    const state=req.query.state;

    var query="select* from station";

    if(name.length>0 || city.length>0 || state.length>0)
        query+=" where";
    
    var mark= false;
    if(name.length>0)
    {
        mark=true;
        if(name[0]>='0'&&name[0]<='9')
            query+=` station_id ='${name}'`;
        else
            query+=` station_name like '%${name}%'`;
    }
    if(city.length>0)
    {
        if(mark)
            query+=" and";
        mark=true;
        query+=` station_city like '%${city}%'`;
    }
    if(state.length>0)
    {
        if(mark)
            query+=" and";
        query+=` station_state like '%${state}%'`;
    }
    
    const result1=await new Promise(function(resolve,reject){
        con.query(query, function(err,res){
            resolve(res);
        });
    });

    for(var i=0;i<result1.length;i++)
    {
        const query2=`select employee_name from employee where employee_id=${result1[i].station_master_id}`;
        const result2=await new Promise(function(resolve,reject){
            con.query(query2, function(err,res){
                resolve(res);
            });
        });
        result1[i].station_master=result2[0].employee_name;
    }

    res.render('stations',{
        stations: result1
    });

});


router.get('/:id/view', async function(req,res) {
    
    const query1=`select* from station where station_id=${req.params.id}`;
    const result1=await new Promise(function(resolve,reject){
        con.query(query1, function(err,res){
            resolve(res);
        });
    });

    const query2=`select employee_name from employee where employee_id=${result1[0].station_master_id}`;
    const result2=await new Promise(function(resolve,reject){
        con.query(query2, function(err,res){
            resolve(res);
        });
    });
    
    res.render('station',{
        station: result1[0],
        station_master: result2[0].employee_name
    });


});

router.get('/add', async function(req,res){
   
    const query1=`select* from employee order by employee_name asc`;
    const result1=await new Promise(function(resolve,reject){
        con.query(query1, function(err,res){
            resolve(res);
        });
    });

    const query2=`select station_id from station`;
    const result2=await new Promise(function(resolve,reject){
        con.query(query2, function(err,res){
            resolve(res);
        });
    });

    res.render('addStation',{
        employees:result1,
        stations: result2
    });

});

router.post('/add', async function(req,res){
    
    const id=req.body.id;
    const name=req.body.name;
    const address=req.body.address;
    const city=req.body.city;
    const state=req.body.state;
    const master_id=req.body.master;

    
    const query=`insert into station values (?,?,?,?,?,?)`;
    con.query(query, [id,name,address,city,state,master_id], function(err,result){
        if(err)throw err;
    });
    
    res.redirect('/stations');
    

});



router.get('/:id/edit', function(req,res) {
    const query1=`select* from station where station_id=${req.params.id};`;
    const query2=`select* from employee;`;
    const query3=`select station_id from station`;
    con.query(query1+query2+query3, function(err,results){
        if(err)throw err;
        res.render('editStation',{
            station: results[0][0],
            employees: results[1],
            stations: results[2]
        });
    });
});


router.post('/update', function(req,res){
    const id=req.body.new_id;
    const name=req.body.name;
    const address=req.body.address;
    const city=req.body.city;
    const state=req.body.state;
    const master=req.body.master;

    const query=`update station set station_id=?,station_name=?,station_address=?,station_city=?,station_state=?,station_master_id=? where station_id=${req.query.old_id}`;
    con.query(query, [id,name,address,city,state,master], function(err,result){
        if(err)throw err;
        
    });
    res.redirect('/stations/'+id+'/view');
    
});


router.get('/delete', function(req,res){

    const query=`delete from station where station_id=${req.query.id}`;
    con.query(query, function(err,result){
        if(err)
            res.redirect(`/stations/${req.query.id}/view`);
        else
            res.redirect('/stations');        
    });

});


module.exports=router;