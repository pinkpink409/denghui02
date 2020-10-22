<template >
  <div>
    <h3>参数管理</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 :closable="false"(是否展示“X”号) show-icon(显示图标) -->
      <el-alert title="注意：只允许为第三级设置相关参数" type="warning" :closable="false" show-icon></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader expand-trigger="hover" :options="cateList" v-model="selectedCateKeys" :props="cateProps" @change="handleChange">
          </el-cascader>
        </el-col>
        <el-col></el-col>
      </el-row>
      <!-- D展示参数 -->
      <!-- 展示动态参数数据以及静态属性数据 -->
      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 将标签页改为mang -->
        <el-tab-pane label="动态参数" name="many">
          <el-button size="mini" type="primary" :disabled="isButtonDisabled" @click="addDialogVisible = true">添加参数
          </el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot:default="scope">
                <!-- 循环生成的el-tag -->
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{ item }}</el-tag>
                <!-- 输入框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot:default="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--添加静态属性的面板 将标签页改为only  -->
        <el-tab-pane label="静态属性" name="only">
          <el-button size="mini" type="primary" :disabled="isButtonDisabled" @click="addDialogVisible = true" @close="addDialogClosed">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot:default="scope">
                <!-- 循环生成的el-tag -->
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{ item }}</el-tag>
                <!-- 输入框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- E添加参数 完成添加参数或属性 -->
    <!-- 添加参数或属性对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!--  添加表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- F.编辑参数或属性对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!--  编辑表单 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 用户在级联下拉菜单中选中的分类id
      selectedCateKeys: [],
      // 分类列表
      cateList: [],
      // 配置级联下拉菜单中选中的分类
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'

      },
      // tab页签激活显示的页签项
      activeName: 'many',

      // 用来保存动态数据
      manyTableData: [],
      // 用来保存静态数据
      onlyTableData: [],

      // 控制添加参数，属性对话框的显示或隐藏
      addDialogVisible: false,

      // 添加参数的表单数据对象
      addForm: {
        attr_name: ''

      },

      // 添加表单验证规则
      addFormRules: { attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }] },
      // 编辑表单
      editForm: {
        // 修改的是名字
        attr_name: '',
        attr_id: ''
      },
      // 编辑表单规则
      editFormRules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]

      },
      // 控制添加参数，属性对话框的显示或隐藏
      editDialogVisible: false

    }
  },
  // 钩子函数调用
  created () {
    this.getCateList()
  },
  methods: {
    // 获取所有的商品分类列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品数据失败')
      }
      this.$message.success('获取商品数据成功')
      // 将数据列表赋值给cateList
      this.cateList = res.data
      console.log('getCateList -> res', res)
      // console.log('getCateList -> res', res)
      // console.log('getCateList -> res.data', res.data)
    },

    async  handleChange () {
      // 当用户在级联菜单中选中内容改变时触发
      console.log(this.selectedCateKeys)

      // 证明选择的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        // 3.如果用户选择的不是三级分类
        this.manyTableData = []
        this.onlyTableData = []
        return
        // return终结函数
      }

      // 则证明选中的是三级分类
      // 发送请求，根据用户选择的三级分类和面板获取参数数据
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })

      if (res.meta.status !== 200) {
        console.log('11')
        console.log('handleChange -> res', res)
        return this.$message.error('获取参数列表数据失败')
      }
      // this.$message.success('获取参数列表数据成功')
      // 获取的是静态属性
      // 将获取到的数据中attr_vals字符串转换为数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })

      // 获取的是动态参数
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else if (this.activeName === 'only') { this.onlyTableData = res.data }
    },
    // 动态和静态栏的切换
    handleTabClick () {
      console.log(this.activeName)
      this.handleChange()
    },
    addParams () {
      // 当用户点击对话框中的确定时，验证表单
      this.$refs.addFormRef.validate(async valid => {
        // 校验不通过，return
        if (!valid) return
        // 校验通过，发送请求完成添加参数或者属性
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name, attr_sel: this.activeName, attr_vals: 'a, b, c'
        })
        if (res.meta.status !== 201) {
          console.log('addParams -> res', res)
          return this.message.error('添加' + this.titleText + '数据失败')
        }
        this.$message.success('添加' + this.titleText + '数据成功')
        this.addDialogVisible = false
        this.getCateList()
      })
    },
    // 重置添加表单
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },

    // 点击按钮，展示修改的对话框
    async showEditDialog (attrId) {
      // console.log('showEditDialog -> attrId', attrId)

      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`, { params: { attr_sel: this.activeName } })
      // console.log('showEditDialog ->  res ', res)
      if (res.meta.status !== 200) {
        return this.$message.error('展示' + this.titleText + '数据失败')
      }
      this.$message.success('展示' + this.titleText + '数据成功')
      this.editForm = res.data
      console.log('showEditDialog -> this.editForm', this.editForm)
      // console.log('showEditDialog -> this.editForm', this.editForm)

      this.editDialogVisible = true
    },
    // F 重置编辑表单
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑参数
    editParams () {
      // 验证表单
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发送请求完成修改
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name, attr_sel: this.activeName, attr_vals: 'a, b, c'
        })
        console.log(res)
        console.log('editParams -> this.cateId', this.cateId)
        if (res.meta.status !== 200) {
          return this.$message.error('编辑' + this.titleText + '数据失败')
        }
        this.$message.success('编辑' + this.titleText + '数据失败')
        this.editDialogVisible = false
        this.handleChange()
      })
    },

    // 删除分类参数
    async deleteParams (attrId) {
      console.log('deleteParams -> attrId', attrId)
      // 确认是否删除
      const resultconfirm = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (resultconfirm !== 'confirm') {
        console.log('deleteParams -> resultconfirm', resultconfirm)
        return this.$message.info('已经取消删除')
      }
      this.$message.info('确认删除')
      // 请求获取要删除的数据
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`)
      console.log('deleteParams ->  res', res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败')
      }
      this.$message.success('删除' + this.titleText + '数据成功')

      this.handleChange()
    },
    // 文本框失去焦点，或摁下了Eenter都会触发
    // 最后对应文本框的事件和按钮的事件添加处理函数
    handleInputConfirm (row) {
      console.log('ok')
      // 当用户在文本框中按下enter键或者焦点离开时都会触发执行
      // 判断用户在文本框中输入的内容是否合法
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果用户输入了真实合法的数据，需要保存起来
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 调用函数保存函数
      this.saveAttrVals(row)
    },
    // 点击按钮，显示文本框
    showInput (row) {
      // 用户点击添加按钮时触发
      row.inputVisible = true
      // $nextTick:在页面上元素被重新渲染之后，调用回调函数的代码

      this.$nextTick(_ => {
        // 让文本框自动获得焦点
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleClose (index, row) {
      console.log('handleClose -> index', index)

      // 1.删除对应的索引的参数可选项
      row.attr_vals.splice(index, 1)
      // 调用函数，完成保存可选项的操作
      this.saveAttrVals(row)
    },

    // 2.封装函数，完成保存参数细项
    async saveAttrVals (row) {
      console.log('saveAttrVals -> row', row)
      // 发起请求，保存参数细项

      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(' ')
      })
      console.log('saveAttrVals -> this.cateId', this.cateId)
      console.log('saveAttrVals -> row.attr_id', row.attr_id)
      if (res.meta.status !== 200) {
        console.log('res.meta.status', res.meta.status)

        return this.$message.error('保存参数细项失败')
      }
      this.$message.success('保存参数细项成功')
    }

  },
  computed: {
    // 添加计算属性用来获得按钮禁用与否
    isButtonDisabled () {
      return this.selectedCateKeys.length !== 3
    },
    // 获取选中的三级分类id0,1,2
    cateId () {
      console.log(this.selectedCateKeys.length)
      if (this.selectedCateKeys.length === 3) {
        console.log('22')
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 动态计算标题的文本
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态参数'
    }

  }

}
</script>

<style lang="scss" scoped>
.el-tag {
  margin: 5px;
}
.input-new-tag {
  width: 120px;
}
</style>
