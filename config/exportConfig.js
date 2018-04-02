/**
 * 封装的导出
 */
const codeConfig = require('../config/codeConfig.js');

const exportConfig = (ctx, status, data) => {
    if (!codeConfig[status]) {
        status = 'commonError';
    }

    ctx.body = {
        code: codeConfig[status].code,
        message: codeConfig[status].message,
        data: data || {},
    };
    return ctx;
};
module.exports = exportConfig;