import request from '@/config/axios'

// 历史 VO
export interface HistoryVO {
  id: number // 用户ID
  content: string // 内容
  area: string // 地区
  isVideo: number // 视频还是富文本
  vidioUrl: string // 视频路径
  title: string // 标题
}

// 历史 API
export const HistoryApi = {
  // 查询历史分页
  getHistoryPage: async (params: any) => {
    return await request.get({ url: `/system/history/page`, params })
  },

  // 查询历史详情
  getHistory: async (id: number) => {
    return await request.get({ url: `/system/history/get?id=` + id })
  },

  // 新增历史
  createHistory: async (data: HistoryVO) => {
    return await request.post({ url: `/system/history/create`, data })
  },

  // 修改历史
  updateHistory: async (data: HistoryVO) => {
    return await request.put({ url: `/system/history/update`, data })
  },

  // 删除历史
  deleteHistory: async (id: number) => {
    return await request.delete({ url: `/system/history/delete?id=` + id })
  },

  // 导出历史 Excel
  exportHistory: async (params) => {
    return await request.download({ url: `/system/history/export-excel`, params })
  }
}