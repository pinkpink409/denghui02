<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          ></el-col
        >
      </el-row>
      <!-- 用户列表（表格）区域 -->
      <el-table :data="UserList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template #default="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template #default="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色 -->
            <!-- B.给分配角色按钮添加点击事件，点击之后弹出一个对话框进行角色分配 -->
            <el-tooltip effect="dark" content="分配角色" placement="top">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页导航区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 4, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- ------------------------ -->
    </el-card>
    <!-- 对话框组件  -->
    <el-dialog
      title="添加表单数据"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 对话框主体 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- ---------- -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加修改用户对话框 -->
    <!-- E.监听对话框关闭事件，在对话框之后，表单重置 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed()"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- A.添加分配角色对话框 -->
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed()"
    >
      <div>
        <p>当前用户:{{ userinfo.username }}</p>
        <p>当前角色:{{ userinfo.role_name }}</p>
        <p>
          分配新角色
          <el-select v-model="selectedRoleId" placeholder="请选择角色">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
// 请求用户列表数据
  // 2.data获取查询用户信息参数
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        return cb()
      }
      // 返回一个错误提示
      cb(new Error('请输入合法的邮箱'))
    }
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return cb()
      }
      // 返回一个错误提示
      cb(new Error('请输入合法的手机号码'))
    }

    // 验证手机号码的规则
    // 返回一个错误提示
    return {
      // 2.1 data保存请求回来的用户列表数据
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      UserList: [],
      total: 0,
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''

      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }],
        email: [{ required: true, message: '请入邮箱', trigger: 'blur' }, { validator: checkEmail, message: '邮箱格式不正确，请重新输入', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: checkMobile, message: '手机号码不正确，请输入正确的号码', trigger: 'blur' }]

      },
      // 9.2 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 修改用户的表单数据
      editForm: {

        password: '',
        email: '',
        mobile: ''
      },
      // 修改表单的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            validator: checkEmail,
            message: '邮箱格式不正确，请重新输入',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            validator: checkMobile,
            message: '手机号码不正确，请重新输入',
            trigger: 'blur'
          }
        ]

      },
      // 控制显示分配角色对话框
      setRoleDialogVisible: false,
      // 保存正在操作的那个用户信息
      userinfo: {},
      // 保存所有的角色信息
      rolesList: [],
      // 保存用户选中的角色id
      selectedRoleId: ''
    }
  },
  created () {
    // 1.created调用函数
    this.getUserList()
  },
  methods: {
    // 3.方法中发送请求获取用户列表数据
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      console.log(res)
      // 3.1如果返回状态为异常状态则报错并返回
      if (res.meta.status !== 200) return this.$message.error('获取列表数据失败')
      // 3.2如果返回状态正常，将请求的数据保存在data中
      this.UserList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (current) {
      console.log(current)
      this.queryInfo.pagenum = current
      this.getUserList()
    },
    // 在事件中发送请求完成状态的更改
    async userStateChange (userinfo) {
      // 发送请求进行状态修改
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      console.log(res)
      // 如果返回状态为异常状态则报错并返回
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        console.log(userinfo.mg_state)
        return this.$message.error('更新状态失败')
      }
      this.$message.success('更新状态成功')
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮添加新用户
    addUser () {
      // 点击确定按钮，添加新用户
      // 调用validate进行表单验证
      this.$refs.addFormRef.validate(
        async valid => {
          if (!valid) { return this.$message.error('请填写完整的用户信息') }
          // 发送请求完成添加用户的操作
          const { data: res } = await this.$http.post('users', this.addForm)
          // 判断如果添加失败，就做提示
          if (res.meta.status !== 201) { return this.$message.error('添加用户失败') }
          // 添加成功的提示
          this.$message.success('添加用户成功')
          // 关闭对话框
          this.addDialogVisible = false
          // 重新请求最新的数据
          this.getUserList()
        }
      )
    },
    // 9.1 展示编辑用户的对话框
    async showEditDialog (id) {
      // C.根据ID查询需要修改的用户数据
      // 发送请求根据id获得用户信息
      const { data: res } = await this.$http.get('users/' + id)

      console.log(id)
      // 判断如果添加失败，就做提示
      if (res.meta.status !== 200) {
        return this.$message.error('添加修改失败')
      }

      // 将获取得到的数据保存到数据
      this.editForm = res.data
      // 显示弹出框
      this.editDialogVisible = true
    },

    // 对话框关闭之后，重置表达
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 在用户点击确定按钮的时候，验证数据成功之后发送请求完成修改
    async  editUser () {
      this.$refs.editFormRef.validate(valid => {
        console.log(valid)
        if (!valid) {}
      })
      const { data: res } = await this.$http.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
      // console.log(res)
      // console.log('编辑的ID号' + this.editForm.id)
      console.log(this.editForm)
      if (res.meta.status !== 200) {
        return this.$message.error('修改失败')
      }
      this.$message.success('修改成功')

      this.getUserList()
      this.editDialogVisible = false
    },
    // 根据id删除用户
    async removeUserById (id) {
      // console.log(id)
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmResult)
      // 如果用户点击确认，则confirmResult 为'confirm'
      // 如果用户点击取消, 则confirmResult获取的就是catch的错误消息'cancel'
      if (confirmResult !== 'confirm') { return this.$message.info('已经取消删除') }
      this.$message.info('确认删除')
      // 发送请求根据id完成删除操作
      const { data: res } = await this.$http.delete('users/' + id)
      // console.log(res)
      // 判断如果删除失败，就做提示
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      // 修改成功的提示
      this.$message.success('删除成功')

      // 重新请求最新的数据
      this.getUserList()
    },
    async setRole (userinfo) {
      // 用户信息保存起来以供后续使用
      this.userinfo = userinfo
      // 获取所有的角色信息，以备下拉列表使用
      // 在展示对话框之前，获取所有的角色列表
      const { data: res } = await this.$http.get('roles')
      // console.log(res)
      // 判断如果获取所有的角色列表失败，就做提示
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.$message.success('获取角色列表成功')
      // 保存角色列表数据
      this.rolesList = res.data
      // 展示分配角色对话框
      this.setRoleDialogVisible = true
    },
    async saveRoleInfo () {
      // 当用户点击确定按钮之后
      // 判断用户是否选择了需要分配的角色
      if (!this.selectedRoleId) {
        return this.$message.error('请选择用户')
      }
      this.$message.success('选择用户成功')
      const { data: res } = await this.$http.put(`users/${this.userinfo.id}/role`, { rid: this.selectedRoleId })
      console.log('saveRoleInfo ->  res ', res)
      // 发送请求完成分配角色的操作

      if (res.meta.status !== 200) {
        // 判断如果添加失败，就做提示
        return this.$message.error('分配角色失败')
      }
      this.$message.success('分配角色成功')
      this.getUserList()
      // 关闭对话框
      this.setRoleDialogVisible = false
    },
    // 当关闭对话框的时候，重置下拉框中的内容
    setRoleDialogClosed () {
      this.userinfo = ''
      this.selectedRoleId = ''
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
