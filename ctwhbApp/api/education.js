import request from '@/utils/request';

// 收藏/取消收藏
export function createCollect(data) {
  return request({
    url: '/system/education/createCollect',
    method: 'POST',
    data
  });
}

// 检查是否已收藏
export function isCollect(id) {
  return request({
    url: '/system/education/isCollect',
    method: 'GET',
    params: { id }
  });
}

// 获取教育视频列表
export function getEducationPage(params) {
  return request({
    url: '/system/education/page',
    method: 'GET',
    params
  });
}

// 获取教育视频收藏列表
export function getEducationCollectPage(params) {
  return request({
    url: '/system/education/pageCollect',
    method: 'GET',
    params
  });
}

// 获取教育视频详情
export function getEducationDetail(id) {
  return request({
    url: '/system/education/get',
    method: 'GET',
    params: { id }
  });
}

// 获取视频评论列表
export function getEducationComments(educationId) {
  return request({
    url: '/system/education/education-comment/list-by-education-id',
    method: 'GET',
    params: { educationId }
  });
}

// 创建评论
export function createComment(data) {
  return request({
    url: '/system/education/createComment',
    method: 'POST',
    data
  });
}

// 点赞/取消点赞
export function createLike(data) {
  return request({
    url: '/system/education/createLikes',
    method: 'POST',
    data
  });
}

// 检查是否已点赞
export function isLike(id) {
  return request({
    url: '/system/education/isLike',
    method: 'GET',
    params: { id }
  });
}
