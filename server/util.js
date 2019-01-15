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

exports.returnFloorByDep = dep => {
    switch (dep) {
        case '产品研发部':
            return 7
            break;
        case '课程部':
            return 3
            break;
        case '渠道部':
            return 3
            break;
        case '简教练运营部':
            return 3
            break;
        case '简而优运营部':
            return 3
            break;
        case '智慧课堂部':
            return 5
            break;
        case '网络营销部':
            return 3
            break;
        case '综合&财商部':
            return 5
            break;
        case '简单学习网':
            return 5
            break;
        case '品牌市场部':
            return 5
            break;

    }

}

exports.AppoSubmitHandle = param =>{

}
