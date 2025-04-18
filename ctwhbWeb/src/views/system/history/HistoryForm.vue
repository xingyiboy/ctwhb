<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="内容" prop="content">
        <Editor v-model="formData.content" height="150px" />
      </el-form-item>
      <el-form-item label="地区" prop="area">
        <el-input v-model="formData.area" placeholder="请输入地区" />
      </el-form-item>
      <!-- <el-form-item label="视频还是富文本" prop="isVideo">
        <el-select v-model="formData.isVideo" placeholder="请选择视频还是富文本">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.IS_VIDEO)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="视频路径" prop="vidioUrl">
        <UploadFile v-model="formData.vidioUrl" :file-type="['']" :file-size="500" />
      </el-form-item> -->
      <el-form-item label="标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入标题" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { HistoryApi, HistoryVO } from '@/api/system/history'

/** 历史 表单 */
defineOptions({ name: 'HistoryForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  content: undefined,
  area: undefined,
  isVideo: undefined,
  vidioUrl: undefined,
  title: undefined
})
const formRules = reactive({})
const formRef = ref() // 表单 Ref

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
      formData.value = await HistoryApi.getHistory(id)
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
  // 提交请求
  formLoading.value = true
  try {
    if (Array.isArray(formData.value.vidioUrl)) {
      formData.value.vidioUrl = formData.value.vidioUrl.join(',') // 使用逗号作为分隔符
    }
    const data = formData.value as unknown as HistoryVO
    if (formType.value === 'create') {
      await HistoryApi.createHistory(data)
      message.success(t('common.createSuccess'))
    } else {
      await HistoryApi.updateHistory(data)
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
    content: undefined,
    area: undefined,
    isVideo: undefined,
    vidioUrl: undefined,
    title: undefined
  }
  formRef.value?.resetFields()
}
</script>
