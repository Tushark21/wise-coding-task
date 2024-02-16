# Installation
* Node Js is required to run this project (install nodejs).
* In the main folder run npm i in the terminal

# Running
* In the main folder run node app.js in the terminal

# Design

### CHECK-IN & CHECK-OUT
* check-in & check-out are performed using POST API (separate calls but same API for check-in and check-out )
    http://localhost:8000/check
* It requires 4 body parameters: instructorId, date, time, status.
* status can have two values CHRCK-IN or CHECK-OUT depending on the case.

### REPORT
* monthly hours report can be obtained by using GET API:
    # http://localhost:8000/full-report?month=________
    # http://localhost:8000/report?month=________

* In these APIs month name needs to be passed as a query parameter.
* full-report API returns the detailed in-out data of each instructors for the required month.
* report API returns the total checked-in time of the instructors for the required month. 

### DB INFO
* Using sqlite3 database
* There are 2 tables:
    instructors: (id PRIMARY KEY, name) for instructors details.
    slots: (timestamp PRIMARY KEY, instructorid, date, time, status) for instructors check-in & check-out data.

* There are some instructors inserted for starters.
[
    {
        id:"111",
        name: "Tushar"
    },
    {
        id:"112",
        name: "Sachin"
    },
    {
        id:"113",
        name: "Rajesh"
    }
]

* slots table will be empty in the beginning.

# Assumptions
* date should be in ISO format i,e. YYYY-MM-DD
* time should be in 24-hours format i,e. HH:MM:SS
* status can have only two values check-in and check-out.
* instructorId needs to be present in the instructors table.
* In database there are some instructors inserted for starters.
* check-in and check-out will occur in an alternate fashion for every instructor. If an instructor did a check-in he/she cannot perform check-in again unless he/she performs check-out first.
* If check-in is not followed by check-out it will result in adding the whole remaining time of the day to the total checked-in time. (As instructors may be doing night shift).
* Similarly if first entry of the day is checked-out, time from the beginning of the day till the checked-out time will be added in the total checked-in time.
* There is another API http://localhost:8000/init that creates the required tables and fill the tables with started data, you need to delete the sample.db file and create it again to see the results of this API.
* JWT tokens are not used to keep the evalaution simple and easy.

note: These assumptions were made because of unclear requirements, any of the functionality can be changed as required.
