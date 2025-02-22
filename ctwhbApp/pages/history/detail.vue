<template>
  <view class="detail-container">
    <!-- 遍历处理后的内容数组 -->
    <block v-for="(item, index) in parsedContent" :key="index">
      <!-- 如果是视频 -->
      <video v-if="item.type === 'video'" :src="item.src" controls class="content-video"></video>
      <!-- 如果是普通文本/HTML -->
      <rich-text v-else :nodes="item.content" class="content-text"></rich-text>
    </block>
  </view>
</template>

<script>
export default {
  data() {
    return {
      parsedContent: []
    };
  },
  onLoad(options) {
    if (options.content) {
      const content = decodeURIComponent(options.content);
      this.parseContent(content);
    }
  },
  methods: {
    parseContent(htmlString) {
      let result = [];
      let currentText = '';

      // 使用正则表达式匹配视频标签
      const videoPattern = /<video[^>]*>.*?<source[^>]*src="([^"]*)".*?<\/video>|<video[^>]*src="([^"]*)".*?<\/video>/g;

      // 分割HTML字符串，分离视频和其他内容
      let lastIndex = 0;
      let match;

      while ((match = videoPattern.exec(htmlString)) !== null) {
        // 添加视频标签之前的文本内容
        const textBefore = htmlString.slice(lastIndex, match.index);
        if (textBefore.trim()) {
          result.push({
            type: 'text',
            content: textBefore
          });
        }

        // 添加视频内容
        result.push({
          type: 'video',
          src: match[1] || match[2] // 获取视频源地址
        });

        lastIndex = videoPattern.lastIndex;
      }

      // 添加最后剩余的文本内容
      const remainingText = htmlString.slice(lastIndex);
      if (remainingText.trim()) {
        result.push({
          type: 'text',
          content: remainingText
        });
      }

      this.parsedContent = result;
    }
  }
};
</script>

<style>
.detail-container {
  padding: 30rpx;
  background-color: #fff;
  min-height: 100vh;
}

.content-video {
  width: 100%;
  margin: 20rpx 0;
}

.content-text {
  margin: 20rpx 0;
}

:deep(img) {
  max-width: 100% !important;
  height: auto !important;
}

:deep(p) {
  margin: 16rpx 0;
  line-height: 1.6;
  font-size: 28rpx;
  color: #333;
}
</style>
