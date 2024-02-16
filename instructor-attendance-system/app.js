const express = require('express');
const {addTime, generateReport, generateDetailedReport, init}=require('./utilities/utility');
const app=express();
app.use(express.json());

const PORT=process.env | "8000";

app.get('/report',async (req, res)=>{
    console.log("get-report");
    const {month} = req.query;

    const data=await generateReport(month);

    if(data.code){
        res.status(data.code).send(data);
    }
    else{
        res.send(data);
    }
});

app.get('/full-report',async (req, res)=>{
    console.log("get-full-report");
    const {month} = req.query;

    const data=await generateDetailedReport(month);
    if(data.code){
        res.status(data.code).send(data);
    }
    else{
        res.send(data);
    }
});

app.get('/init',async (req, res)=>{
    console.log("init");
    const data=await init();
    if(data.code){
        res.status(data.code).send(data);
    }
    else{
        res.send(data);
    }
});


app.post('/check',async (req, res)=>{
    console.log("check");

    const {instructorId, date, time, status}=req.body;
    const data=await addTime(instructorId, date, time, status);

    if(data.code){
        res.status(data.code).send(data);
    }
    else{
        res.send(data);
    }
});


app.listen(PORT,()=>{
    console.log("SERVER RUNNING AT PORT: " + PORT);
})