<template>
  <div class="scheduling">
    <div class="top">
      <div class="topLeft">
        <img src="../assets/image/name.png" @click="$router.push('/')">
      </div>
      <div class="topRight">
        <span class="portrait"></span>
        <span class="hello">您好！{{peopleInfo.name}}</span>
        <span class="exit" @click="logout()"></span>
      </div>
    </div>
    <div class="content">
      <div class="contentLeft">
        <div class="box box1">
          <span>总值班信息</span>
          <div class="peopleInfo">
            <div class="portrait">
              <img src="../assets/image/portrait.png" alt="peopleInfo">
            </div>
            <div class="namePhone">
              <span class="span1">{{ peopleInfo.name}}</span>
              <span class="span2">{{ peopleInfo.phone.substring(0,3)}}-{{ peopleInfo.phone.substring(3,7)}}-{{ peopleInfo.phone.substring(7,11)}}</span>
            </div>
          </div>
        </div>
        <div class="box box2">
          <!-- 日期选择器 -->
          <ele-calendar :render-content="renderContent" :data="datedef" prop="date" @pick="pickDate"></ele-calendar>
        </div>
        <div class="box box3">
          <div class="carInfo">
            <span>应急值班车辆信息</span>
          </div>
          <div class="tableInfo">
            <el-table :data="dutyVehicle" stripe style="width: 100%" height="100%" :header-cell-style="{background:'rgba(247,247,247,1)',border:'2px solid rgba(245,247,248,1)'}">
              <el-table-column type="index" width="60px" label="编号"></el-table-column>
              <el-table-column prop="carnumber" label="车牌"></el-table-column>
              <el-table-column prop="carbrand" label="车型"></el-table-column>
              <el-table-column prop="parking" label="停车点" width="170px"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="contentTable">
        <div class="head">
          <span class="date">{{topDateDisplay}}</span>
          <div class="btn">
            <el-button type="primary" size="small" @click="showAdd = true">新增排班</el-button>
          </div>
        </div>
        <div class="table">
          <el-table :data="onDutyInfo" stripe max-height="595"  empty-text="今日无值班信息">
            <el-table-column type="index" width="60px" label="序号"></el-table-column>
            <el-table-column prop="departmentname" label="部门名称" width="150px"></el-table-column>
            <el-table-column prop="phonenumber" label="部门电话" width="150px">
              <template template slot-scope="scope">
                {{`021-${scope.row.phonenumber}`}}
              </template>
            </el-table-column>
            <el-table-column prop="dutypersonname" label="值班人员"></el-table-column>
            <el-table-column prop="dutypersonphone" label="联系方式"></el-table-column>
            <el-table-column prop="schedualclass" label="值班班次" width="100px"></el-table-column>
            <el-table-column prop="flag" label="操作" width="160">
              <template template slot-scope="scope">
                <el-button size="mini" type="text" @click="toShowEdit(scope.row)" class="editBtn" :disabled="!scope.row.flag" >编辑</el-button>
                <el-button size="mini" type="text" @click="showDelete = true" class="deleteBtn" :disabled="!scope.row.flag" >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog title="新增" :visible.sync="showAdd" width="30%" @closed="refreshTableData('addForm')">
      <el-form :model="addForm" ref="addForm" :rules='rules'>
        <el-form-item label="部门名称" :label-width="'80px'" prop="departmentname">
          <el-select v-model="selectDepartment" placeholder="请选择部门" @change="getDeptUserInfo">
            <el-option v-for="(item,index) in departmentSelect" :key="index" :label="item.deptname" :value="item.deptid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门电话" :label-width="'80px'" prop="phonenumber">
          <el-input v-model="addForm.phonenumber " autocomplete="off" placeholder="请填写8位固话号码（免区号）"></el-input>
        </el-form-item>
        <el-form-item label="值班人员" :label-width="'80px'" prop="dutypersonname">
          <el-select v-model="selectPerson" placeholder="请选择值班人员" @change="setPhone" no-data-text="该部门暂无值班人员"  >
            <el-option v-for="(item,index) in departmentManSelect" :key="index" :label="item.personName" :value="item.personid" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式" :label-width="'80px'" prop="dutypersonphone">
          <el-input v-model="addForm.dutypersonphone" autocomplete="off" placeholder="请填写11位手机号码"></el-input>
        </el-form-item>
        <el-form-item label="班次" :label-width="'80px'" prop="schedualclass">
          <el-radio-group v-model="dutyTime" @change="addForm.schedualclass = dutyTime">
            <el-radio :label="1">全天</el-radio>
            <el-radio :label="2">上午</el-radio>
            <el-radio :label="3">下午</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="refreshTableData('addForm')">取 消</el-button>
        <el-button type="primary" @click="checkForm('addForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="删除" :visible.sync="showDelete" width="30%" class="deleteDialog">
      <span>确认删除该条记录？</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDelete = false">取 消</el-button>
        <el-button type="primary" @click="removeSchedual()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑" :visible.sync="showEdit" width="30%" @closed="refreshTableData('editForm')">
      <el-form :model="editForm" ref="editForm" :rules='rules'>
        <el-form-item label="部门名称" :label-width="'80px'" prop="departmentname" >
          <el-select v-model="checkRowData.departmentname" placeholder="请选择部门" disabled>
            <el-option v-for="(item,index) in departmentSelect" :key="index" :label="item.deptname" :value="item.deptid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门电话" :label-width="'80px'" prop="phonenumber" >
          <el-input v-model="checkRowData.phonenumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="值班人员" :label-width="'80px'" prop="dutypersonname" >
          <el-select v-model="checkRowData.dutypersonname" placeholder="请选择值班人员" @change="setEditIDandPhone" no-data-text="该部门暂无值班人员">
            <el-option v-for="(item,index) in editManSelected" :key="index" :label="item.personName" :value="item.personid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式" :label-width="'80px'" prop="dutypersonphone" >
          <el-input v-model="checkRowData.dutypersonphone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="班次" :label-width="'80px'" prop="schedualclass" >
          <el-radio-group v-model="checkRowData.schedualclass">
            <el-radio label="全天">全天</el-radio>
            <el-radio label="上午">上午</el-radio>
            <el-radio label="下午">下午</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="refreshTableData('editForm')">取 消</el-button>
        <el-button type="primary" @click="checkForm('editForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入接口
