const CHECK_IN="check-in";
const CHECK_OUT="check-out";
const STATUS_LIST=[CHECK_IN, CHECK_OUT];
const TIME_REG_EXP=/^([01]\d|2[0-3]):?([0-5]\d):?([0-5]\d)$/;
const MONTHS={
    "january": "01",
    "february": "02",
    "march": "03",
    "april": "04",
    "may": "05",
    "june": "06",
    "july": "07",
    "august": "08",
    "september": "09",
    "october": "10",
    "november": "11",
    "december": "12"
}

const ERROR_OCCURED={
    message: "an error occured",
    code: 500
}

const INVALID_MONTH_ERROR={
    message: "invalid month",
    code: 400
}

const INVALID_DATE_ERROR={
    message: "invalid date parameter",
    code: 400
}

const INVALID_TIME_ERROR={
    message: "invalid time parameter",
    code: 400
}

const INVALID_INSTRUCTOR_ERROR={
    message: "instructor not registered",
    code: 400
}

const UNKNOWN_STATUS_ERROR={
    message: "check-in/check-out status unknown",
    code: 400
}

const OVERLAPPING_STATUS_ERROR={
    message: "time slot overlapping status",
    code: 400
}

const OVERLAPPING_TIME_ERROR={
    message: "time slot overlapping time",
    code: 400
}

const INSERT_SUCCESS={
    message: "insert successful",
    code: 200
}

module.exports={
    CHECK_IN,
    CHECK_OUT,
    STATUS_LIST,
    TIME_REG_EXP,
    MONTHS,
    ERROR_OCCURED,
    INVALID_MONTH_ERROR,
    INVALID_DATE_ERROR,
    INVALID_TIME_ERROR,
    INVALID_INSTRUCTOR_ERROR,
    UNKNOWN_STATUS_ERROR,
    OVERLAPPING_STATUS_ERROR,
    OVERLAPPING_TIME_ERROR,
    INSERT_SUCCESS
}