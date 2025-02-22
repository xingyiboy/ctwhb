<template>
  <view class="mine-container" :style="{ height: `${windowHeight}px` }">
    <!--顶部个人信息栏-->
    <view class="header-section">
      <view class="header-content">
        <view class="user-profile">
          <view v-if="!avatar" class="cu-avatar xl round">
            <view class="iconfont icon-people"></view>
          </view>
          <image v-if="avatar" @click="handleToAvatar" :src="avatar" class="cu-avatar xl round" mode="aspectFill">
          </image>
          <view v-if="!name" @click="handleToLogin" class="login-tip">
            点击登录
          </view>
          <view v-if="name" @click="handleToInfo" class="user-info">
            <view class="username">{{ name }}</view>
          </view>
        </view>
        <view class="profile-link" @click="handleToInfo">
          <text>个人信息</text>
          <view class="iconfont icon-right"></view>
        </view>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-list">
        <view class="menu-item" @click="handleToEditInfo">
          <view class="menu-item-content">
            <view class="icon-wrapper">
              <view class="iconfont icon-user"></view>
            </view>
            <text>编辑资料</text>
          </view>
          <view class="iconfont icon-right arrow"></view>
        </view>

        <view class="menu-item" @click="handleToPwd">
          <view class="menu-item-content">
            <view class="icon-wrapper">
              <view class="iconfont icon-password"></view>
            </view>
            <text>修改密码</text>
          </view>
          <view class="iconfont icon-right arrow"></view>
        </view>

        <view class="menu-item" @click="handleAbout">
          <view class="menu-item-content">
            <view class="icon-wrapper">
              <view class="iconfont icon-aixin"></view>
            </view>
            <text>视频收藏</text>
          </view>
          <view class="iconfont icon-right arrow"></view>
        </view>

        <view class="menu-item" @click="handleToSetting">
          <view class="menu-item-content">
            <view class="icon-wrapper">
              <view class="iconfont icon-edit"></view>
            </view>
            <text>历史记录</text>
          </view>
          <view class="iconfont icon-right arrow"></view>
        </view>
      </view>
    </view>

    <view class="logout-section">
      <view class="logout-button" @click="handleLogout">
        <text>退出登录</text>
      </view>
    </view>
  </view>
</template>

<script>
import storage from '@/utils/storage'

export default {
  data() {
    return {
      version: getApp().globalData.config.appInfo.version,
      windowHeight: uni.getSystemInfoSync().windowHeight
    }
  },
  computed: {
    name() {
      return this.$store.state.user.name
    },
    avatar() {
      return this.$store.state.user.avatar
    },
    windowHeight() {
      return uni.getSystemInfoSync().windowHeight - 50
    }
  },
  methods: {
    handleToPwd() {
      this.$tab.navigateTo('/pages/mine/pwd/index');
    },
    handleToUpgrade() {
      this.$modal.showToast('模块建设中~');
    },
    handleCleanTmp() {
      this.$modal.showToast('模块建设中~');
    },
    handleLogout() {
      this.$modal.confirm('确定注销并退出系统吗？').then(() => {
        this.$store.dispatch('LogOut').then(() => {
          this.$tab.reLaunch('/pages/index');
        });
      });
    },
    handleToInfo() {
      this.$tab.navigateTo('/pages/mine/info/index')
    },
    handleToEditInfo() {
      this.$tab.navigateTo('/pages/mine/info/edit')
    },
    handleToSetting() {
      this.$tab.navigateTo('/pages/history-record/index')
    },
    handleToLogin() {
      this.$tab.reLaunch('/pages/login')
    },
    handleToAvatar() {
      this.$tab.navigateTo('/pages/mine/avatar/index')
    },
    handleLogout() {
      this.$modal.confirm('确定注销并退出系统吗？').then(() => {
        this.$store.dispatch('LogOut').then(() => {
          this.$tab.reLaunch('/pages/index')
        })
      })
    },
    handleHelp() {
      this.$tab.navigateTo('/pages/mine/help/index')
    },
    handleAbout() {
      this.$tab.navigateTo('/pages/collect/index')
    },
    handleJiaoLiuQun() {
      this.$modal.showToast('微信搜索 naidaguo 后，添加好友后拉你进技术交流群')
    },
    handleBuilding() {
      this.$modal.showToast('模块建设中~')
    }
  }
}
</script>

<style lang="scss">
.mine-container {
  background-color: #f5f7fa;

  .header-section {
    padding: 40rpx 30rpx 60rpx;
    background: linear-gradient(135deg, #3b7cff, #6698ff);
    border-radius: 0 0 30rpx 30rpx;

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .user-profile {
      display: flex;
      align-items: center;

      .cu-avatar {
        width: 120rpx;
        height: 120rpx;
        border: 4rpx solid rgba(255, 255, 255, 0.3);
        background: rgba(255, 255, 255, 0.2);

        .iconfont {
          font-size: 60rpx;
          color: rgba(255, 255, 255, 0.9);
        }
      }

      .login-tip {
        margin-left: 24rpx;
        font-size: 32rpx;
        color: #ffffff;
        font-weight: 500;
      }

      .user-info {
        margin-left: 24rpx;

        .username {
          font-size: 36rpx;
          color: #ffffff;
          font-weight: 600;
        }
      }
    }

    .profile-link {
      display: flex;
      align-items: center;
      padding: 12rpx 24rpx;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 30rpx;

      text {
        color: #ffffff;
        font-size: 26rpx;
      }

      .iconfont {
        margin-left: 8rpx;
        color: #ffffff;
        font-size: 24rpx;
      }
    }
  }

  .menu-section {
    margin: 30rpx 30rpx 0;
    padding: 20rpx;
    background: #ffffff;
    border-radius: 24rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

    .menu-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx 20rpx;
      border-bottom: 2rpx solid #f5f7fa;

      &:last-child {
        border-bottom: none;
      }

      .menu-item-content {
        display: flex;
        align-items: center;

        .icon-wrapper {
          width: 80rpx;
          height: 80rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f5ff;
          border-radius: 20rpx;
          margin-right: 20rpx;

          .iconfont {
            font-size: 40rpx;
            color: #3b7cff;
          }
        }

        text {
          font-size: 28rpx;
          color: #333333;
          font-weight: 500;
        }
      }

      .arrow {
        color: #999999;
        font-size: 24rpx;
      }
    }
  }

  .logout-section {
    margin: 60rpx 30rpx;

    .logout-button {
      padding: 30rpx 0;
      text-align: center;
      background: #ffffff;
      border-radius: 12rpx;
      box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

      text {
        font-size: 32rpx;
        color: #ff4d4f;
        font-weight: 500;
      }
    }
  }
}
</style>
