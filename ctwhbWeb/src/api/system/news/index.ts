import request from '@/config/axios'

// 新闻资讯 VO
export interface NewsVO {
  id: number // 用户ID
  picture: string // 首页图片
  title: string // 首页标题
  view: number // 阅读量
  content: string // 内容
}

// 新闻资讯 API
export const NewsApi = {
  // 查询新闻资讯分页
  getNewsPage: async (params: any) => {
    return await request.get({ url: `/system/news/page`, params })
  },

  // 查询新闻资讯详情
  getNews: async (id: number) => {
    return await request.get({ url: `/system/news/get?id=` + id })
  },

  // 新增新闻资讯
  createNews: async (data: NewsVO) => {
    return await request.post({ url: `/system/news/create`, data })
  },

  // 修改新闻资讯
  updateNews: async (data: NewsVO) => {
    return await request.put({ url: `/system/news/update`, data })
  },

  // 删除新闻资讯
  deleteNews: async (id: number) => {
    return await request.delete({ url: `/system/news/delete?id=` + id })
  },

  // 导出新闻资讯 Excel
  exportNews: async (params) => {
    return await request.download({ url: `/system/news/export-excel`, params })
  }
}