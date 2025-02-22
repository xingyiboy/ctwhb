<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="视频" prop="vidio">
        <UploadFile v-model="formData.vidio" :file-type="['']" :file-size="500" />
      </el-form-item>
      <el-form-item label="视频标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入视频标题" />
      </el-form-item>
      <el-form-item label="首页图片" prop="picture">
        <UploadImg v-model="formData.picture" />
      </el-form-item>
      <el-form-item label="观看量" prop="views">
        <el-input v-model="formData.views" placeholder="请输入观看量" />
      </el-form-item>
      <el-form-item label="评论量" prop="comment">
        <el-input v-model="formData.comment" placeholder="请输入评论量" />
      </el-form-item>
      <el-form-item label="点赞量" prop="likes">
        <el-input v-model="formData.likes" placeholder="请输入点赞量" />
      </el-form-item>
    </el-form>
    <!-- 子表的表单 -->
    <el-tabs v-model="subTabsName">
      <el-tab-pane label="教育收藏" name="educationCollect">
        <EducationCollectForm ref="educationCollectFormRef" :education-id="formData.id" />
      </el-tab-pane>
      <el-tab-pane label="教育评论" name="educationComment">
        <EducationCommentForm ref="educationCommentFormRef" :education-id="formData.id" />
      </el-tab-pane>
      <el-tab-pane label="教育点赞" name="educationLike">
        <EducationLikeForm ref="educationLikeFormRef" :education-id="formData.id" />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { EducationApi, EducationVO } from '@/api/system/education'
import EducationCollectForm from './components/EducationCollectForm.vue'
import EducationCommentForm from './components/EducationCommentForm.vue'
import EducationLikeForm from './components/EducationLikeForm.vue'

/** 教育 表单 */
defineOptions({ name: 'EducationForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  vidio: undefined,
  title: undefined,
  picture: undefined,
  views: undefined,
  comment: undefined,
  likes: undefined
})
const formRules = reactive({})
const formRef = ref() // 表单 Ref

/** 子表的表单 */
const subTabsName = ref('educationCollect')
const educationCollectFormRef = ref()
const educationCommentFormRef = ref()
const educationLikeFormRef = ref()

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await EducationApi.getEducation(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 校验子表单
  try {
    await educationCollectFormRef.value.validate()
  } catch (e) {
    subTabsName.value = 'educationCollect'
    return
  }
  try {
    await educationCommentFormRef.value.validate()
  } catch (e) {
    subTabsName.value = 'educationComment'
    return
  }
  try {
    await educationLikeFormRef.value.validate()
  } catch (e) {
    subTabsName.value = 'educationLike'
    return
  }
  // 提交请求
  formLoading.value = true
  try {
    if (Array.isArray(formData.value.vidio)) {
      formData.value.vidio = formData.value.vidio.join(',') // 使用逗号作为分隔符
    }

    const data = formData.value as unknown as EducationVO
    // 拼接子表的数据
    data.educationCollects = educationCollectFormRef.value.getData()
    data.educationComments = educationCommentFormRef.value.getData()
    data.educationLikes = educationLikeFormRef.value.getData()
    if (formType.value === 'create') {
      await EducationApi.createEducation(data)
      message.success(t('common.createSuccess'))
    } else {
      await EducationApi.updateEducation(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    vidio: undefined,
    title: undefined,
    picture: undefined,
    views: undefined,
    comment: undefined,
    likes: undefined
  }
  formRef.value?.resetFields()
}
</script>
