import request from '@/config/axios'

// 教育 VO
export interface EducationVO {
  id: number // 用户ID
  vidio: string // 视频
  title: string // 视频标题
  picture: string // 首页图片
  views: number // 观看量
  comment: number // 评论量
  likes: number // 点赞量
}

// 教育 API
export const EducationApi = {
  // 查询教育分页
  getEducationPage: async (params: any) => {
    return await request.get({ url: `/system/education/page`, params })
  },

  // 查询教育详情
  getEducation: async (id: number) => {
    return await request.get({ url: `/system/education/get?id=` + id })
  },

  // 新增教育
  createEducation: async (data: EducationVO) => {
    return await request.post({ url: `/system/education/create`, data })
  },

  // 修改教育
  updateEducation: async (data: EducationVO) => {
    return await request.put({ url: `/system/education/update`, data })
  },

  // 删除教育
  deleteEducation: async (id: number) => {
    return await request.delete({ url: `/system/education/delete?id=` + id })
  },

  // 导出教育 Excel
  exportEducation: async (params) => {
    return await request.download({ url: `/system/education/export-excel`, params })
  },

// ==================== 子表（教育收藏） ====================

  // 获得教育收藏列表
  getEducationCollectListByEducationId: async (educationId) => {
    return await request.get({ url: `/system/education/education-collect/list-by-education-id?educationId=` + educationId })
  },

// ==================== 子表（教育评论） ====================

  // 获得教育评论列表
  getEducationCommentListByEducationId: async (educationId) => {
    return await request.get({ url: `/system/education/education-comment/list-by-education-id?educationId=` + educationId })
  },

// ==================== 子表（教育点赞） ====================

  // 获得教育点赞列表
  getEducationLikeListByEducationId: async (educationId) => {
    return await request.get({ url: `/system/education/education-like/list-by-education-id?educationId=` + educationId })
  }
}