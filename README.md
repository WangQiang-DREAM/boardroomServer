# 小视频标签管理服务端

## 启动项目

```
npm install
npm start
```

## 接口列表

### 1. 获取视频信息接口(支持分页请求数据和视频标签模糊搜索)

请求类型: GET

```
/videoTag/queryVideoInfo
```

### 参数列表

|  变量名  |  含义  |  类型  |  是否必须  |
|  ------ | :--------: | :------: | :------: |
| querys.guid | 视频id | String | 否 |
| querys.tags | 视频原标签 | String | 否 |
| querys.newtags | 视频审核标签 | String | 否 |
| querys.videoPlayUrl | 视频播放地址 | String | 否 |
| querys.creator | 视频来源 | String | 否 |
| querys.modifier | 审核人 | String | 否 |
| pagination.current | 当前页数 | String | 是 |
| pagination.pageSize | 一页显示多少条 | String | 是 |

示例：

```
/videoTag/queryVideoInfo?body={"querys":{"modifier":"标签审核小助手","tags":"#Grendkaramoy"},"sort":{},"pagination":{"current":1,"pageSize":1}}
```

### 2. 添加标签接口

请求类型: GET

```
/videoTag/addTag
```

### 参数列表

|  变量名  |  含义  |  类型  |  是否必须  |
|  ------ | :--------: | :------: | :------: |
| title | 标签名称 | String | 是 |

示例：

```
/videoTag/addType?body={"title":"标签示例"}
```

### 3. 返回所有标签接口(支持分页请求和标签名模糊搜索)

请求类型: GET

```
/videoTag/returnAlltags
```

### 参数列表

|  变量名  |  含义  |  类型  |  是否必须  |
|  ------ | :--------: | :------: | :------: |
| querys.title | 标签名 | String | 否 |
| pagination.current | 当前页数 | String | 是 |
| pagination.pageSize | 一页显示多少条 | String | 是 |

示例：

```
/videoTag/returnAlltags?body={"querys":{"title":"标签示例"},"sort":{},"pagination":{"current":1,"pageSize":300}}
```

### 4. 更改视频标签接口(支持添加多条标签，以逗号隔开)

请求类型: GET

```
/videoTag/changeTags
```

### 参数列表

|  变量名  |  含义  |  类型  |  是否必须  |
|  ------ | :--------: | :------: | :------: |
| guid | 视频id | String | 是 |
| newtags | 更改标签 | String | 是 |
| modifier | 更改人 | String | 是 |

示例：

```
/videoTag/changeTags?body={"guid":"ffccec9d-a3c4-4cbd-bfe8-c7354760f6c1","newtags":"newtag1,newtag2,...","modifier":"zhujian"}
```

### 5. 用户登录接口

请求类型: GET

```
/videoTag/login
```

### 参数列表

|  变量名  |  含义  |  类型  |  是否必须  |
|  ------ | :--------: | :------: | :------: |
| email | 用户域账户用户名 | String | 是 |

示例：

```
/videoTag/login?body={"email":"zhujian"}
```

### 6. 数据下载接口

请求类型: GET

```
/videoTag/download
```

### 参数列表

|  变量名  |  含义  |  类型  |  是否必须  |
|  ------ | :--------: | :------: | :------: |
| newtags | 审核标签 | String | 是 |
| modifier | 审核人 | String | 是 |

示例：

```
/videoTag/downoad?body={"newtags":"#8000","modifier":"zhujian"}
```

### 7. 心跳检测接口

请求类型: GET

```
/heartbeat
```

返回值

```
ok
```