import { logout, editSchedual, addSchedual, removeSchedual, findUserAndDept, schedualList, getDeptUserInfo, carInfo } from '@/api'
// 引入组件
import eleCalendar from 'ele-calendar'
import 'ele-calendar/dist/vue-calendar.css'
export default {
  name: 'scheduling',
  components: {
    eleCalendar
  },
  data () {
    return {
      topDateDisplay: new Date().getFullYear() + '年' + (new Date().getMonth() + 1) + '月' + new Date().getDate() + '日',
      dutyTime: null,
      dutyVehicle: [],
      onDutyInfo: [],
      datedef: [],
      peopleInfo: {
        name: '',
        phone: '',
        gender: ''
      },
      showAdd: false,
      showDelete: false,
      showEdit: false,
      departmentSelect: '',
      departmentManSelect: '',
      selectDepartment: '',
      selectPerson: '',
      addForm: {
        schedualdate: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
        phonenumber: '',
        dutypersonphone: '',
        schedualclass: '',
        departmentname: '',
        dutypersonname: ''
      },
      editForm: {
        phonenumber: '',
        dutypersonname: ''
      },
      checkRowData: {},
      editManSelected: [],
      rules: {
        departmentname: { validator: this.departmentCheck, trigger: 'change' },
        phonenumber: { validator: this.phoneCheck, trigger: 'change' },
        dutypersonname: { validator: this.personCheck, trigger: 'change' },
        dutypersonphone: { validator: this.mobilePhoneCheck, trigger: 'change' },
        schedualclass: { validator: this.classCheck, trigger: 'change' }
      }
    }
  },
  methods: {
    // 退出登录
    async logout () {
      let res = await logout()
      if (res.data.code === 1) {
        location.href = res.data.data
      } else if (res.data.code === 0) {
        alert('系统异常，退出失败')
      }
    },
    // 校验规则--值班部门
    departmentCheck (rule, value, callback) {
      if (value === '') {
        callback(new Error('请选择值班部门'))
      } else {
        callback()
      }
    },
    // 校验规则--部门电话
    phoneCheck (rule, value, callback) {
      let patt = /^\d{8}$/
      if (value === '') {
        callback(new Error('部门电话不能为空'))
      } else if (patt.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的固话号码'))
      }
    },
    // 校验规则--值班人员
    personCheck (rule, value, callback) {
      if (value === '') {
        callback(new Error('请选择值班人员'))
      } else {
        callback()
      }
    },
    // 校验规则--联系电话
    mobilePhoneCheck (rule, value, callback) {
      let patt = /^1\d{10}$/
      if (value === '') {
        callback(new Error('联系电话不能为空'))
      } else if (patt.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的手机号码'))
      }
    },
    // 校验规则--排班类别
    classCheck (rule, value, callback) {
      if (value === '') {
        callback(new Error('请选择值班班次'))
      } else {
        callback()
      }
    },
    // 校验表单
    checkForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (formName === 'editform') {
            this.editSchedual()
          }
          if (formName === 'addform') {
            this.addSchedual()
          }
        } else {
          return false
        }
      })
    },
    // 设置联系电话
    setPhone (value) {
      for (let i = 0; i < this.departmentManSelect.length; i++) {
        if ((this.departmentManSelect[i].personid) === value) {
          this.addForm.dutypersonphone = this.departmentManSelect[i].mobile
          this.addForm.dutypersonname = this.departmentManSelect[i].personName
          break
        }
      }
      this.addForm.dutypersonid = value
    },
    // 添加排班
    async addSchedual (formName) {
      let res = await addSchedual(this.addForm)
      if (res.data.code === 0) {
        this.$message({
          message: '此人已经有排班，不能重复排班',
          type: 'warning'
        })
        this.$refs[formName].clearValidate()
      } else if (res.data.code === 1) {
        this.$message({
          message: '新增排班成功',
          type: 'success'
        })
        this.$refs[formName].resetFields()
        this.selectDepartment = ''
        this.addForm.phonenumber = ''
        this.selectPerson = ''
        this.addForm.dutypersonphone = ''
        this.departmentManSelect = ''
        this.dutyTime = 0
        this.showAdd = false
      }
    },
    // 删除排班
    async removeSchedual () {
      this.showDelete = false
      let res = await removeSchedual({ id: this.checkRowData.id })
      if (res.data.code === 1) {
        this.$message({ message: '排班删除成功', type: 'success' })
      } else if (res.data.code === 0) {
        this.$message.error('系统维护，删除失败，请联系管理员')
      }
    },
    setEditIDandPhone (value) {
      this.editForm.dutypersonid = value
      for (let i = 0; i < this.editManSelected.length; i++) {
        if ((this.editManSelected[i].personid) === value) {
          this.checkRowData.dutypersonphone = this.editManSelected[i].mobile
          this.editForm.dutypersonname = this.editManSelected[i].personName
          this.checkRowData.dutypersonname = this.editManSelected[i].personName
          break
        }
      }
    },
    // 上传排班编辑信息
    async editSchedual (formName) {
      this.editForm.id = this.checkRowData.id
      this.editForm.phonenumber = this.checkRowData.phonenumber
      this.editForm.dutypersonphone = this.checkRowData.dutypersonphone
      if (this.checkRowData.schedualclass === '全天') {
        this.editForm.schedualclass = 1
      } else if (this.checkRowData.schedualclass === '上午') {
        this.editForm.schedualclass = 2
      } else if (this.checkRowData.schedualclass === '下午') {
        this.editForm.schedualclass = 3
      }
      this.editForm.dutypersonname = this.checkRowData.dutypersonname
      let res = await editSchedual(this.editForm)
      if (res.data.code === 0) {
        this.$message({ message: '此人已经有排班，不能重复排班', type: 'warning' })
        this.$refs[formName].clearValidate()
      } else if (res.data.code === 1) {
        this.$message({ message: '排班修改成功', type: 'success' })
        this.showEdit = false
      }
    },

    // 刷新排班表以及清空模态框
    refreshTableData (formName) {
      if (formName) {
        this.$refs[formName].resetFields()
        if (formName === 'addForm') {
          this.selectDepartment = ''
          this.addForm.phonenumber = ''
          this.selectPerson = ''
          this.addForm.dutypersonphone = ''
          this.departmentManSelect = ''
          this.dutyTime = 0
          this.showAdd = false
        }
        if (formName === 'editForm') {
          this.showEdit = false
        }
      }
      this.schedualList(this.addForm.schedualdate)
    },
    // 编辑
    toShowEdit (row) {
      this.showEdit = true
      this.checkRowData = Object.assign({}, row)
      let res = getDeptUserInfo(this.checkRowData.departmentid)
      this.editManSelected = res.data.data.childrens
    },

    // 日历点击
    pickDate (data, event, row, dom) {
      let dateChoice = data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate()
      this.topDateDisplay = data.getFullYear() + '年' + (data.getMonth() + 1) + '月' + data.getDate() + '日'
      this.addForm.schedualdate = dateChoice
      this.schedualList(dateChoice)
    },
    setDeptUserInfo (value) {
      // 获取部门序号
      for (let i = 0; i < this.departmentSelect.length; i++) {
        if (this.departmentSelect[i].deptid === value) {
          this.addForm.sortno = this.departmentSelect[i].sortno
        }
        this.selectPerson = ''
        this.addForm.dutypersonphone = ''
        let res = getDeptUserInfo(value)
        this.addForm.departmentname = res.data.data.deptname
        this.addForm.phonenumber = res.data.data.phone
        this.addForm.departmentid = res.data.data.deptid
        this.departmentManSelect = res.data.data.childrens
      }
    },
    // 获取部门人员信息
    async getDeptUserInfo (DepartmentId) {
      let res = await getDeptUserInfo({ id: DepartmentId })
      return res
    },

    // 渲染日历数据dom
    renderContent (h, params) {
      const loop = data => {
        return (data.defvalue.value ? (<div><div class="date-point checked">{data.defvalue.text}</div></div>) : <div>{data.defvalue.text}</div>)
      }
      return (<div style=""> {loop(params)} </div>)
    },
    // 排版列表
    async schedualList (date) {
      let res = await schedualList({ schedualdate: date })
      this.onDutyInfo = res.data.data.dataList
      let valueMap = {
        1: '全天',
        2: '上午',
        3: '下午'
      }
      for (let j = 0; j < this.onDutyInfo.length; j++) {
        this.onDutyInfo[j].schedualclass = valueMap[this.onDutyInfo[j].schedualclass]
      }
      let temp = res.data.data.dateList
      this.datedef = []
      for (let i = 0; i < temp.length; i++) {
        this.datedef.push({ date: temp[i] })
      }
    },
    // 查找人员和部门
    async findUserAndDept () {
      let res = await findUserAndDept()
      // this.peopleInfo = res.data.data
      this.departmentSelect = res.data.data.deptInfo
    },
    // 车辆信息
    async carInfo () {
      let res = await carInfo()
      this.dutyVehicle = res.data.data.carInfo
      this.peopleInfo = res.data.data.userInfo[0]
    }
  },
  mounted () {
    document.getElementsByClassName('today')[0].className = 'today test'
    let todayDate = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDate())
    this.schedualList(todayDate)
    this.carInfo()
    this.findUserAndDept()
  }
}
</script>

<style lang="less">
@import "~@/assets/css/schedule.less";
@import "~@/assets/css/editElementUI.less";
</style>
