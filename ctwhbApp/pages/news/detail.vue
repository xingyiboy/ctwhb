<template>
  <view class="news-detail">
    <view class="news-header">
      <text class="title">{{ newsDetail.title }}</text>
      <view class="meta">
        <text class="time">{{ formatDate(newsDetail.createTime) }}</text>
        <text class="views">{{ newsDetail.view || 0 }}阅读</text>
      </view>
    </view>

    <image v-if="newsDetail.picUrl" :src="newsDetail.picUrl" mode="widthFix" class="cover-image"></image>

    <view class="content">
      <rich-text :nodes="newsDetail.content"></rich-text>
    </view>
  </view>
</template>

<script>
import { getNewsDetail } from '@/api/ctwhb';

export default {
  data() {
    return {
      newsId: null,
      newsDetail: {}
    };
  },
  onLoad(options) {
    if (options.id) {
      this.newsId = options.id;
      this.getDetail();
    }
  },

  methods: {
    formatDate(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');
      const second = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    },
    async getDetail() {
      try {
        const res = await getNewsDetail(this.newsId);
        this.newsDetail = res.data;
      } catch (error) {
        uni.showToast({
          title: '获取新闻详情失败',
          icon: 'none'
        });
      }
    }
  }
};
</script>

<style>
.news-detail {
  height: 100vh;
  padding: 30rpx;
  background-color: #ffffff;
}

.news-header {
  margin-bottom: 30rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  line-height: 1.4;
  margin-bottom: 20rpx;
}

.meta {
  margin-top: 10rpx;
  display: flex;
  font-size: 24rpx;
  justify-content: space-between;
  color: #999;
}

.time {
  margin-right: 30rpx;
}

.cover-image {
  width: 100%;
  margin: 20rpx 0;
  border-radius: 8rpx;
}

.content {
  font-size: 28rpx;
  line-height: 1.6;
  color: #333;
}
.views {
  margin-top: -5rpx;
}
</style>
