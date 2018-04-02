const uuid = require('uuid');
const util = require('../util');
const readline = require('readline');
const fs = require('fs');
const videoTagModel = require('../models/videoTagModel');
const exportConfig = require('../../config/exportConfig');

/**
 * 返回视频所有信息接口
 * @param {*} ctx
 * @param {*} next
 */
exports.queryVideoInfo = async (ctx, next) => {
    try {
        let bodystring = ctx.request.query.body;
        let body = util.parseJson(bodystring);
        let returnVideoInfo = await videoTagModel.queryVideoInfo(body);
        let videoTag = {
            docs: returnVideoInfo.docs,
            pagination: {
                total: returnVideoInfo.total,
                pageSize: returnVideoInfo.limit,
                current: returnVideoInfo.page,
            },
        };
        if (returnVideoInfo.docs) {
            exportConfig(ctx, 'success', videoTag);
        } else {
            exportConfig(ctx, 'error', videoTag);
        }
        return next;
    } catch (err) {
        console.log(err);
    }
};

/**
 * 下载数据接口
 * @param {*} ctx
 * @param {*} next
 */
exports.downLoad = async (ctx, next) => {
    try {
        let bodystring = ctx.request.query.body;
        let body = util.parseJson(bodystring);
        let download = await videoTagModel.downLoad(body);
        let returnSuccess = {
            code: 0,
            data: download,
        };
        let returnError = {
            code: 1,
        };
        if (download.length > 0) {
            exportConfig(ctx, 'exportSuccess', returnSuccess);
        } else {
            exportConfig(ctx, 'exportError', returnError);
        }
        return next;
    } catch (error) {
        console.log(error);
        exportConfig(ctx, 'exportError', {
            code: 1,
        });
    }
};

/**
 * 查询操作人下的审核标签
 * @param {*} ctx
 * @param {*} next
 */
exports.queryModifierNewtags = async (ctx, next) => {
    try {
        let bodystring = ctx.request.query.body;
        let body = util.parseJson(bodystring);
        let ModifierNewtags = await videoTagModel.queryModifierNewtags(body);
        let returnSuccess = {
            code: 0,
            data: ModifierNewtags,
        };
        let returnError = {
            code: 1,
        };
        if (ModifierNewtags.length > 0) {
            exportConfig(ctx, 'exportSuccess', returnSuccess);
        } else {
            exportConfig(ctx, 'exportError', returnError);
        }
        return next;
    } catch (error) {
        console.log(error);
        exportConfig(ctx, 'exportError', {
            code: 1,
        });
    }
};

/**
 * 新增标签接口
 * @param {*} ctx
 * @param {*} next
 */
exports.addTag = async (ctx, next) => {
    try {
        let bodystring = ctx.request.query.body;
        let body = util.parseJson(bodystring);
        let tagJson = {
            key: uuid(),
            title: body.title,
        };
        let saveTag = await videoTagModel.saveTags(tagJson);
        if (saveTag) {
            exportConfig(ctx, 'success', saveTag);
        } else {
            exportConfig(ctx, 'error', saveTag);
        }
        return next;
    } catch (err) {
        console.log(err);
    }
};

/**
 * 返回videoTags新表中所有标签数据
 * @param {*} ctx
 * @param {*} next
 */
exports.returnAllTags = async (ctx, next) => {
    try {
        let bodystring = ctx.request.query.body;
        let body = util.parseJson(bodystring);
        let allTags = await videoTagModel.returnAllTags(body);
        if (allTags.docs) {
            let tagObj = {
                docs: allTags.docs,
                pagination: {
                    total: allTags.total,
                    pageSize: allTags.limit,
                    current: allTags.page,
                },
            };
            exportConfig(ctx, 'success', tagObj);
        } else {
            exportConfig(ctx, 'error', tagObj);
        }
        return next;
    } catch (err) {
        console.log(err);
    }
};

/**
 * 修改视频标签接口
 * @param {*} ctx
 * @param {*} next
 */
exports.changeTags = async (ctx, next) => {
    try {
        let bodystring = ctx.request.query.body;
        let body = util.parseJson(bodystring);
        let newTags = [];
        for (let i = 0; i < body.newtags.split(',').length; i++) {
            newTags.push(body.newtags.split(',')[i]);
        }
        let newTagInfo = {
            guid: body.guid,
            newtags: newTags,
            modifier: body.modifier,
            modifierTime: Date.parse(new Date()),
        };
        let changeTagsRes = await videoTagModel.changeTags(newTagInfo);
        if (changeTagsRes.ok === 1) {
            let returnObj = {
                dbResult: changeTagsRes,
                ok: 1,
            };
            exportConfig(ctx, 'changeTagSuccess', returnObj);
        } else {
            let returnObj = {
                dbResult: changeTagsRes,
                ok: 0,
            };
            exportConfig(ctx, 'changeTagFail', returnObj);
        }
        return next;
    } catch (error) {
        console.log(error);
    }
};

