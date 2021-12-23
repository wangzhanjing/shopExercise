<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 输入与搜索区 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容"
                    v-model="queryInfo.query"
                    clearable
                    @clear="getGoodsList()">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getGoodsList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="goApppage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table表格区 -->
      <el-table :data="goodsList"
                border
                stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称"
                         prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)"
                         prop="goods_price"
                         width="95px"></el-table-column>
        <el-table-column label="商品重量"
                         prop="goods_weight"
                         width="70px"></el-table-column>
        <el-table-column label="商品创建时间"
                         prop="add_time"
                         width="150px">
          <template slot-scope="scope">
            {{scope.row.add_time|dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="130px">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini"
                       @click="removeById(scope.row.goods_id)"></el-button>

          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[5, 10, 15, 20]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
                     background>
      </el-pagination>
    </el-card>

  </div>
</template>
<script>
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: '1',
        pagesize: '5'
      },
      goodsList: [],
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 获取参数列表
    async getGoodsList () {
      const { data } = await this.$http.get('goods', { params: this.queryInfo })
      if (data.meta.status !== 200) {
        return this.$message.error('获取参数列表失败！')
      }
      // this.$message.success('获取商品列表成功！')
      // console.log(data.data)
      this.goodsList = data.data.goods
      this.total = data.data.total
    },
    // 分页组件功能
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    async removeById (id) {
      const res = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (res !== 'confirm') {
        return this.$message.info('已经取消删除！')
      }
      const { data } = await this.$http.delete(`goods/+${id}`)
      if (data.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功')
      this.getGoodsList()
    },
    goApppage () {
      this.$router.push('/goods/add')
    }
  }
}
</script>
<style lang="less" scoped>
</style>
