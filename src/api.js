import http from '@/plugins/axios.js'
const baseUrl = '/emergency'
// 首页
// 退出
const logout = (params) => http.get(`${baseUrl}/logout`, params)
// 用户角色
const userRole = (params) => http.get(`${baseUrl}/userRole`, params)
// 排班页
// 编辑排班
const editSchedual = (params) => http.post(`${baseUrl}/editSchedual`, params)
// 添加排班
const addSchedual = (params) => http.post(`${baseUrl}/addSchedual`, params)
// 删除排班
const removeSchedual = (params) => http.get(`${baseUrl}/removeSchedual`, params)
// 查找人员和部门
const findUserAndDept = (params) => http.get(`${baseUrl}/findUserAndDept`, params)
// 排版列表
const schedualList = (params) => http.get(`${baseUrl}/schedualList`, params)
// 获取部门人员信息
const getDeptUserInfo = (params) => http.get(`${baseUrl}/getDeptUserInfo`, params)
// 获取车辆信息
const carInfo = (params) => http.get(`${baseUrl}/carInfo`, params)

export { logout, userRole, editSchedual, addSchedual, removeSchedual, findUserAndDept, schedualList, getDeptUserInfo, carInfo }
