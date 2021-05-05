import { request } from '@/plugins/request'

// 用户登录
export const login = (params) => request.post('/api/users/login', params)

// 用户注册
export const register = (params) => request.post('/api/users', params)
