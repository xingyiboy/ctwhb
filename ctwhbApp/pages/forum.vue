<template>
  <view class="forum-container">
    <!-- 分类导航 -->
    <view class="category-wrapper">
      <scroll-view scroll-x class="category-scroll" :show-scrollbar="false">
        <view class="category-list">
          <view v-for="(item, index) in categories" :key="index"
            :class="['category-item', { active: currentCategory === item.value }]" @click="switchCategory(item.value)">
            {{ item.label }}
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 帖子列表 -->
    <scroll-view scroll-y class="post-list" @scrolltolower="loadMore" refresher-enabled
      :refresher-triggered="isRefreshing" @refresherrefresh="refresh">
      <view class="post-item" v-for="(item, index) in postList" :key="index" @click="goToDetail(item.id)">
        <view class="post-header">
          <view class="user-info">
            <image :src="item.avatar || '/static/avatar/default.png'" class="avatar"></image>
            <view class="user-meta">
              <text class="username">{{ item.userName || '用户' }}</text>
              <text class="time">{{ formatDate(item.createTime) }}</text>
            </view>
          </view>
          <view class="post-tag"># {{ getCategoryName(item.classify) }}</view>
        </view>

        <view class="post-content">
          <view class="post-title">{{ item.title }}</view>
          <view class="post-text">{{ item.introduce }}</view>
          <view class="post-images" v-if="item.picture">
            <image :src="item.picture" mode="aspectFill"></image>
          </view>
        </view>

        <view class="post-footer">
          <view class="interaction-stats">
            <view class="stat-item">
              <uni-icons type="eye" size="16" color="#8a9ab0"></uni-icons>
              <text>{{ item.view || 0 }}</text>
            </view>
            <view class="stat-item">
              <uni-icons type="chat" size="16" color="#8a9ab0"></uni-icons>
              <text>{{ item.comment || 0 }}</text>
            </view>
            <view class="stat-item">
              <uni-icons type="heart" size="16" color="#8a9ab0"></uni-icons>
              <text>{{ item.likes || 0 }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载更多提示 -->
      <view class="load-more" v-if="postList.length > 0">
        <text v-if="hasMore">上拉加载更多</text>
        <text v-else>没有更多数据了</text>
      </view>

      <!-- 无数据提示 -->
      <view v-if="postList.length === 0" class="empty-tip">
        <image src="/static/images/empty.png" mode="aspectFit"></image>
        <text>暂无帖子</text>
      </view>
    </scroll-view>

    <!-- 发帖按钮 -->
    <view class="post-btn" @click="goToPost">
      <uni-icons type="plusempty" size="24" color="#fff"></uni-icons>
      <text class="post-btn-text">发帖</text>
    </view>
  </view>
</template>

<script>
import { getForumPage, getDictDataListByType } from '@/api/ctwhb';

export default {
  data() {
    return {
      currentCategory: '',
      categories: [],
      postList: [],
      isRefreshing: false,
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        classify: ''
      },
      total: 0,
      hasMore: true
    };
  },
  onLoad() {
    this.loadCategories();
    this.loadPosts();
  },
  onShow() {
    // 每次进入页面刷新数据
    this.refresh();
  },
  methods: {
    async loadCategories() {
      try {
        const res = await getDictDataListByType('forum_classify');
        this.categories = [
          { value: '', label: '全部' },
          ...res.data.map((item) => ({
            value: item.value,
            label: item.label
          }))
        ];
      } catch (error) {
        uni.showToast({
          title: '获取分类失败',
          icon: 'none'
        });
      }
    },
    async loadPosts(isLoadMore = false) {
      try {
        const res = await getForumPage(this.queryParams);
        this.total = res.data.total;
        this.hasMore = this.queryParams.pageNo * this.queryParams.pageSize < this.total;

        if (isLoadMore) {
          this.postList = [...this.postList, ...res.data.list];
        } else {
          this.postList = res.data.list;
        }
      } catch (error) {
        uni.showToast({
          title: '获取帖子失败',
          icon: 'none'
        });
      }
    },
    switchCategory(category) {
      this.currentCategory = category;
      this.queryParams.classify = category;
      this.queryParams.pageNo = 1;
      this.loadPosts();
    },
    async refresh() {
      this.isRefreshing = true;
      this.queryParams.pageNo = 1;
      await this.loadPosts();
      this.isRefreshing = false;
    },
    async loadMore() {
      if (!this.hasMore) return;
      this.queryParams.pageNo++;
      await this.loadPosts(true);
    },
    goToPost() {
      uni.navigateTo({
        url: '/pages/forum/add'
      });
    },
    goToDetail(id) {
      uni.navigateTo({
        url: `/pages/forum/detail?id=${id}`
      });
    },
    getCategoryName(value) {
      const category = this.categories.find((item) => item.value === String(value));
      return category ? category.label : '';
    },
    formatDate(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(
        date.getMinutes()
      ).padStart(2, '0')}`;
    }
  }
};
</script>

<style lang="scss">
.forum-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.category-wrapper {
  position: sticky;
  top: 0;
  z-index: 99;
  background: #fff;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.category-scroll {
  padding: 20rpx 0;
  white-space: nowrap;
}

.category-list {
  padding: 0 20rpx;
  display: inline-flex;
  align-items: center;
}

.category-item {
  padding: 12rpx 30rpx;
  margin-right: 20rpx;
  font-size: 28rpx;
  color: #666;
  background: #f0f2f5;
  border-radius: 32rpx;
  transition: all 0.3s ease;

  &.active {
    color: #fff;
    background: linear-gradient(135deg, #4080ff, #3366ff);
    box-shadow: 0 4rpx 12rpx rgba(64, 128, 255, 0.2);
  }
}

.post-list {
  height: calc(100vh - 88rpx);
  padding: 20rpx;
}

.post-item {
  margin-bottom: 20rpx;
  padding: 24rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 16rpx;
  border: 2rpx solid #eee;
}

.user-meta {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.username {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.time {
  font-size: 24rpx;
  color: #8a9ab0;
}

.post-tag {
  font-size: 24rpx;
  color: #4080ff;
  background: rgba(64, 128, 255, 0.1);
  padding: 6rpx 20rpx;
  border-radius: 20rpx;
}

.post-content {
  margin-bottom: 20rpx;
}

.post-title {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 12rpx;
  line-height: 1.4;
}

.post-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 16rpx;
}

.post-images {
  border-radius: 12rpx;
  overflow: hidden;

  image {
    width: 100%;
    height: 300rpx;
    object-fit: cover;
  }
}

.post-footer {
  border-top: 2rpx solid #f5f7fa;
  padding-top: 16rpx;
}

.interaction-stats {
  display: flex;
  gap: 40rpx;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8rpx;

  text {
    font-size: 26rpx;
    color: #8a9ab0;
  }
}

.post-btn {
  position: fixed;
  right: 40rpx;
  bottom: 120rpx;
  width: 110rpx;
  height: 110rpx;
  background: linear-gradient(135deg, #3b7cff, #6698ff);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6rpx 20rpx rgba(59, 124, 255, 0.35);
  transition: all 0.3s ease;
  border: 4rpx solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);

  &:active {
    transform: scale(0.92);
    box-shadow: 0 4rpx 12rpx rgba(59, 124, 255, 0.25);
  }
}

.post-btn-text {
  font-size: 26rpx;
  color: #fff;
  margin-top: 6rpx;
  font-weight: 500;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translate(-50%, -50%);
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

/* 为了防止内容被固定定位的分类遮挡，需要给内容添加上边距 */
.forum-content {
  margin-top: 100rpx;
  /* 根据实际分类栏高度调整 */
  padding: 20rpx;
}
</style>