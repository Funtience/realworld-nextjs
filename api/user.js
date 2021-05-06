import { request } from '@/plugins/request'

// 用户登录
export const login = (params) => request.post('/api/users/login', params)

// 用户注册
export const register = (params) => request.post('/api/users', params)

// 获取用户信息
export const getUserInfo = () => request.get('/api/user')

// 更新用户信息
export const updateUserInfo = (params) => request.put('/api/user', params)

// 用户主页
export const getProfile = (username) => request.get(`/api/profiles/${username}`)
