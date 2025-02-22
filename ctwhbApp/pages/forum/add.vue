<template>
  <view class="add-container">
    <uni-forms ref="form" :model="formData" :rules="rules" label-position="top">
      <!-- 标题 -->
      <uni-forms-item name="title" label="标题：">
        <uni-easyinput v-model="formData.title" placeholder="请输入标题" :inputBorder="false" />
      </uni-forms-item>

      <!-- 分类 -->
      <uni-forms-item name="classify" label="分类：">
        <uni-data-checkbox v-model="formData.classify" :localdata="categories" selectedColor="#1890ff" />
      </uni-forms-item>

      <!-- 简介 -->
      <uni-forms-item name="introduce" label="简介：">
        <uni-easyinput v-model="formData.introduce" type="textarea" placeholder="请输入简介" :inputBorder="false" />
      </uni-forms-item>

      <!-- 内容 -->
      <uni-forms-item name="content" label="内容：">
        <editor id="editor" class="editor" @ready="onEditorReady" @input="onEditorInput"></editor>
      </uni-forms-item>

      <!-- 首页图片 -->
      <uni-forms-item name="picture" label="首页图片：">
        <view class="upload-box">
          <view class="upload-item" v-if="formData.picture">
            <image :src="formData.picture" mode="aspectFill"></image>
            <view class="delete-btn" @click="deletePicture">
              <uni-icons type="trash" size="20" color="#fff"></uni-icons>
            </view>
          </view>
          <view v-else class="upload-btn" @click="choosePicture">
            <uni-icons type="plusempty" size="30" color="#999"></uni-icons>
            <text>上传图片</text>
          </view>
        </view>
      </uni-forms-item>
    </uni-forms>

    <!-- 提交按钮 -->
    <view class="submit-btn">
      <button type="primary" @click="submitForm">发布帖子</button>
    </view>
  </view>
</template>

<script>
import { uploadFile, createForum, getDictDataListByType } from '@/api/ctwhb';

export default {
  data() {
    return {
      formData: {
        title: '',
        classify: '',
        introduce: '',
        content: '',
        picture: ''
      },
      categories: [],
      editorCtx: null,
      rules: {
        title: {
          rules: [
            {
              required: true,
              errorMessage: '请输入标题'
            }
          ]
        },
        classify: {
          rules: [
            {
              required: true,
              errorMessage: '请选择分类'
            }
          ]
        },
        introduce: {
          rules: [
            {
              required: true,
              errorMessage: '请输入简介'
            }
          ]
        },
        content: {
          rules: [
            {
              required: true,
              errorMessage: '请输入内容'
            }
          ]
        },
        picture: {
          rules: [
            {
              required: true,
              errorMessage: '请上传首页图片'
            }
          ]
        }
      }
    };
  },
  onLoad() {
    this.loadCategories();
  },
  methods: {
    async loadCategories() {
      try {
        const res = await getDictDataListByType('forum_classify');
        this.categories = res.data.map((item) => ({
          value: parseInt(item.value),
          text: item.label
        }));
      } catch (error) {
        uni.showToast({
          title: '获取分类失败',
          icon: 'none'
        });
      }
    },
    onEditorReady() {
      uni
        .createSelectorQuery()
        .select('#editor')
        .context((res) => {
          this.editorCtx = res.context;
        })
        .exec();
    },
    onEditorInput(e) {
      this.formData.content = e.detail.html;
    },
    async choosePicture() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: async (res) => {
          try {
            uni.showLoading({ title: '上传中...' });

            const uploadRes = await uploadFile(res.tempFilePaths[0]);

            if (uploadRes.code === 0) {
              this.formData.picture = uploadRes.data;
              uni.showToast({
                title: '上传成功',
                icon: 'success'
              });
            } else {
              uni.showToast({
                title: uploadRes.msg || '上传失败',
                icon: 'none'
              });
            }
          } catch (error) {
            console.error('上传失败：', error);
            uni.showToast({
              title: '上传失败',
              icon: 'none'
            });
          } finally {
            uni.hideLoading();
          }
        },
        fail: (error) => {
          console.error('选择图片失败：', error);
          uni.showToast({
            title: '选择图片失败',
            icon: 'none'
          });
        }
      });
    },
    deletePicture() {
      this.formData.picture = '';
    },
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) return;

        try {
          uni.showLoading({ title: '发布中...' });
          await createForum(this.formData);

          uni.showToast({
            title: '发布成功',
            icon: 'success'
          });

          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        } catch (error) {
          uni.showToast({
            title: '发布失败',
            icon: 'none'
          });
        } finally {
          uni.hideLoading();
        }
      });
    }
  }
};
</script>

<style>
.add-container {
  padding: 30rpx;
  background-color: #f5f5f5;
}

.editor {
  min-height: 300rpx;
  background-color: #fff;
  padding: 20rpx;
  border-radius: 8rpx;
}

.upload-box {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.upload-item {
  width: 200rpx;
  height: 200rpx;
  position: relative;
}

.upload-item image {
  width: 100%;
  height: 100%;
  border-radius: 8rpx;
}

.delete-btn {
  position: absolute;
  top: -20rpx;
  right: -20rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-btn {
  width: 200rpx;
  height: 200rpx;
  background-color: #fff;
  border: 2rpx dashed #ddd;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-btn text {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}

.submit-btn {
  margin-top: 40rpx;
  padding: 20rpx;
}

.submit-btn button {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 32rpx;
}
</style>
