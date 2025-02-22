<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search-box">
      <view class="search-input">
        <uni-icons type="search" size="16" color="#999"></uni-icons>
        <input type="text" v-model="searchKey" placeholder="搜索传统文化内容" @input="handleSearch" />
        <uni-icons v-if="searchKey" type="clear" size="16" color="#999" @click="clearSearch"></uni-icons>
      </view>
    </view>
    <!-- 轮播图 (搜索时隐藏) -->
    <swiper v-if="!isSearching" class="swiper" circular :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
      <swiper-item v-for="(item, index) in swiperList" :key="index" @click="handleSwiperClick(item)" class="swiper-item">
        <image :src="item.picture" mode="aspectFill"></image>
      </swiper-item>
    </swiper>

    <!-- 内容区域（添加下拉刷新） -->
    <scroll-view scroll-y="true" class="scroll-content" refresher-enabled="true" :refresher-triggered="isRefreshing" @refresherrefresh="onRefresh" @scrolltolower="onLoadMore">
      <!-- 新闻资讯 -->
      <view class="news-section">
        <view class="section-title" v-if="!isSearching">
          <text>传统文化资讯</text>
          <!-- <text class="more" @click="goToNewsList">更多 ></text> -->
        </view>
        <view v-else class="search-result-title">
          <text>搜索结果</text>
          <text class="search-count">(共 {{ total }} 条)</text>
        </view>

        <view class="news-list">
          <view class="news-item" v-for="(item, index) in newsList" :key="index" @click="goToNewsDetail(item)">
            <image :src="item.picture" mode="aspectFill" class="news-image"></image>
            <view class="news-info">
              <text class="news-title">{{ item.title }}</text>
              <view class="news-bottom">
                <text class="news-time">{{ formatDate(item.createTime) }}</text>
                <text class="news-views">{{ item.view }}阅读</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 加载更多状态 -->
        <view class="load-more" v-if="newsList.length > 0">
          <text v-if="hasMore">上拉加载更多</text>
          <text v-else>没有更多数据了</text>
        </view>

        <!-- 无搜索结果提示 -->
        <view v-if="isSearching && newsList.length === 0" class="no-result">
          <image src="/static/images/no-result.png" mode="aspectFit"></image>
          <text>暂无相关内容</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { getSlideshowPage, getNewsPage } from '@/api/ctwhb';

export default {
  data() {
    return {
      searchKey: '',
      swiperList: [],
      newsList: [],
      isSearching: false,
      isRefreshing: false,
      // 分页参数
      queryParams: {
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      hasMore: true,
      // 搜索防抖定时器
      searchTimer: null
    };
  },
  onLoad() {
    this.loadData();
  },
  onShow() {
    // 每次进入页面时重新加载数据
    if (!this.isSearching) {
      // 如果不是搜索状态才重新加载
      this.queryParams.pageNo = 1; // 重置页码
      this.loadData();
    }
  },
  methods: {
    async loadData() {
      // 获取轮播图数据
      const slideshowRes = await getSlideshowPage(this.queryParams);
      this.swiperList = slideshowRes.data.list;

      // 获取新闻列表
      await this.loadNewsList();
    },
    async loadNewsList(isLoadMore = false) {
      try {
        const params = {
          ...this.queryParams,
          title: this.searchKey
        };
        const newsRes = await getNewsPage(params);

        // 更新总数
        this.total = newsRes.data.total;

        // 判断是否还有更多数据
        this.hasMore = this.queryParams.pageNo * this.queryParams.pageSize < this.total;

        // 处理数据列表
        if (isLoadMore) {
          this.newsList = [...this.newsList, ...newsRes.data.list];
        } else {
          this.newsList = newsRes.data.list;
        }
      } catch (error) {
        uni.showToast({
          title: '获取新闻列表失败',
          icon: 'none'
        });
      }
    },
    // 下拉刷新
    async onRefresh() {
      this.isRefreshing = true;
      this.queryParams.pageNo = 1;
      await this.loadData();
      this.isRefreshing = false;
    },
    // 上拉加载更多
    async onLoadMore() {
      if (!this.hasMore) return;
      this.queryParams.pageNo++;
      await this.loadNewsList(true);
    },
    handleSearch(e) {
      // 设置搜索状态
      this.isSearching = !!this.searchKey;

      // 防抖处理
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }
      this.searchTimer = setTimeout(() => {
        this.queryParams.pageNo = 1; // 重置页码
        this.loadNewsList();
      }, 300);
    },
    clearSearch() {
      this.searchKey = '';
      this.isSearching = false;
      this.queryParams.pageNo = 1;
      this.loadData();
    },
    handleSwiperClick(item) {
      // 处理轮播图点击
      uni.navigateTo({
        url: `/pages/news/detail?id=${item.id}`
      });
    },
    goToNewsDetail(item) {
      // 跳转到新闻详情
      uni.navigateTo({
        url: `/pages/news/detail?id=${item.id}`
      });
    },
    goToNewsList() {
      // 跳转到新闻列表
      uni.navigateTo({
        url: '/pages/news/list'
      });
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleDateString();
    }
  }
};
</script>

<style>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f6f8fb;
}

.scroll-content {
  flex: 1;
  height: 0;
}

.load-more {
  text-align: center;
  padding: 30rpx 0;
  color: #666;
  font-size: 26rpx;
}

.search-box {
  padding: 15rpx 20rpx;
  padding-top: calc(15rpx + constant(safe-area-inset-top));
  padding-top: calc(15rpx + env(safe-area-inset-top));
  background: linear-gradient(120deg, #4d7fff, #3366ff);
}

.search-input {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20rpx 25rpx;
  border-radius: 35rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.search-input input {
  flex: 1;
  margin-left: 10rpx;
  font-size: 28rpx;
  height: 40rpx;
  line-height: 40rpx;
  color: #333;
}

.swiper {
  width: calc(100% - 40rpx);
  height: 300rpx;
  margin: 20rpx auto;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 20rpx rgba(77, 127, 255, 0.15);
}

.swiper-item {
  border-radius: 12rpx;
  /* 给 swiper-item 添加圆角 */
  overflow: hidden;
  /* 确保圆角生效 */
}

.swiper image {
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
}

.news-section {
  margin: 0 20rpx;
  padding: 20rpx;
  background: #ffffff;
  border-radius: 20rpx 20rpx 0 0;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  margin-bottom: 20rpx;
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 200rpx;
  height: 6rpx;
  background: #4d7fff;
  border-radius: 3rpx;
}

.news-list {
  margin-top: 20rpx;
}

.news-item {
  display: flex;
  padding: 20rpx;
  margin-bottom: 20rpx;
  background: #ffffff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.news-item:active {
  transform: scale(0.98);
  transition: all 0.2s;
}

.news-image {
  width: 200rpx;
  height: 140rpx;
  border-radius: 8rpx;
  object-fit: cover;
}

.news-info {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.news-title {
  font-size: 28rpx;
  line-height: 1.5;
  color: #333;
  font-weight: 500;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.news-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10rpx;
}

.news-time,
.news-views {
  font-size: 24rpx;
  color: #999;
}

.search-result-title {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
}

.search-result-title text:first-child {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.search-count {
  margin-left: 10rpx;
  font-size: 26rpx;
  color: #999;
}

.no-result {
  padding: 60rpx 0;
  text-align: center;
}

.no-result image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
}

.no-result text {
  font-size: 28rpx;
  color: #999;
}
</style>
