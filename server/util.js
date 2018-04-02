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