/**
 * 查询所有musicInfo，并保存为文件
 * @param {*} ctx
 * @param {*} next
 */
exports.queryAllMusicInfo = async (ctx, next) => {
    try {
        let allMusicInfo = await videoTagModel.queryAllMusicInfo();
        let videoNumArray = [];
        for (let i = 0; i < allMusicInfo.length; i++) {
            if (allMusicInfo[i] !== '') {
                let videoNumObj = {
                    querys: {
                        musicInfo: allMusicInfo[i],
                    },
                    sort: {},
                    pagination: {
                        current: 1,
                        pageSize: 1,
                    },
                };
                let videoNum = await videoTagModel.queryVideoInfo(videoNumObj);
                let musicInfoObj = {
                    musicInfo: allMusicInfo[i],
                    videoNum: videoNum.total,
                };
                videoNumArray.push(musicInfoObj);
                let content = `\n${allMusicInfo[i]},${videoNum.total}`;
                let msExcelBuffer = Buffer.concat([
                    new Buffer('\xEF\xBB\xBF', 'binary'),
                    new Buffer(content),
                ]);
                fs.writeFileSync('./musicInfo.csv', msExcelBuffer, { flag: 'a' });
            };
        }
        return next;
    } catch (e) {
        console.log(e);
    }
};

/**
 * 从video表中提取所有标签并且保存到tags表
 * @param {*} ctx
 * @param {*} next
 */
exports.queryAllTags = async (ctx, next) => {
    try {
        let allTagsFromVideos = await videoTagModel.queryAllTags();
        for (let i in allTagsFromVideos) {
            if (allTagsFromVideos[i] !== '') {
                let tagJson = {
                    key: uuid(),
                    title: allTagsFromVideos[i],
                };
                let saveTag = await videoTagModel.saveTags(tagJson);
                console.log(saveTag);
            }
        }
        if (allTagsFromVideos) {
            exportConfig(ctx, 'success', allTagsFromVideos);
        }
        return next;
    } catch (error) {
        console.log(error);
    }
};

/**
 * 导入视频数据，导入完成后接口关闭，不再使用
 * @param {*} ctx
 * @param {*} next
 */
exports.moveVideoToNewCollect = async (ctx, next) => {
    try {
        let bodystring = ctx.request.query.body;
        let body = util.parseJson(bodystring);
        let creator = body.creator;
        let allOldVideo = await videoTagModel.getOldVideoInfo(creator);
        exportConfig(ctx, 'success', allOldVideo);
        for (let i = 0; i < allOldVideo.length; i++) {
            let saveVideoObj = {
                guid: allOldVideo[i].guid,
                creator: allOldVideo[i].creator,
                insertTime: allOldVideo[i].insertTime,
                tags: allOldVideo[i].tags,
                videoPlayUrl: allOldVideo[i].videoPlayUrl,
                musicInfo: allOldVideo[i].musicInfo,
                musicUrl: allOldVideo[i].musicUrl,
                musicCover: allOldVideo[i].musicCover,
                modifier: '标签审核小助手',
            };
            let saveVideoTagRela = await videoTagModel.saveVideoInfo(saveVideoObj);
            console.log(i);
            console.log(saveVideoTagRela);
        }
        return next;
    } catch (err) {
        console.log(err);
    }
};

exports.addNewVideoFromLog = async (ctx, next) => {
    try {
        const fReadName = './data/1.log';
        const fRead = fs.createReadStream(fReadName);
        const rl = readline.createInterface({
            input: fRead,
        });
        rl.on('line', async line => {
            let jsonObj = util.parseJson(line);
            let oldTags = jsonObj.tags === '' ? [] : jsonObj.tags.split(',');
            let newVideoObj = {
                videoPlayUrl: jsonObj.mediaFiles[0].videoPlayUrl || '',
                guid: jsonObj.guid || '',
                tags: oldTags,
                creator: jsonObj.creator || '',
                modifier: '标签审核小助手',
            };
            let saveVideoTagRela = await videoTagModel.saveVideoInfo(newVideoObj);
            console.log(saveVideoTagRela);
        });
        return next;
    } catch (error) {
        console.log(error);
    }
};

exports.checkTestNum = async (ctx, next) => {
    try {
        let saveRes = await videoTagModel.importNewVideoRes();
        exportConfig(ctx, 'importDataSuccess', saveRes.length);
        return next;
    } catch (error) {
        console.log(error);
    }
};
