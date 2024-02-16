const { MONTHS, CHECK_OUT, INVALID_MONTH_ERROR, OVERLAPPING_STATUS_ERROR, OVERLAPPING_TIME_ERROR, CHECK_IN, UNKNOWN_STATUS_ERROR, INVALID_DATE_ERROR, INVALID_TIME_ERROR, ERROR_OCCURED, INVALID_INSTRUCTOR_ERROR } = require('./constants');
const {selectQuery, insertQuery, initDB}=require('../db-utilities/db-utility')
const {isValidStatus, isInstructorRegistered, isValidDate, isValidTime}=require('./validator');


const init = async ()=>{
    try{
        return await initDB();
    }
    catch(e){
        return {
            message:"an error occured",
            code: 500
        }
    }
}

const getFormatTime=(milliSeconds)=>{
    milliSeconds=Math.floor(milliSeconds/1000);
    let hr=Math.floor(milliSeconds/3600);
    let min=Math.floor((milliSeconds%3600)/60);
    let sec=Math.floor((milliSeconds%3600)%60);
    
    hr=hr<10?"0"+hr:hr;
    min=min<10?"0"+min:min;
    sec=sec<10?"0"+sec:sec;

    return hr+":"+min+":"+sec;
}

const getReportDB= async (month)=>{
    try{
        const query="SELECT * FROM slots WHERE date LIKE ? ORDER BY date, time";
        const queryParameters=['%-'+MONTHS[month]+'-%'];

        const data=await selectQuery(query,queryParameters);
        return data;
    }
    catch(e){
        return ERROR_OCCURED;
    }
}

const addTimeToDB= async (instructorId, date, time, status)=>{
    try{
        const query="SELECT * FROM slots WHERE instructorid = ? ORDER BY date DESC, time DESC, timestamp DESC LIMIT 0,1";
        const queryParameters=[instructorId];
        const data=await selectQuery(query,queryParameters);

        if(data && data.length>-1){
            if(data.length===0){
                if(status===CHECK_OUT){
                    return OVERLAPPING_STATUS_ERROR;
                }
            }
            else{
                const entry=data[data.length-1];
                if(entry.status===status){
                    return OVERLAPPING_STATUS_ERROR;
                }
                else if((entry.date===date && entry.time>=time) || entry.date>date){
                    return OVERLAPPING_TIME_ERROR;
                }
            }
        }
        
        const iQuery = "INSERT INTO slots VALUES (?, ?, ?, ?, ?)";
        const iQueryParameters=[new Date, instructorId, date, time, status];
        const result=await insertQuery(iQuery,iQueryParameters);

        if(result.code===200){
            return {
                message: status+" success",
                code: 200
            }
        }

        return result;
    }
    catch(e){
        return ERROR_OCCURED;
    }
}

const addTime= async (instructorId, date, time, status)=>{

    if(!isValidStatus(status)){
        return UNKNOWN_STATUS_ERROR;
    }

    if(!isValidDate(date)){
        return INVALID_DATE_ERROR;
    }

    if(!isValidTime(time)){
        return INVALID_TIME_ERROR;
    }

    //Assume that check-in and check-outs will be added one after another
    try{
        const instructorCheck=await isInstructorRegistered(instructorId);
        if(!instructorCheck){
            return INVALID_INSTRUCTOR_ERROR;
        }

        return await addTimeToDB(instructorId,date,time,status);
        
    }
    catch(e){
        return ERROR_OCCURED;
    }
}

const generateDetailedReport= async (month)=>{
    if(!MONTHS[month]){
        return INVALID_MONTH_ERROR;
    }
    
    try{
        const data=await getReportDB(month);
        let report={};

        data.forEach((entry)=>{
            const {instructorid, date, time, status}=entry;

            if(!report[instructorid]){
                report[instructorid]={};
                report[instructorid][date]= [{
                    time: time,
                    status: status
                }];
            }
            else{
                if(!report[instructorid][date]){
                    report[instructorid][date]=[{
                        time: time,
                        status: status
                    }];
                }
                else{
                    report[instructorid][date].push({
                        time: time,
                        status: status
                    });
                }
            }
        });

        return {
            message: "success",
            code: 200,
            report,
        }
    }
    catch(e){
        return ERROR_OCCURED;
    }
}

const generateReport= async (month)=>{
    if(!MONTHS[month]){
        return INVALID_MONTH_ERROR;
    }

    try{
        const fullReport=await generateDetailedReport(month);
        if(fullReport.code!==200){
            return fullReport;
        }

        const dateStr="2000-01-01T",nextDateStr="2000-01-02T",report={};

        for(const [id, data] of Object.entries(fullReport.report)) {
            let totalTime=0;

            for(const [date, slots] of Object.entries(data)) {
                let prevTime=new Date(dateStr+"00:00:00");

                slots.forEach((entry)=>{
                    if(entry.status===CHECK_IN){
                        prevTime=new Date(dateStr+entry.time);
                    }
                    else{
                        totalTime+=(new Date(dateStr+entry.time)-prevTime);
                        prevTime=undefined;
                    }
                });

                if(prevTime && prevTime!==new Date(dateStr+"00:00:00")){
                    totalTime+=(new Date(nextDateStr+"00:00:00")-prevTime);
                }
            }

            report[id]={
                totalTime: getFormatTime(totalTime)
            }
        }

        return {
            message: "success",
            code: 200,
            report
        }
    }
    catch(e){
        return ERROR_OCCURED;
    }
}

module.exports={addTime, generateReport, generateDetailedReport, init};