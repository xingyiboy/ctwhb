<template>
  <view class="education-container">
    <!-- 视频列表 -->
    <scroll-view scroll-y class="video-list" @scrolltolower="loadMore" refresher-enabled
      :refresher-triggered="isRefreshing" @refresherrefresh="refresh">
      <view class="video-grid">
        <view class="video-item" v-for="(item, index) in videoList" :key="index" @click="goToDetail(item.id)">
          <!-- 视频封面 -->
          <view class="video-cover">
            <image :src="item.picture" mode="aspectFill"></image>
            <!-- 统计信息 -->
            <view class="stats-overlay">
              <view class="stats-group">
                <view class="stat-item">
                  <uni-icons type="eye" size="12" color="#fff"></uni-icons>
                  <text>{{ item.views || 0 }}</text>
                </view>
                <view class="stat-item">
                  <uni-icons type="chat" size="12" color="#fff"></uni-icons>
                  <text>{{ item.comment || 0 }}</text>
                </view>
                <view class="stat-item">
                  <uni-icons type="heart" size="12" color="#fff"></uni-icons>
                  <text>{{ item.likes || 0 }}</text>
                </view>
              </view>
            </view>
          </view>

          <!-- 视频信息 -->
          <view class="video-info">
            <text class="video-title">{{ item.title }}</text>
            <view class="author-info">
              <uni-icons type="person" size="12" color="#4080ff"></uni-icons>
              <text class="author-name">{{ item.userName }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载更多提示 -->
      <view class="load-more" v-if="videoList.length > 0">
        <text v-if="hasMore">上拉加载更多</text>
        <text v-else>没有更多数据了</text>
      </view>

      <!-- 无数据提示 -->
      <view v-if="videoList.length === 0" class="empty-tip">
        <image src="/static/images/empty.png" mode="aspectFit"></image>
        <text>暂无视频</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { getEducationPage } from '@/api/education';

export default {
  data() {
    return {
      videoList: [],
      isRefreshing: false,
      queryParams: {
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      hasMore: true
    };
  },
  onShow() {
    // 每次进入页面刷新数据
    this.refresh();
  },
  onLoad() {
    this.loadVideos();
  },
  methods: {
    async loadVideos(isLoadMore = false) {
      try {
        const res = await getEducationPage(this.queryParams);
        this.total = res.data.total;
        this.hasMore = this.queryParams.pageNo * this.queryParams.pageSize < this.total;

        if (isLoadMore) {
          this.videoList = [...this.videoList, ...res.data.list];
        } else {
          this.videoList = res.data.list;
        }
      } catch (error) {
        uni.showToast({
          title: '获取视频列表失败',
          icon: 'none'
        });
      }
    },
    async refresh() {
      this.isRefreshing = true;
      this.queryParams.pageNo = 1;
      await this.loadVideos();
      this.isRefreshing = false;
    },
    async loadMore() {
      if (!this.hasMore) return;
      this.queryParams.pageNo++;
      await this.loadVideos(true);
    },
    goToDetail(id) {
      uni.navigateTo({
        url: `/pages/education/detail?id=${id}`
      });
    }
  }
};
</script>

<style lang="scss">
.education-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20rpx;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.video-item {
  background: linear-gradient(to bottom, #ffffff, #f8fafd);
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;

  &:active {
    transform: scale(0.98);
  }
}

.video-cover {
  position: relative;
  width: 100%;
  height: 220rpx;

  image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.stats-overlay {
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  padding: 16rpx;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
}

.stats-group {
  display: flex;
  gap: 20rpx;
  padding-left: 10rpx;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6rpx;
  color: #fff;
  font-size: 22rpx;

  .uni-icons {
    opacity: 0.9;
  }
}

.video-info {
  padding: 16rpx;
}

.video-title {
  font-size: 28rpx;
  color: #333;
  line-height: 1.4;
  height: 80rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin-bottom: 12rpx;
  font-weight: 500;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 6rpx;

  .author-name {
    font-size: 24rpx;
    color: #4080ff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.load-more {
  text-align: center;
  padding: 40rpx 0;
  color: #8a9ab0;
  font-size: 26rpx;
}

.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;

  image {
    width: 240rpx;
    height: 240rpx;
    margin-bottom: 30rpx;
    opacity: 0.8;
  }

  text {
    font-size: 28rpx;
    color: #8a9ab0;
  }
}

.video-list {
  height: calc(100vh - 40rpx);
}
</style>
