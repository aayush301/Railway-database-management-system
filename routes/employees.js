const express= require('express');
const con= require('../dbService');
const router=express.Router();

router.get('/', function(req,res) {
    const query=`select* from employee`;
    con.query(query, function(err,result){
        if(err)throw err;
        res.render('employees',{
            employees: result
        });
    });
});


router.get('/add', async function(req,res){
   
    const query1=`select employee_id from employee`;
    const result=await new Promise(function(resolve,reject){
        con.query(query1, function(err,res){
            resolve(res);
        });
    });
    res.render('addEmployee',{
        employees:result
    });

});


router.post('/add', function(req,res){
    
    const id=req.body.id;
    const name=req.body.name;

    const query=`insert into employee values (?,?)`;
    con.query(query, [id,name], function(err,result){
        if(err)throw err;
    });
    
    res.redirect('/employees');

});



router.get('/:id/view', async function(req,res) {
    
    const query1=`select* from employee where employee_id=?`; 
    const result1=await new Promise(function(resolve,reject){
        con.query(query1, [req.params.id], function(err,res){
            resolve(res);
        });
    });
    const employee=result1[0];

    const query2=`select station_id,station_name from station where station_master_id=?`;
    const result2=await new Promise(function(resolve,reject){
        con.query(query2, [employee.employee_id], function(err,res){
            resolve(res);
        });
    });
    if(result2.length>0)
    {
        employee.station_id=result2[0].station_id;
        employee.station_name=result2[0].station_name;
    }

    res.render('employee',{
        employee: employee
    });

});


router.get('/:id/edit', async function(req,res) {

    const query1=`select* from employee where employee_id=?`;
    const result1=await new Promise(function(resolve,reject){
        con.query(query1, [req.params.id], function(err,res){
            resolve(res);
        });
    });    

    const query2=`select employee_id from employee`;
    const result2=await new Promise(function(resolve,reject){
        con.query(query2, function(err,res){
            resolve(res);
        });
    });


    res.render('editEmployee',{
        employee: result1[0],
        employees: result2
    });

});

router.post('/update', async function(req,res){
    const id=req.body.new_id;
    const name=req.body.name;

    const query=`update employee set employee_id=?,employee_name=? where employee_id=?`;
    con.query(query, [id,name,req.query.old_id], function(err,result){
        if(err)throw err;
    });
    res.redirect('/employees/'+id+'/view');
    
    
});


router.get('/delete', function(req,res){

    const query=`delete from employee where employee_id=?`;
    con.query(query, req.query.id, function(err,result){
        if(err)
            res.redirect(`/employees/${req.query.id}/view`);
        else
            res.redirect('/employees');

    });
});


module.exports=router;