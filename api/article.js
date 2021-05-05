import { request } from '@/plugins/request'

// 获取文章列表
export const getArticles = (params) => request.get('/api/articles', { params })

// 文章点赞
export const addFavorite = (slug) =>
  request.post(`/api/articles/${slug}/favorite`)

// 取消点赞
export const cancelFavorite = (slug) =>
  request.delete(`/api/articles/${slug}/favorite`)

// 获取标签列表
export const getTags = () => request.get(`/api/tags`)
