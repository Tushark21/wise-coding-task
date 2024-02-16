const sqlite3 = require('sqlite3').verbose();
const {ERROR_OCCURED, INSERT_SUCCESS} = require('../utilities/constants');
let db;

const getDBInstance= ()=>{
    db = new sqlite3.Database('./db-utilities/sample.db', sqlite3.OPEN_READWRITE,(err)=>{
        if(err){
            console.error("DB open: ", err);
        }
    });

    return db;
}

const insertQuery=async (query,queryParameters)=>{
    if(!db){
        db=getDBInstance();
    }
    
    const result=await new Promise((resolve,reject)=>{
        db.run(query, queryParameters, (err)=>{
            if(err){
                console.log("INSERT: ", err);
                reject(ERROR_OCCURED);
            }

            resolve(INSERT_SUCCESS);
        });
    }).catch((e)=>{
        return e;
    });

    db.close();
    db=undefined;
    return result;
}

const selectQuery=async (query, queryParameters)=>{
    if(!db){
        db=getDBInstance();
    }

    const data=await new Promise((resolve,reject)=>{
        db.all(query, queryParameters, (err, rows)=>{                
            if(err){
                console.log("SELECT: ", err);
                reject(ERROR_OCCURED);
            }

            resolve(rows);
        });
    }).catch((e)=>{
        return e;
    });

    db.close();
    db=undefined;
    return data;
}

const initDB=async ()=>{
    try {
        if(!db){
            db=getDBInstance();
        }
        const result = await new Promise((resolve)=>{
            db.serialize(async ()=>{
                db.run("CREATE TABLE IF NOT EXISTS instructors (id PRIMARY KEY, name)");
                db.run("CREATE TABLE IF NOT EXISTS slots (timestamp PRIMARY KEY, instructorid, date, time, status)");

                const query = "INSERT INTO instructors VALUES (?, ?)";
                let message="";
                let iResult=await insertQuery(query,["111", "Tushar"]);
                message=iResult.code===200?"111,":"";
                
                iResult=await insertQuery(query,["112", "Sachin"]);
                message+=iResult.code===200?"112,":"";
                
                iResult=await insertQuery(query,["113", "Rajesh"]);
                message+=iResult.code===200?"113":"";
                
                resolve({
                    message: "init complete, added "+message,
                    code: 200
                });
            });
        }).catch((e)=>{
            return e;
        });
        
        return result;
    }
    catch(e){
        return ERROR_OCCURED;
    }
}

module.exports={
    getDBInstance,
    selectQuery,
    insertQuery,
    initDB,
}