<template>
  <div>
    <h3>商品分类</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 分类表格  -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
        ><!-- 是否有效区域， 设置对应的模板列： slot="isok"(与columns中设置的template一致) -->
        <template v-slot:isok="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template v-slot:order="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <!-- ?????疑问：为什么这里最后不能用v-else -->
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <!-- #default="scope" -->
        <template v-slot:opt>
          <el-button size="mini" type="primary" icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>
    </el-card>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateRules"
        ref="addCateFormRuleForm"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" prop="cat_pid">
          <!-- 添加级联菜单显示父级分类 ，然后添加使用级联菜单组件-->
          <el-cascader
            expandTrigger="hover"
            :options="parentCateList"
            v-model="selectedKeys"
            :props="cascaderProps"
            @change="parentCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 查询分类数据条件
      queryInfo: {
        type: 3,
        // 当前页码值
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 3
      },
      // 商品分类数据列表
      cateList: [],

      // 保存总数据条数
      total: 0,
      // 在数据中添加columns:
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        // type:'template'(将该列设置为模板列)template:'isok'(设置该列模板的名称为isok)
        { label: '是否有效', prop: '', type: 'template', template: 'isok' }, { label: '排序', prop: '', type: 'template', template: 'order' },
        { label: '操作', prop: '', type: 'template', template: 'opt' }

      ],
      // 用来显示或隐藏添加分类的对话框
      addCateDialogVisible: false,
      // 添加分类表单
      addCateForm: {
        // 分类名称
        cat_name: '',
        // 添加分类的父级ID，0表示父级为0，添加一级分类
        cat_pid: '',
        // 添加分类的等级，0则表示添加一级分类
        cat_level: ''
      },
      // 添加分类规则
      addCateRules: {
        // 验证规则
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      // 保存1,2级父级分类的列表
      parentCateList: [],
      // 添加数据 配置级联菜单中数据如何展示
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 绑定用户选择的分类值
      selectedKeys: []

    }
  },
  // 钩子函数
  created () {
    this.getCateList()
  },

  methods: {
    async   getCateList () {
      // 获取商品分类数据
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      // console.log('getCateList -> this', this)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      this.$message.success('获取商品分类数据成功')

      // 将数据列表赋值给cateList
      this.cateList = res.data.result
      // console.log('getCateList -> this.cateList', this.cateList)
      // console.log('getCateList -> res.data', res.data)

      // 保存总数条数
      this.total = res.data.total
    },
    handleSizeChange (newsize) {
      // 当pagesize发生改变时触发
      this.queryInfo.pagesize = newsize
      // 渲染数据
      this.getCateList()
    },
    handleCurrentChange (newnum) {
      // 当pagenum发生改变时触发
      this.queryInfo.pagenum = newnum
      this.getCateList()
    },
    // 添加分类函数
    showAddCateDialog () {
      // 调用getParentCateList获取分类列表
      this.getParentCateList()
      // 显示添加分类对话框
      this.addCateDialogVisible = true
    },
    // 获取父级分类数据列表
    async   getParentCateList () {
      // 父级为什么是第二级？type: 2
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      // console.log('getParentCateList -> res', res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败')
      }
      this.$message.success('获取父级分类数据成功')
      this.parentCateList = res.data
    },
    // 1.级联菜单中选择项发生变化时触发
    parentCateChange () {
      // 自己输入的，点击就可以得到
      console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        // 如果用户选择了父级分类
        // 则将数组中的最后一项设置为父级分类
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // level也要跟着发生变化
        this.addCateForm.cat_level = this.selectedKeys.length
      }
    },
    addCateDialogClosed () {
      // 2.当关闭添加分类对话框时，重置表单
      this.$refs.addCateFormRuleForm.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },

    // 3.点击确定，完成添加分类
    addCate () {
      console.log(this.addCateForm)
      this.$refs.addCateFormRuleForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.el-button {
  margin-bottom: 10px;
}
</style>
