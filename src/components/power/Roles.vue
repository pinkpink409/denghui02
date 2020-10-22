<template>
  <div>
    <!-- 面包屑导航 -->

    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col> <el-button type="primary">添加角色</el-button> </el-col>
      </el-row>

      <!-- 添加角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot:default="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二三级权限 -->
              <el-col :span="19"
                ><el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  ><el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template #default="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
            <!-- 分配权限 -->
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="SetRightDialogVisible"
      width="50%"
      @close="setRightDialogClose"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="SetRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRight()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // data中添加数据
      roleList: [],
      // 控制分配权限对话框的显示与隐藏
      SetRightDialogVisible: false,
      // 设置权限数据
      rightsList: [],
      // 树的数据对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defKeys: [],
      // 2.当前分配角色的id
      roleId: ''

    }
  },
  // created调用这个方法获取数据
  created () {
    this.getRoleList()
  },
  methods: {
    // 提供一个发送请求获取权限数据的方法
    async  getRoleList () {
      const { data: res } = await this.$http.get('roles')
      console.log('getRoleList -> res', res)
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表数据失败')
      }
      this.roleList = res.data
      console.log('getRoleList ->  this.roleList', this.roleList)
    },
    async removeRightById (role, rightId) {
      console.log('removeRightById -> role', role)
      // console.log(roleId)
      // console.log(rightId)
      // 弹窗提示用户是否要删除
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      this.$message.success('确认删除')
      // 把图框删除
      // 返回的data，是当前角色下最新的权限数据(删除角色权限之后的数据)
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      this.$message.success('删除权限成功')
      //
      role.children = res.data
      console.log('removeRightById -> res.data', res.data)
      console.log('removeRightById -> role.children', role.children)
      console.log('removeRightById -> role', role)

      // 重新渲染数据,注意只能局部渲染
      // this.getRoleList()
    },
    async  showSetRightDialog (role) {
      // 1.保存角色的id
      this.roleId = role.id

      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      console.log('showSetRightDialog -> res', res)

      // 如果返回状态为异常状态则报错并返回
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据成功')
      }
      // 如果返回状态，将请求的数据保存在data中
      this.rightsList = res.data
      // 调用getLeafKeys进行递归，将三级权限添加到数组中
      this.getLeafKeys(role, this.defKeys)
      // 当点击分配权限按钮时展示对应的对话框
      // 当点击分配权限按钮时，展示对应的对话框
      this.SetRightDialogVisible = true
    },
    // 该函数会获得到当前角色的所有三级权限id并添加到defKeys中
    getLeafKeys (node, arr) {
      // 如果当前节点不包括childern属性，则表示node为三级权限
      if (!node.children) {
        return arr.push(node.id)
      }
      // 递归调用
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 当用户关闭树形权限对话框的时候，清除掉所有的状态
    setRightDialogClose () {
      this.defKeys = []
    },
    // 分配角色权限
    async allotRight () {
      // 当用户在树形权限对话框中点击确定，将用户选择的
      // 权限发送请求进行更新

      // 获取所有选中以及半选的内容
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()

      ]
      console.log('allotRight -> keys', keys)
      // 将数组转换为“，”拼接的字符串
      const idStr = keys.join(',')
      console.log('allotRight -> idStr', idStr)

      // 发送请求完成更新
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')

      // 渲染数组
      this.getRoleList()
      // 关闭对话框
      this.SetRightDialogVisible = false
    }

  }
}
</script>

<style lang="scss" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>
