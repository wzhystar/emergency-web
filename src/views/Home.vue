<template>
  <div class="home">
    <div class="top">
      <div class="topLeft">
        <div class="dateWeek">
          <span>{{dateYear}}-{{dateMonth}}-{{dateDay}}</span>
          <br>
          <span>{{dateWeek}}</span>
        </div>
        <div class="time">{{dateHour}}:{{dateMinute}}:{{dateSecond}}</div>
      </div>
      <div class="topCenter"></div>
      <div class="topRight">
        <span class="portrait"></span>
        <span class="hello">您好！{{people}}</span>
        <span class="exit" @click="logout"></span>
      </div>
    </div>
    <div class="content content1">
      <div class="picture" @click="toSchedulePage">
        <img src="../assets/image/icon01-1.png">
      </div>
      <div class="picture" @click="toDutyRollCall">
        <img src="../assets/image/icon02-1.png">
      </div>
      <div class="picture" @click="noPage">
        <img src="../assets/image/icon04-1.png">
      </div>
      <div class="picture" @click="noPage">
        <img src="../assets/image/icon05-1.png">
      </div>
    </div>
    <div class="content content2">
      <div class="pictureLabel">
        <span @click="toSchedulePage">日常值守</span>
      </div>
      <div class="pictureLabel">
        <span @click="toDutyRollCall">执勤点名</span>
      </div>
      <div class="pictureLabel">
        <span @click="noPage">视频监控</span>
      </div>
      <div class="pictureLabel">
        <span @click="noPage">联动指挥</span>
      </div>
    </div>
  </div>
</template>

<script>
import { logout, userRole, findUserAndDept } from '@/api'
export default {
  name: 'home',
  data () {
    return {
      dateYear: '',
      dateMonth: '',
      dateDay: '',
      dateWeek: '',
      dateHour: '',
      dateMinute: '',
      dateSecond: '',
      user: {},
      people: ''
    }
  },
  methods: {
    // 跳转排班页
    toSchedulePage () {
      this.$router.push({ path: '/scheduling' })
    },
    // 跳转点名页
    toDutyRollCall () {
      if (this.user.role) {
        window.open('http://192.168.183.166')
      } else {
        this.$message({ message: '权限不足，请联系管理员获取权限。', type: 'warning' })
      }
    },
    // 开发中页面
    noPage () {
      this.$message({ message: '此系统正在开发中...', type: 'warning' })
    },
    // 退出登录
    async logout () {
      let res = await logout()
      if (res.data.code === 1) {
        location.href = res.data.data
      } else {
        alert('系统异常，退出失败')
      }
    },
    // 获取用户角色信息
    async userRole () {
      let res = await userRole()
      this.user = res.data.data
    },
    // 查找人员和部门信息
    async findUserAndDept () {
      let res = await findUserAndDept()
      this.people = res.data.data.name
    },
    // 设置日期时间
    setDateTime () {
      let nowTime
      let _this = this
      this.timer = setInterval(() => {
        nowTime = new Date()
        _this.dateYear = nowTime.getFullYear()
        _this.dateMonth = nowTime.getMonth() + 1 < 10 ? '0' + (nowTime.getMonth() + 1) : nowTime.getMonth() + 1
        _this.dateDay = nowTime.getDate() < 10 ? '0' + nowTime.getDate() : nowTime.getDate()
        let week = {
          1: '星期一',
          2: '星期二',
          3: '星期三',
          4: '星期四',
          5: '星期五',
          6: '星期六',
          7: '星期日'
        }
        _this.dateWeek = week[nowTime.getDay()]
        _this.dateHour = nowTime.getHours() < 10 ? '0' + nowTime.getHours() : nowTime.getHours()
        _this.dateMinute = nowTime.getMinutes() < 10 ? '0' + nowTime.getMinutes() : nowTime.getMinutes()
        _this.dateSecond = nowTime.getSeconds() < 10 ? '0' + nowTime.getSeconds() : nowTime.getSeconds()
      }, 1000)
    }
  },
  mounted () {
    this.setDateTime()
    this.userRole()
    this.findUserAndDept()
  }
}
</script>

<style lang="less">
@import "~@/assets/css/home.less";
</style>
