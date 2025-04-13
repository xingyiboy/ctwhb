<template>
  <view class="history-container">
    <scroll-view scroll-y class="history-list" @scrolltolower="loadMore" refresher-enabled :refresher-triggered="isRefreshing" @refresherrefresh="refresh">
      <!-- 历史记录列表 -->
      <view class="history-item" v-for="(item, index) in historyList" :key="index" @click="goToPage(item)">
        <!-- 左侧图片 -->
        <image :src="item.picture || '/static/images/default.png'" class="history-image" mode="aspectFill"></image>

        <!-- 右侧内容 -->
        <view class="history-content">
          <text class="history-title">{{ item.title }}</text>
          <view class="bottom-info">
            <text class="create-time">{{ formatDate(item.createTime) }}</text>
            <view class="location-tag">{{ item.location }}</view>
          </view>
        </view>
      </view>

      <!-- 加载更多提示 -->
      <view class="load-more" v-if="historyList.length > 0">
        <text v-if="hasMore">上拉加载更多</text>
        <text v-else>没有更多数据了</text>
      </view>

      <!-- 无数据提示 -->
      <view v-if="historyList.length === 0" class="empty-tip">
        <image src="/static/images/empty.png" mode="aspectFit"></image>
        <text>暂无浏览记录</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { getHistoryRecordPage } from '@/api/ctwhb';

export default {
  data() {
    return {
      historyList: [],
      isRefreshing: false,
      queryParams: {
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      hasMore: true
    };
  },
  onLoad() {
    this.loadHistory();
  },
  methods: {
    async loadHistory(isLoadMore = false) {
      try {
        const res = await getHistoryRecordPage(this.queryParams);
        this.total = res.data.total;
        this.hasMore = this.queryParams.pageNo * this.queryParams.pageSize < this.total;

        if (isLoadMore) {
          this.historyList = [...this.historyList, ...res.data.list];
        } else {
          this.historyList = res.data.list;
        }
      } catch (error) {
        uni.showToast({
          title: '获取历史记录失败',
          icon: 'none'
        });
      }
    },

    goToPage(item) {
      uni.navigateTo({
        url: `${item.pageUrl}?id=${item.historyId}`
      });
    },

    async loadMore() {
      if (!this.hasMore) return;
      this.queryParams.pageNo++;
      await this.loadHistory(true);
    },

    async refresh() {
      this.isRefreshing = true;
      this.queryParams.pageNo = 1;
      await this.loadHistory();
      this.isRefreshing = false;
    },

    formatDate(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    }
  }
};
</script>

<style>
.history-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.history-list {
  height: 100vh;
}

.history-item {
  display: flex;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  position: relative;
}

.history-image {
  width: 200rpx;
  height: 140rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}

.history-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.history-title {
  font-size: 28rpx;
  color: #333;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.bottom-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10rpx;
}

.create-time {
  font-size: 24rpx;
  color: #999;
}

.location-tag {
  font-size: 24rpx;
  color: #666;
  background-color: #f5f5f5;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
}

.load-more {
  text-align: center;
  padding: 30rpx;
  color: #999;
  font-size: 24rpx;
}

.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;
}

.empty-tip image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
}

.empty-tip text {
  font-size: 28rpx;
  color: #999;
}
</style>
