<template>
  <view class="detail-container">
    <!-- 视频内容 -->
    <view class="video-content">
      <!-- 视频播放器 -->
      <view class="video-player">
        <video :src="currentVideo" class="video" controls :poster="detail.picture"></video>
      </view>

      <!-- 视频信息 -->
      <view class="video-info">
        <view class="title">{{ detail.title }}</view>
        <view class="stats">
          <view class="stat-item">
            <uni-icons type="eye" size="14"></uni-icons>
            <text>{{ detail.views || 0 }}次观看</text>
          </view>
          <view class="action-item" @click="handleLike">
            <uni-icons :type="isLiked ? 'heart-filled' : 'heart'" size="14"
              :color="isLiked ? '#ff4d4f' : '#999'"></uni-icons>
            <text>{{ detail.likes || 0 }}</text>
          </view>
          <view class="action-item" @click="handleCollect">
            <uni-icons :type="isCollected ? 'star-filled' : 'star'" size="14"
              :color="isCollected ? '#ffc107' : '#999'"></uni-icons>
            <text>收藏</text>
          </view>
          <view class="stat-item">
            <uni-icons type="chat" size="14"></uni-icons>
            <text>{{ detail.comment || 0 }}条评论</text>
          </view>
        </view>
      </view>

      <!-- 如果有多个视频，显示视频列表 -->
      <view class="video-list" v-if="videoList.length > 1">
        <view class="section-title">视频列表</view>
        <view v-for="(video, index) in videoList" :key="index"
          :class="['video-item', { active: currentVideo === video }]" @click="switchVideo(video)">
          <uni-icons type="videocam" size="16"></uni-icons>
          <text>第{{ index + 1 }}集</text>
        </view>
      </view>
    </view>

    <!-- 评论列表 -->
    <view class="comments-section">
      <view class="section-title">评论 ({{ comments.length }})</view>
      <view class="comment-list">
        <view class="comment-item" v-for="(item, index) in comments" :key="index">
          <image :src="item.avatar || '/static/avatar/default.png'" class="comment-avatar"></image>
          <view class="comment-content">
            <view class="comment-user">{{ item.userName || '用户' }}</view>
            <view class="comment-text">{{ item.content }}</view>
            <view class="comment-time">{{ formatDate(item.createTime) }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 评论输入框 -->
    <view class="comment-input">
      <input type="text" v-model="commentText" placeholder="说点什么..." @confirm="submitComment" />
      <button @click="submitComment" :disabled="!commentText.trim()">发送</button>
    </view>
  </view>
</template>

<script>
import { getEducationDetail, getEducationComments, createComment, createLike, isLike, createCollect, isCollect } from '@/api/education';

export default {
  data() {
    return {
      id: null,
      detail: {},
      comments: [],
      commentText: '',
      isLiked: false,
      isCollected: false,
      videoList: [],
      currentVideo: ''
    };
  },
  onLoad(options) {
    this.id = options.id;
    this.loadDetail();
    this.loadComments();
    this.checkLikeStatus();
    this.checkCollectStatus();
  },
  methods: {
    async loadDetail() {
      try {
        const res = await getEducationDetail(this.id);
        this.detail = res.data;
        // 处理视频列表
        if (this.detail.vidio) {
          this.videoList = this.detail.vidio.split(',');
          this.currentVideo = this.videoList[0]; // 默认播放第一个视频
        }
      } catch (error) {
        uni.showToast({
          title: '获取详情失败',
          icon: 'none'
        });
      }
    },
    async loadComments() {
      try {
        const res = await getEducationComments(this.id);
        this.comments = res.data;
      } catch (error) {
        uni.showToast({
          title: '获取评论失败',
          icon: 'none'
        });
      }
    },
    async checkLikeStatus() {
      try {
        const res = await isLike(this.id);
        this.isLiked = res.data;
      } catch (error) {
        console.error('获取点赞状态失败', error);
      }
    },
    async checkCollectStatus() {
      try {
        const res = await isCollect(this.id);
        this.isCollected = res.data;
      } catch (error) {
        console.error('获取收藏状态失败', error);
      }
    },
    async handleLike() {
      try {
        const userInfo = uni.getStorageSync('userInfo');
        await createLike({
          educationId: this.id,
          userId: userInfo.id
        });
        this.isLiked = !this.isLiked;
        await this.loadDetail();

        uni.showToast({
          title: this.isLiked ? '点赞成功' : '取消点赞成功',
          icon: 'success'
        });
      } catch (error) {
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        });
      }
    },
    async handleCollect() {
      try {
        const userInfo = uni.getStorageSync('userInfo');
        await createCollect({
          educationId: this.id,
          userId: userInfo.id
        });
        this.isCollected = !this.isCollected;

        uni.showToast({
          title: this.isCollected ? '收藏成功' : '取消收藏成功',
          icon: 'success'
        });
      } catch (error) {
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        });
      }
    },
    async submitComment() {
      if (!this.commentText.trim()) return;

      try {
        const userInfo = uni.getStorageSync('userInfo');
        await createComment({
          educationId: this.id,
          userId: userInfo.id,
          content: this.commentText.trim()
        });

        this.commentText = '';
        this.loadComments();
        this.loadDetail();

        uni.showToast({
          title: '评论成功',
          icon: 'success'
        });
      } catch (error) {
        uni.showToast({
          title: '评论失败',
          icon: 'none'
        });
      }
    },
    switchVideo(video) {
      this.currentVideo = video;
    },
    handleVideoError() {
      uni.showToast({
        title: '视频加载失败',
        icon: 'none'
      });
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

<style>
.detail-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 100rpx;
}

.video-content {
  background-color: #fff;
  margin-bottom: 20rpx;
}

.video-player {
  width: 100%;
  height: 422rpx;
  /* 16:9 比例 */
  background-color: #000;
}

.video {
  width: 100%;
  height: 100%;
}

.video-info {
  padding: 30rpx;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.stats {
  display: flex;
  gap: 40rpx;
}

.stat-item,
.action-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: #999;
}

.video-list {
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #eee;
}

.video-item {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 20rpx 0;
  font-size: 28rpx;
  color: #666;
}

.video-item.active {
  color: #1890ff;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.comments-section {
  background-color: #fff;
  padding: 30rpx;
}

.comment-item {
  display: flex;
  margin-bottom: 30rpx;
}

.comment-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.comment-content {
  flex: 1;
}

.comment-user {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.comment-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
}

.comment-time {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}

.comment-input {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: #fff;
  border-top: 1rpx solid #eee;
}

.comment-input input {
  flex: 1;
  height: 72rpx;
  background-color: #f5f5f5;
  border-radius: 36rpx;
  padding: 0 30rpx;
  margin-right: 20rpx;
  font-size: 28rpx;
}

.comment-input button {
  width: 120rpx;
  height: 72rpx;
  line-height: 72rpx;
  text-align: center;
  background-color: #1890ff;
  color: #fff;
  border-radius: 36rpx;
  font-size: 28rpx;
}

.comment-input button[disabled] {
  background-color: #ccc;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: #999;
  cursor: pointer;
}

.action-item:active {
  opacity: 0.8;
}
</style>
