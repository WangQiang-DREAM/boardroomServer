/**
 * String转json
 * @param {*} jsonString
 */
exports.parseJson = jsonString => {
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        throw new Error('10001');
    }
};

exports.returnFloorByDep = dep =>{
    switch (dep) {
        case '产品研发部':
            return 7
            break;
        case '课程部':
            return 3 
            break;
    }
}