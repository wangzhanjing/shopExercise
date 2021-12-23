<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区 -->
      <el-row>
        <el-col>
          <el-button type="primary"
                     @click="addRoleDialogVisiable=true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区 -->
      <el-table :data="roleList"
                border
                stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- eslint-disable-next-line -->
            <el-row v-for="(item1,i1) in scope.row.children"
                    :key="item1.id"
                    :class="['bdbottom',i1===0? 'bdtop':'']"
                    class="vcenter">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable
                        @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i>➡</i>
              </el-col>
              <!-- 渲染二级三级权限 -->
              <el-col :span=19>
                <!-- 通过for循环，嵌套渲染二级权限 -->
                <el-row v-for="(item2,i2) in item1.children"
                        :key="item2"
                        :class="[i2===0? '':'bdtop']"
                        class="vcenter">
                  <el-col :span="6">
                    <el-tag type="success"
                            closable
                            @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i>➡</i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="(item3) in item2.children"
                            :key="item3.id"
                            type="warning"
                            closable
                            @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{scope.row}}</pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称"
                         prop="roleName"></el-table-column>
        <el-table-column label="角色描述"
                         prop="roleDesc"></el-table-column>
        <el-table-column label="操作"
                         width="300px">
          <template slot-scope="scope">
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="showEditRoleDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini"
                       @click="deletaRoleById(scope.row.id)">删除</el-button>
            <el-button type="warning"
                       icon="el-icon-setting"
                       size="mini"
                       @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色的对话框 -->
    <el-dialog title="添加角色"
               :visible.sync="addRoleDialogVisiable"
               width="50%"
               @close="addRoleDialogClosed">
      <!-- 内容主题区 -->
      <el-form :model="addRoleForm"
               :rules="addRoleFormRules"
               ref="addRoleFormRef"
               label-width="80px">
        <el-form-item label="角色名称"
                      prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"
                      prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addRoleDialogVisiable = false">取 消</el-button>
        <el-button type="primary"
                   @click="addRole()">确 定</el-button>
      </span>

    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色"
               :visible.sync="editRoleDialogVisiable"
               width="50%"
               @close="editRoleDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="editRoleForm"
               :rules="editRoleFormRules"
               ref="editRoleFormRef"
               label-width="80px">
        <el-form-item label="角色名称"
                      prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"
                      prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editRoleDialogVisiable = false">取 消</el-button>
        <el-button type="primary"
                   @click="editRole">确 定</el-button>
      </span>

    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限"
               :visible.sync="setRightDialogVisible"
               width="50%"
               @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <el-tree :data="rightslist"
               :props="treeProps"
               show-checkbox
               node-key="id"
               default-expand-all
               :default-checked-keys="defKeys"
               ref="treeRef"></el-tree>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
export default {
  data () {
    return {
      // 所有角色列表数据
      roleList: [],
      addRoleDialogVisiable: false,
      editRoleDialogVisiable: false,
      setRightDialogVisible: false,
      // 添加用户的表单数据
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 所有权限的数据
      rightslist: [],
      editRoleForm: {},
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { message: '请输入角色名称', trigger: 'blur' }]
      },
      editRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { message: '请输入角色名称', trigger: 'blur' }]
      },
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点id数组值
      defKeys: [],
      roleId: ''
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色失败')
      }
      this.roleList = res.data
    }, // 点击提交按钮，增添新角色
    addRole () {
      this.$refs.addRoleFormRef.validate(async valid => {
        if (!valid) return
        // 预校验通过，可以发起用户添加请求
        const { data } = await this.$http.post('roles', this.addRoleForm)
        if (data.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        // 添加完成后隐藏用户对话框
        this.addRoleDialogVisiable = false
        // 刷新用户列表
        this.getRoleList()
      })
    },
    // 添加完成后隐藏用户对话框
    addRoleDialogClosed () {
      this.$refs.addRoleFormRef.resetFields()
    },
    // 展示角色编辑的对话框
    async showEditRoleDialog (id) {
      const { data: res } = await this.$http.get('roles/' + id)
      // console.log(data)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色信息失败！')
      }
      this.editRoleForm = res.data
      this.editRoleDialogVisiable = true
      // console.log(this.editRoleForm)
    },
    editRoleDialogClosed () {
      this.$refs.editRoleFormRef.resetFields()
    },
    // 提交角色编辑对话框
    editRole () {
      this.$refs.editRoleFormRef.validate(async valid => {
        if (!valid) return
        // 预校验通过，可以发起修改用户请求
        const { data: res } = await this.$http.put('roles/' + this.editRoleForm.roleId,
          {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc
          }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('更新角色信息失败!')
        }
        this.editRoleDialogVisiable = false
        this.getRoleList()
        // console.log(res)
        this.$message.success('更新角色信息成功')
      }
      )
    },
    // 根据id查询并删除指定角色
    async deletaRoleById (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data } = await this.$http.delete('roles/' + id)
      if (data.meta.status !== 200) {
        return this.$message.error('删除角色失败')
      }
      this.$message.success('删除角色成功')
      this.getRoleList()
    },
    // 根据ID删除对应的权限
    async removeRightById (role, rightId) {
      // 弹窗提示是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      const { data } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (data.meta.status !== 200) {
        return this.$message.error('删除权限失败！')
      }
      this.$message.success('删除成功')
      // 不建议这么做，会全局刷新页面信息
      // this.getRoleList()
      role.children = data.data
    },
    // 展示分配权限的对话框
    async showSetRightDialog (role) {
      this.roleId = role.id
      // 获取所有权限数据
      const { data } = await this.$http.get('rights/tree')
      if (data.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      // 把获取到的权限数据放入到data中
      this.rightslist = data.data
      // 获取三级节点id
      this.getLeafKeys(role, this.defKeys)

      this.setRightDialogVisible = true
    },
    // 通过递归的方式，获取角色下所有三级权限的id，并保存到defKeys
    getLeafKeys (node, arr) {
      // 不含有children属性，就是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 分配权限对话框关闭之后清空数组
    setRightDialogClosed () {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights () {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      // console.log(keys)
      const idStr = keys.join(',')
      const { data } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (data.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRoleList()
      this.setRightDialogVisible = false
    }
  }

}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-top: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
