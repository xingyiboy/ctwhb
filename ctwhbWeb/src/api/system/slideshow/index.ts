import request from '@/config/axios'

// 轮播图 VO
export interface SlideshowVO {
  id: number // 用户ID
  picture: string // 图片
  url: string // 跳转链接
}

// 轮播图 API
export const SlideshowApi = {
  // 查询轮播图分页
  getSlideshowPage: async (params: any) => {
    return await request.get({ url: `/system/slideshow/page`, params })
  },

  // 查询轮播图详情
  getSlideshow: async (id: number) => {
    return await request.get({ url: `/system/slideshow/get?id=` + id })
  },

  // 新增轮播图
  createSlideshow: async (data: SlideshowVO) => {
    return await request.post({ url: `/system/slideshow/create`, data })
  },

  // 修改轮播图
  updateSlideshow: async (data: SlideshowVO) => {
    return await request.put({ url: `/system/slideshow/update`, data })
  },

  // 删除轮播图
  deleteSlideshow: async (id: number) => {
    return await request.delete({ url: `/system/slideshow/delete?id=` + id })
  },

  // 导出轮播图 Excel
  exportSlideshow: async (params) => {
    return await request.download({ url: `/system/slideshow/export-excel`, params })
  }
}