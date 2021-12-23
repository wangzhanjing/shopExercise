<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary"
                     @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table :data="cateList"
                  :columns="columns"
                  :selection-type="false"
                  :expand-type="false"
                  show-index
                  index-text='#'
                  border
                  class="treeTable">
        <!-- 第一个模板，是否有效 -->
        <template slot="isok"
                  slot-scope="scope">
          <i class="el-icon-success"
             v-if="scope.row.cat_deleted=== false"
             style="color:lightgreen;"></i>
          <i class="el-icon-error"
             v-else
             style="color:red;"></i>
        </template>
        <!-- 第二个模板，排序 -->
        <template slot="order"
                  slot-scope="scope">
          <el-tag size="mini"
                  v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success"
                  size="mini"
                  v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning"
                  size="mini"
                  v-else>三级</el-tag>
        </template>
        <!-- 第三个模板，操作 -->
        <template slot="opt"
                  slot-scope="scope">
          <el-button type="primary"
                     icon="el-icon-edit "
                     size="mini"
                     @click="showEditCateForm(scope.row.cat_id)">编辑</el-button>
          <el-button type="danger"
                     icon="el-icon-delete"
                     size="mini"
                     @click="deleteCateForm(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[3, 5, 10, 15]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类"
               :visible.sync="addCateDialogVisible"
               width="50%"
               @close="addCateDialogClosed">
      <el-form :model="addCateForm"
               :rules="addCateFormRules"
               ref="addCateFormRef"
               label-width="100px">
        <el-form-item label="分类名称："
                      prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader v-model="selectdKeys"
                       :options="parentCateList"
                       :props="cascaderProps"
                       @change="parentCateChange"
                       clearable
                       change-on-select></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类对话框 -->
    <el-dialog title="修改分类"
               :visible.sync="editCateDialogVisible"
               width="50%">
      <el-form ref="editCateDialogRef"
               :model="editForm"
               label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editCateform">确 定</el-button>
      </span>

    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 商品分类列表
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      addCateDialogVisible: false,
      editCateDialogVisible: false,
      addCateForm: {},
      // 将要添加的分类名称
      editForm: {
        cat_name: '',
        cat_id: ''
      },
      cat_name: {},
      // 父级的分类id
      at_pid: 0,
      // 分类的等级默认一级
      cat_level: 0,
      // 为table定义列的名称
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '是否有效', type: 'template', template: 'isok' },
        { label: '排序', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'opt' }
      ],
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      // 级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 选中的父级分类的id数组
      selectdKeys: []
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品数据
    async getCateList () {
      const { data } = await this.$http.get('categories', { params: this.queryInfo })

      if (data.meta.status !== 200) {
        return this.$message.error('获取列表失败')
      }
      // console.log(data.data)
      this.cateList = data.data.result
      this.total = data.data.total
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击按钮展示添加用户对话框
    showAddCateDialog () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类列表
    async getParentCateList () {
      const { data } = await this.$http.get('categories', { params: { type: 2 } })
      if (data.meta.status !== 200) {
        return this.$message.error('获取父级数据失败！')
      }
      // console.log(data.data)
      this.parentCateList = data.data
    },
    // 选择项发生变化触发这个方法
    parentCateChange () {
      // console.log(this.selectdKeys)
      // 如果selectdKeys中数组length>0，证明选择了父级分类，反之就说明没有选中
      if (this.selectdKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectdKeys[this.selectdKeys.length - 1]
        this.addCateForm.cat_level = this.selectdKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮添加新的分类
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data } = await this.$http.post('categories', this.addCateForm)
        if (data.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }
        this.$message.success('添加分类成功')

        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 监听对话框的关闭事件，重置表单
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectdKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    async showEditCateForm (id) {
      const { data } = await this.$http.get('categories/' + id)
      // console.log(data.data)
      if (data.meta.status !== 200) {
        return this.$message.error('查询用户失败！')
      }
      this.editForm = data.data
      // console.log(this.editForm)
      this.editCateDialogVisible = true
    },
    editCateform () {
      // console.log(this.editForm)
      this.$refs.editCateDialogRef.validate(async valid => {
        if (!valid) return
        const { data } = await this.$http.put('categories/' + this.editForm.cat_id, { cat_name: this.editForm.cat_name }
        )
        // console.log(data)
        if (data.meta.status !== 200) {
          return this.$message.error('更新用户失败!')
        }
        this.getCateList()
        this.editCateDialogVisible = false
        this.$message.success('更新分类名称成功!')
      })
    },
    // 删除分类
    async deleteCateForm (id) {
      const confirmRes = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRes !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data } = await this.$http.delete('categories/' + id)

      if (data.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功!')
      this.getCateList()
    }
  }
}
</script>
<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
</style>
