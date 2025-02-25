<template>
  <view class="container">
    <!-- 导航栏 -->

    <!-- 地图区域 -->
    <view class="map-container">
      <!-- 底图 -->
      <image
        src="http://43.139.211.116:9000/financinglink/c982e28a0d28a12bbb32d76c98ad480376b829b4f744deabacaf3bb14e879eae.jpg"
        mode="aspectFit" class="base-map"></image>

      <!-- 模块图层 -->
      <div class="modules-layer-hangzhou">
        <div class="clickable-area hangzhou-area" @click="showCityInfo('杭州')"></div>
        <img :class="['modules-map', { active: activeCity == '杭州' }]"
          src="http://43.139.211.116:9000/financinglink/dbe9d761bb21395a1bf361da4cb679ac664bdb5b5151858e333372c837c0a79a.png"
          usemap="#moduleMap" />
      </div>
      <div class="modules-layer-wenzhou">
        <div class="clickable-area wenzhou-area" @click="showCityInfo('温州')"></div>
        <img :class="['modules-map', { active: activeCity == '温州' }]"
          src="http://43.139.211.116:9000/financinglink/d58fbfd5cd0722280fde286a398636a09ce6e717921074d7fe66f99a42ea2fbb.png"
          usemap="#moduleMap" />
      </div>
      <div class="modules-layer-ningbo">
        <div class="clickable-area ningbo-area" @click="showCityInfo('宁波')"></div>
        <img :class="['modules-map', { active: activeCity == '宁波' }]"
          src="http://43.139.211.116:9000/financinglink/f80e41280c87eb1a2c67ba871abb58cda405fc1ee8e1c309b2c0aa99a9b61948.png"
          usemap="#moduleMap" />
      </div>
    </view>

    <!-- 城市信息弹窗 -->
    <uni-popup ref="cityPopup" type="center">
      <view class="history-container">
        <scroll-view scroll-y="true" class="history-scroll">
          <view class="history-list">
            <view class="history-row" v-for="(row, rowIndex) in historyRows" :key="rowIndex">
              <view class="history-item" v-for="item in row" :key="item.id" @click="showHistoryDetail(item)">
                <text class="history-title">{{ item.title }}</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { getHistoryPage } from '@/api/ctwhb.js';

export default {
  data() {
    return {
      activeCity: '',
      historyList: [], // 历史列表数据
      currentCity: {}
    };
  },
  computed: {
    // 将历史列表转换为每行两个的格式
    historyRows() {
      const rows = [];
      for (let i = 0; i < this.historyList.length; i += 2) {
        rows.push(this.historyList.slice(i, i + 2));
      }
      return rows;
    }
  },
  methods: {
    showHistoryDetail(item) {
      // 使用导航跳转并传递参数
      uni.navigateTo({
        url: `/pages/history/detail?content=${encodeURIComponent(item.content)}`
      });
    },
    showCityInfo(cityName) {
      this.getHistoryList(cityName);
      this.activeCity = cityName;
      this.$refs.cityPopup.open();
    },
    closePopup() {
      this.$refs.cityPopup.close();
      this.activeCity = '';
    },
    goToCultureDetail(item) {
      uni.navigateTo({
        url: `/pages/culture/detail?id=${item.id}&type=${item.type}`
      });
    },
    // 获取历史列表
    async getHistoryList(areaName) {
      try {
        const params = {
          pageNo: 1,
          pageSize: 20, // 可以根据需求调整
          area: areaName
        };
        const res = await getHistoryPage(params);
        this.historyList = res.data.list;
      } catch (error) {
        console.error('获取历史列表失败：', error);
        uni.showToast({
          title: '获取历史列表失败',
          icon: 'none'
        });
      }
    }
  }
};
</script>

<style>
.container {
  height: 85.8vh;
  background-color: #fff;
}

.nav-bar {
  padding: 20rpx;
  background-color: #fff;
  text-align: center;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
}

