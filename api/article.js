import { request } from '@/plugins/request'

// 获取文章列表
export const getArticles = (params) => request.get('/api/articles', { params })

// 获取关注的文章列表
export const getFeedArticles = (params) =>
  request.get('/api/articles/feed', { params })

// 文章点赞
export const addFavorite = (slug) =>
  request.post(`/api/articles/${slug}/favorite`)

// 取消点赞
export const cancelFavorite = (slug) =>
  request.delete(`/api/articles/${slug}/favorite`)

// 获取标签列表
export const getTags = () => request.get(`/api/tags`)

// 获取文章详情
export const getArticleDetail = (slug) => request.get(`/api/articles/${slug}`)

// 获取文章评论列表
export const getArticleComments = (slug) =>
  request.get(`/api/articles/${slug}/comments`)

// 新增文章评论
export const addArticleComments = (slug, params) =>
  request.post(`/api/articles/${slug}/comments`, params)

// 删除文章评论
export const delArticleComments = (slug, id) =>
  request.delete(`/api/articles/${slug}/comments/${id}`)

// 关注作者
export const followAuthor = (username) =>
  request.post(`/api/profiles/${username}/follow`)

// 取消关注作者
export const unfollowAuthor = (username) =>
  request.delete(`/api/profiles/${username}/follow`)

// 喜欢文章
export const favoriteArticle = (slug) =>
  request.post(`/api/articles/${slug}/favorite`)

// 取消喜欢文章
export const unfavoriteArticle = (slug) =>
  request.post(`/api/articles/${slug}/favorite`)

// 新增文章
export const createArticle = (params) => request.post(`/api/articles`, params)

// 修改文章
export const udateArticle = (slug, params) =>
  request.put(`/api/articles/${slug}`, params)

// 删除文章
export const delArticle = (slug) => request.delete(`/api/articles/${slug}`)
