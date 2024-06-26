export const REACT_APP_SERVER_URL = process.env.REACT_APP_FIREBASE_SERVER_URL || 'http://localhost:5000'

// Add school id and field names in array to hide the fields in respective school student form
export const SCHOOL_HIDDEN_FIELDS = {
    1001: ['designation', 'date_of_joining', 'department','emp_code'],
    1002: ['designation', 'date_of_joining', 'department','emp_code'],
    1017: ['mobile_2','division','blood_group','house','fathername','fathermobile','mothername','mothermobile','rollno','designation', 'date_of_joining', 'department','emp_code'],
    1018: ['mobile_2','division','blood_group','house','fathername','fathermobile','mothername','mothermobile','rollno','designation', 'date_of_joining', 'department','emp_code'],
};

export const SCHOOL_FIELDS = [
    'full_name',
    'school_name',
    'address',
    'mobile_1',
    'mobile_2',
    'grno',
    'standard',
    'division',
    'blood_group',
    'date_of_birth',
    'house',
    'fathername',
    'fathermobile',
    'mothername',
    'mothermobile',
    'rollno',
    'designation',
    'date_of_joining',
    'department',
    'emp_code',
];
