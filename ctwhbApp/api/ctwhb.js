import request from '@/utils/request';
import config from '@/config';

// 上传文件
export function uploadFile(file) {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: config.baseUrl + config.baseApi + '/infra/file/upload',
      filePath: file,
      name: 'file',
      header: {
        Authorization: 'Bearer ' + uni.getStorageSync('REFRESH_TOKEN')
      },
      success: (res) => {
        try {
          const result = JSON.parse(res.data);
          resolve(result);
        } catch (error) {
          reject(new Error('解析响应数据失败'));
        }
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
}

// 获取历史记录列表
export function getHistoryRecordPage(params) {
  return request({
    url: '/system/history-record/page',
    method: 'GET',
    params
  });
}

// 获取历史列表
export function getHistoryPage(params) {
  return request({
    url: '/system/history/page',
    method: 'GET',
    params
  });
}

// 获取轮播图列表
export function getSlideshowPage(params) {
  return request({
    url: '/system/slideshow/page',
    method: 'GET',
    params
  });
}

// 获取新闻列表
export function getNewsPage(params) {
  return request({
    url: '/system/news/page',
    method: 'GET',
    params
  });
}

// 获取新闻详情
export function getNewsDetail(id) {
  return request({
    url: '/system/news/get',
    method: 'GET',
    params: {
      id
    }
  });
}
// 判断是否已点赞
export function isLike(id) {
  return request({
    url: '/system/forum/isLike',
    method: 'GET',
    params: { id }
  });
}
// 获取论坛分类字典
export function getDictDataListByType(type) {
  return request({
    url: '/system/dict-data/type',
    method: 'GET',
    params: { type }
  });
}

// 获取论坛帖子列表
export function getForumPage(params) {
  return request({
    url: '/system/forum/page',
    method: 'GET',
    params
  });
}

// 获取帖子详情
export function getForumDetail(id) {
  return request({
    url: '/system/forum/get',
    method: 'GET',
    params: { id }
  });
}

// 创建帖子
export function createForum(data) {
  return request({
    url: '/system/forum/create',
    method: 'POST',
    data
  });
}

// 获取帖子评论列表
export function getForumComments(forumId) {
  return request({
    url: '/system/forum/forum-comment/list-by-forum-id',
    method: 'GET',
    params: { forumId }
  });
}

// 创建评论
export function createComment(data) {
  return request({
    url: '/system/forum/createComment',
    method: 'POST',
    data
  });
}

// 点赞/取消点赞
export function createLike(data) {
  return request({
    url: '/system/forum/createLikes',
    method: 'POST',
    data
  });
}

// 获取帖子点赞列表
export function getForumLikes(forumId) {
  return request({
    url: '/system/forum/forum-likes/list-by-forum-id',
    method: 'GET',
    params: { forumId }
  });
}