.map-container {
  padding-top: 70rpx;
  width: 100%;
  height: 800rpx;
  position: relative;
  background-color: #fff;
}

.base-map {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.modules-layer-hangzhou {
  position: absolute;
  top: 34rpx;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.modules-layer-wenzhou {
  position: absolute;
  top: 34rpx;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.modules-layer-ningbo {
  position: absolute;
  top: 34rpx;
  left: 0;
  width: 100%;
  height: 100%;
}

.modules-map {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 高亮效果 */
.module-area {
  transition: all 0.3s;
}

.module-area:hover {
  filter: brightness(1.2);
}

.module-area.active {
  filter: brightness(1.5) hue-rotate(45deg);
}

.city-popup {
  width: 80vw;
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
}

.popup-header {
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.city-title {
  font-size: 36rpx;
  font-weight: bold;
}

.close-btn {
  font-size: 40rpx;
  color: #999;
  padding: 0 20rpx;
}

.popup-content {
  max-height: 60vh;
  padding: 30rpx;
}

.info-section {
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.section-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.culture-list {
  margin-top: 20rpx;
}

.culture-item {
  display: flex;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eee;
}

.culture-image {
  width: 160rpx;
  height: 120rpx;
  border-radius: 8rpx;
}

.culture-info {
  flex: 1;
  margin-left: 20rpx;
}

.culture-name {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.culture-desc {
  font-size: 24rpx;
  color: #666;
}

.modules-map.active {
  opacity: 1;
  /* 激活状态完全不透明 */
  transform: scale(1.01);
  /* 略微放大 */
  filter: drop-shadow(0 0 10rpx rgba(0, 0, 255, 1));
  /* 添加阴影效果 */
  z-index: 1;
  /* 确保激活的图片在最上层 */
}

.clickable-area {
  position: absolute;
  pointer-events: auto;
  /* 启用点击区域的点击事件 */
  cursor: pointer;
  z-index: 3;
  /* 设置为高的 z-index 值，使其在最顶层 */
}

/* 为每个城市定义具体的可点击区域 */
.hangzhou-area {
  top: 170rpx;
  /* 这些值需要根据实际地图位置调整 */
  left: 180rpx;
  width: 100rpx;
  height: 250rpx;
  transform: rotate(45deg);
  /* 旋转 45 度 */
}

.wenzhou-area {
  top: 470rpx;
  /* 这些值需要根据实际地图位置调整 */
  left: 300rpx;
  width: 100rpx;
  height: 200rpx;
  transform: rotate(45deg);
  /* 旋转 45 度 */
}

.ningbo-area {
  top: 270rpx;
  /* 这些值需要根据实际地图位置调整 */
  left: 420rpx;
  width: 140rpx;
  height: 100rpx;
  transform: rotate(45deg);
  /* 旋转 45 度 */
}

.history-container {
  z-index: 9999;
  width: 90%;
  /* 设置为屏幕宽度的80% */
  height: 60vh;
  /* 设置为屏幕高度的60% */
  background: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
  position: fixed;
  /* 固定定位 */
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  /* 使用transform实现居中 */
}

.history-scroll {
  height: 100%;
  width: 100%;
  /* 添加内边距 */
}

.history-list {
  padding: 20rpx;
}

.history-row {
  display: flex;
  flex-direction: row;
  /* 确保横向排列 */
  gap: 20rpx;
  /* 项目之间的间距 */
  margin-bottom: 20rpx;
}

.history-item {
  z-index: 9999;
  /* 设置为高的 z-index 值，使其在最顶层 */
  flex: 1;
  min-width: 300rpx;
  /* 设置最小宽度 */
  background-color: #d4e9ff;
  padding: 20rpx;
  border-radius: 8rpx;
  text-align: center;
  /* 文字水平居中 */
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
  /* 添加阴影效果 */
}

.history-title {
  font-size: 28rpx;
  color: #333;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  /* 最多显示两行 */
  overflow: hidden;
}
</style>
