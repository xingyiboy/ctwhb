import request from '@/config/axios'

// 历史记录 VO
export interface HistoryRecordVO {
  id: number // 用户ID
  historyId: number // 跳转编号
  pageUrl: string // 页面路径
  title: string // 标题
  location: string // 定位名
  userId: number // 用户编号
  picture: string // 首页图片
}

// 历史记录 API
export const HistoryRecordApi = {
  // 查询历史记录分页
  getHistoryRecordPage: async (params: any) => {
    return await request.get({ url: `/system/history-record/page`, params })
  },

  // 查询历史记录详情
  getHistoryRecord: async (id: number) => {
    return await request.get({ url: `/system/history-record/get?id=` + id })
  },

  // 新增历史记录
  createHistoryRecord: async (data: HistoryRecordVO) => {
    return await request.post({ url: `/system/history-record/create`, data })
  },

  // 修改历史记录
  updateHistoryRecord: async (data: HistoryRecordVO) => {
    return await request.put({ url: `/system/history-record/update`, data })
  },

  // 删除历史记录
  deleteHistoryRecord: async (id: number) => {
    return await request.delete({ url: `/system/history-record/delete?id=` + id })
  },

  // 导出历史记录 Excel
  exportHistoryRecord: async (params) => {
    return await request.download({ url: `/system/history-record/export-excel`, params })
  }
}