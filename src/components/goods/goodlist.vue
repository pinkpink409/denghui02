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
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getGoodList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表（表格）区域 -->
      <el-table :data="GoodList" border stripe>
        <el-table-column type="index" prop="goods_id"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格" prop="goods_price"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间" prop="upd_time">
          <template v-slot:default="scope">
            {{scope.row.upd_time | dateFormat}}

          </template>

        </el-table-column>
        <el-table-column label="操作" width="180px" >
          <template v-slot:default="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoodById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页导航区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 4, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      <!-- ------------------------ -->
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 保存商品列表信息
      GoodList: [],
      // 查询请求参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 保存数据总条数
      total: 0

    }
  },
  // 调用数据渲染函数
  created () {
    this.getGoodList()
  },
  methods: {
    async  getGoodList () {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      // console.log('getGoodList ->  res', res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表数据失败')
      }
      this.$message.success('获取商品列表数据成功')
      this.GoodList = res.data.goods
      this.total = res.data.total
    },
    // 处理商品列表条数重新渲染
    handleSizeChange (newSize) {
      console.log('handleSizeChange -> newSize', newSize)
      this.queryInfo.pagesize = newSize
      this.getGoodList()
    },
    // 处理当前页变动时候触发的事件
    handleCurrentChange (Current) {
      console.log('handleCurrentChange -> Current', Current)
      this.queryInfo.pagenum = Current
      this.getGoodList()
    },
    // 根据id删除用户
    async  removeGoodById (id) {
      console.log('removeGoodById -> id', id)
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
      const { data: res } = await this.$http.delete(`goods/${id}`)
      console.log('removeGoodById -> res', res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除商品数据失败')
      }
      this.$message.success('删除商品数据成功')
      this.getGoodList()
    },
    // 添加编程式导航
    goAddPage () {
      this.$router.push('/goods/add')
    }

  }

}
</script>

<style lang="scss" scoped>
</style>
