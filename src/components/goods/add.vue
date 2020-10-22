<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 消息提示 -->
      <el-alert title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false">
      </el-alert>
      <!-- 步骤条组件 -->
      <el-steps :space="200"
        :active="activeIndex-0"
        finish-status="success"
        align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
      </el-steps>
      <!-- tab栏区域:el-tab-pane必须是el-tabs的子节点 :tab-position="left"设置tab栏为左右结构tab栏 -->
      <!-- 表单:label-position="top"(设置label在文本框上方) -->
      <el-form :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position='top'>

        <el-tabs v-model="activeIndex"
          :tab-position="'left'"
          style="height: 600px;"
          :before-leave='beforeTabLeave'
          @tab-click='tabClick'>
          <el-tab-pane label="基本信息"
            name="0">
            <el-form-item label="商品名称"
              prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格"
              prop="goods_price">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品重量"
              prop="goods_weight">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品数量"
              prop="goods_number">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品分类"
              prop="goods_cat">
              <el-cascader expandTrigger='hover'
                :options="CateList"
                v-model="addForm.goods_cat"
                :props="CateProps"
                @change="handleChange
               "></el-cascader>

            </el-form-item>

          </el-tab-pane>
          <!-- 商品参数模板 -->
          <el-tab-pane label="商品参数"
            name="1">
            <el-form-item v-for='item in  this.manyTableData'
              :key='item.attr_id'
              :label="item.attr_name">
              <!-- v-model="checkList" -->
              <el-checkbox-group v-model='item.attr_vals'>
                <el-checkbox v-for='(cb,i) in item.attr_vals'
                  :key="i"
                  :label='cb'
                  border=""></el-checkbox>

              </el-checkbox-group>
            </el-form-item>

          </el-tab-pane>
          <el-tab-pane label="商品属性"
            name="2">
            <el-form-item v-for='item in onlyTableData'
              :key="item.attr_id"
              :label="item.attr_name">
              <el-input v-for="(v,i) in item.attr_vals"
                :key="i"
                :label="v"></el-input>

            </el-form-item>

          </el-tab-pane>
          <el-tab-pane label="商品图片"
            name="3">
            <el-upload :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers='handheaders'
              :on-success='handlesuccess'>
              <el-button size="small"
                type="primary">点击上传</el-button>

            </el-upload>

          </el-tab-pane>
          <el-tab-pane label="商品内容"
            name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>

    </el-card>
    <!-- 显示预览图片 -->
    <el-dialog title="预览图片"
      :visible.sync="PreviewdialogVisible"
      width="50%">
      <img :src="PreviewPath"
        class="PreviewImg" />

    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: '0',
      // 添加表单
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        pics: []

      },
      // 添加表单验证规则
      addFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品名称', trigger: 'blur' }]
      },
      // 保存商品分类数据
      CateList: [],
      // 配置级联选择框如何展示
      CateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'

      },
      // 保存动态参数
      manyTableData: [],
      // 商品参数
      attr_vals: [],
      // 保存动态参数
      onlyTableData: [],
      // 保存路径
      uploadURL: 'http://vue-shop-api.itheima.net/api/private/v1/upload',
      // 手动设置请求头
      handheaders: {
        Authorization: window.sessionStorage.getItem('token')

      },
      PreviewdialogVisible: false,
      PreviewPath: ''

    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 在级联选择中渲染数据
    async  getCateList () {
      const { data: res } = await this.$http.get('categories')
      // console.log('getCateForm -> res ', res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      this.$message.success('获取商品分类数据成功')
      this.CateList = res.data
      // console.log('getCateList -> this.CateList', this.CateList)
    },
    // 设置级联选择器，监听数据的变化(goood_cat以为",
    // "分割的分类列表，这里不能加return return返回的内容不能赋值 )
    handleChange () {
      // console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },

    // 阻止切换
    beforeTabLeave (activeName, oldActiveName) {
      // console.log('即将离开的位置' + oldActiveName)
      // console.log('即将进去的位置' + activeName)
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    // 获取商品参数名称(1.这里的ID应该为三级属性的ID2.注意1是字符串)
    async  tabClick () {
      console.log(this.activeIndex)
      if (this.activeIndex === '1') {
        console.log('11')
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        console.log('tabClick -> res', res)
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态商品参数失败')
        }
        // return this.$message.success('获取动态商品参数成功')
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          console.log('tabClick -> item.attr_vals', item.attr_vals)
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        console.log('11')
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        console.log('tabClick -> res', res)
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态商品参数失败')
        }
        // return this.$message.success('获取动态商品参数成功')
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          console.log('tabClick -> item.attr_vals', item.attr_vals)
        })
        this.onlyTableData = res.data
        console.log('tabClick -> res.data', res.data)
      }
    },
    // 处理图片
    handlePreview (file) {
      console.log('handlePreview -> file', file)
      this.PreviewPath = file.response.data.url
      this.PreviewdialogVisible = true
    },
    // 移除图片
    handleRemove (file) {
      // console.log('handleRemove -> file', file)
      // findIndex找到图片的索引值
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      // splice删除
      this.addForm.pics.splice(i, 1)
      console.log('handleRemove -> this.addForm', this.addForm)
    },
    // 监听图片是否上传成功
    handlesuccess (response) {
      // console.log('handlesuccess -> response', response)
      // 拼接得到一个图片对象
      const picInfo = { pic: response.data.tmp_path }

      // 将图片push到pics数组中
      this.addForm.pics.push(picInfo)
      // console.log('handlesuccess -> this.addForm', this.addForm)
    }

  },
  // 计算函数
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }

  }

}
</script>

<style lang="scss" scoped>
.el-steps {
  margin: 10px 10px;
}
.PreviewImg {
  width: 100%;
}
</style>
