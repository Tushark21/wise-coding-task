const {STATUS_LIST, TIME_REG_EXP} = require('./constants');
const {selectQuery}= require('../db-utilities/db-utility');

const getInstructorIds= async ()=>{
    try{
        const query="SELECT id FROM instructors";
        const queryParameters=[];
        let result=await selectQuery(query, queryParameters);
        
        if(Array.isArray(result)){
            let idList=[];
            result.forEach((entry)=>{
                idList.push(entry.id);
            });
            
            return idList;
        }

        return result;
    }
    catch(e){
        return ERROR_OCCURED;
    }
}

const isInstructorRegistered=async (id)=>{
    try{
        const instructorList=await getInstructorIds();
        return instructorList.includes(id);
    }
    catch(e){
        throw new Error('DB ERROR');
    }
}

const isValidStatus=(status)=>{
    if(STATUS_LIST.includes(status)){
        return true;
    }
    
    return false;
}

//ISO Format YYYY-MM-DD
const isValidDate= (date)=>{
    if(!date){
        return false;
    }

    const d=new Date(date);
    
    if(!isNaN(d)){
        if(d.toISOString().substring(0, 10)===date){
            return true;
        }
    }

    return false;
}

//24-Hours Format HH:MM:SS
const isValidTime= (time)=>{
    if (!time) {
        return false;
    }
    
    const regex = new RegExp(TIME_REG_EXP);

    if (regex.test(time)) {
        return true;
    }

    return false;
}

module.exports={
    getInstructorIds,
    isInstructorRegistered,
    isValidStatus,
    isValidDate,
    isValidTime
}