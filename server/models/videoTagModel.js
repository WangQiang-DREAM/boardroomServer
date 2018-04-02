const { db } = require('../dbconfig/mongoose');
const videoTagDb = db.useDb('videos');
const mongoosePaginate = require('./paginate');

// 连接video表
const videoSchema = require('../schema/videoSchema');
videoSchema.plugin(mongoosePaginate);
const video = videoTagDb.model('video', videoSchema);

// 连接tags表
const tagsSchema = require('../schema/tagsSchema');
tagsSchema.plugin(mongoosePaginate);
const tags = videoTagDb.model('tags', tagsSchema);

// 连接videoTagRelation表
const videoTagRelationSchema = require('../schema/videoTagRelationSchema');
videoTagRelationSchema.plugin(mongoosePaginate);
const videoTagRelation = videoTagDb.model('videoTagRelation', videoTagRelationSchema);

// 连接videoTest表
const videoTestSchema = require('../schema/videoTestSchema');
videoTestSchema.plugin(mongoosePaginate);
const videoTest = videoTagDb.model('videoTest', videoTestSchema);

/**
 * 定义标签视频表返回字段
 */
const returnVideoParams = `
    creator
    guid
    tags
    newtags
    videoPlayUrl
    modifier
    modifyTime
    musicInfo
`;
const returnMusicInfo = `
    musicInfo
`;

/**
 * 定义标签表返回字段
 */
const returnTagParams = `
    _id:0
    key
    title
`;

/**
 * 根据搜索条件返回视频的所有信息
 * @param {*} params
 */
exports.queryVideoInfo = async params => {
    const page = Number(params.pagination.current);
    const limit = Number(params.pagination.pageSize);
    let sort = {};
    if (params.sort && params.sort.key) {
        sort = {
            [params.sort.key]: params.sort.order === 'ascend' ? 1 : -1,
        };
    }
    let videoParams = {
        select: returnMusicInfo,
        page,
        limit,
        sort,
    };
    const searchParams = ['guid', 'tags', 'newtags', 'videoPlayUrl', 'creator', 'modifier', 'modifyTime', 'musicInfo'];
    const searchRules = { creator: '抖音' };
    let starttime = '';
    let endtime = '';
    searchParams
        .map(param => {
            if (params.querys[param]) {
                return {
                    key: param,
                    value: params.querys[param],
                };
            } else {
                return null;
            }
        })
        .forEach(data => {
            if (data) {
                if (data.key === 'tags' && data.value !== '空标签') {
                    searchRules[data.key] = new RegExp(data.value);
                } else if (data.key === 'modifyTime') {
                    starttime = data.value[0];
                    endtime = data.value[1];
                    searchRules['modifyTime'] = { $gte: starttime, $lte: endtime };
                } else if (data.key === 'tags' && data.value === '空标签') {
                    searchRules[data.key] = { $size: 0 };
                } else if (data.key === 'musicInfo') {
                    searchRules[data.key] = data.value;
                } else {
                    searchRules[data.key] = data.value;
                }
            }
        });
    const videoInfo = await videoTagRelation.paginate(searchRules, videoParams);
    return videoInfo;
};

/**
 * 查询所有标签且去重
 * @return {allTags}
 */
exports.queryAllTags = async () => {
    const allTags = await video.find({ creator: '抖音' }).distinct('tags');
    return allTags;
};

/**
 * 查询所有背景音乐且去重
 */
exports.queryAllMusicInfo = async () => {
    const musicInfo = await videoTagRelation.find({}).distinct('musicInfo');
    return musicInfo;
};

/**
 * 保存标签至videoTags表
 * @param {标签对象} tagObj
 */
exports.saveTags = async tagObj => {
    let newTag = new tags({
        key: tagObj.key,
        title: tagObj.title,
    });
    const saveTagRes = await newTag.save();
    return saveTagRes;
};

/**
 * 从videoTags表中取所有标签
 * @param {*} params
 */
exports.returnAllTags = async params => {
    const page = Number(params.pagination.current);
    const limit = Number(params.pagination.pageSize);
    let sort = {};
    if (params.sort && params.sort.key) {
        sort = {
            [params.sort.key]: params.sort.order === 'ascend' ? 1 : -1,
        };
    }
    let tagParams = {
        select: returnTagParams,
        page,
        limit,
        sort,
    };
    const searchParams = ['title'];
    const searchRules = {};
    searchParams
        .map(param => {
            if (params.querys[param]) {
                return {
                    key: param,
                    value: params.querys[param],
                };
            } else {
                return null;
            }
        })
        .forEach(data => {
            if (data) {
                if ((searchRules[data.key] = 'title')) {
                    searchRules[data.key] = new RegExp(data.value);
                } else {
                    searchRules[data.key] = data.value;
                }
            }
        });
    const allTags = await tags.paginate(searchRules, tagParams);
    return allTags;
};

/**
 * 更改审核标签接口
 * @param {*} newTagObj
 */
exports.changeTags = async newTagObj => {
    let guid = newTagObj.guid;
    let newtags = newTagObj.newtags;
    let modifier = newTagObj.modifier;
    let modifyTime = Date.parse(new Date());
    console.log(modifyTime);
    const conditions = { guid: guid };
    const update = { $set: { newtags: newtags, modifier: modifier, modifyTime: modifyTime } };
    const options = { upsert: true };
    const changeTagsRes = await videoTagRelation.update(conditions, update, options);
    return changeTagsRes;
};
/**
 * 查询操作人下的审核标签
 *
 * @param {*} bodyData
 */
exports.queryModifierNewtags = async bodyData => {
    let modifier = bodyData.modifier;
    const ModifierNewtags = await videoTagRelation.find({ modifier: modifier }).distinct('newtags');
    return ModifierNewtags;
};
/**
 * 下载数据接口
 * @param {*} bodyData
 */
exports.downLoad = async bodyData => {
    let newtags = bodyData.newtags;
    let modifier = bodyData.modifier;
    let startTime = bodyData.modifyTime[0];
    let endTime = bodyData.modifyTime[1];
    const returnData = await videoTagRelation.find(
        {
            newtags: newtags,
            modifier: modifier,
            modifyTime: { $gte: startTime, $lte: endTime },
        },
        'tags newtags videoPlayUrl',
    );
    return returnData;
};

/**
 * 从video库中读取所需数据
 * @param {*} params
 */
exports.getOldVideoInfo = async creator => {
    const returnParams = `
        guid
        creator
        insertTime
        tags
        videoPlayUrl
        musicCover
        musicInfo
        musicUrl
    `;
    // let returnObj = {
    //     select: returnParams,
    //     page: 1,
    //     limit: 1000000,
    //     sort: {},
    // };
    const oldVideoInfo = await video.find({ creator: creator }, returnParams);
    return oldVideoInfo;
};

/**
 * 导入视频数据，导入完成后接口关闭，不再使用
 * @param {*} videoObj
 */
exports.saveVideoInfo = async videoObj => {
    let newTag = new videoTagRelation({
        guid: videoObj.guid,
        creator: videoObj.creator,
        insertTime: videoObj.insertTime,
        tags: videoObj.tags,
        newtags: [],
        videoPlayUrl: videoObj.videoPlayUrl,
        modifier: videoObj.modifier,
        musicInfo: videoObj.musicInfo,
        musicUrl: videoObj.musicUrl,
        musicCover: videoObj.musicCover,
    });
    const saveTagRelation = await newTag.save();
    return saveTagRelation;
};

/**
 * 查询插入有效条数
 */
exports.importNewVideoRes = async () => {
    const saveRes = await videoTest.find({}).distinct('guid');
    return saveRes;
};
