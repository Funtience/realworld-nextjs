import { mapState } from 'vuex';
<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <!-- tab 栏 -->
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item" v-if="user">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: tab === 'your_feed' }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'your_feed',
                    },
                  }"
                  >Your Feed</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: tab === 'global_feed' }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'global_feed',
                    },
                  }"
                  >Global Feed</nuxt-link
                >
              </li>
              <li class="nav-item" v-if="tag">
                <nuxt-link
                  class="nav-link active"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab,
                      tag,
                    },
                  }"
                  >#{{ tag }}</nuxt-link
                >
              </li>
            </ul>
          </div>
          <!-- /tab 栏 -->

          <!-- 文章列表 -->
          <div
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username,
                  },
                }"
                ><img :src="article.author.image"
              /></nuxt-link>
              <div class="info">
                <nuxt-link
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username,
                    },
                  }"
                  class="author"
                  >{{ article.author.username }}</nuxt-link
                >
                <span class="date">{{
                  article.author.createdAt | dateFormat
                }}</span>
              </div>
              <button
                @click="handleFavorite(article)"
                class="btn btn-sm pull-xs-right"
                :disabled="article.isDisabled"
                :class="[
                  article.favorited ? 'btn-primary' : 'btn-outline-primary',
                ]"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              :to="{
                name: 'article',
                params: {
                  slug: article.slug,
                },
              }"
              class="preview-link"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
          <!-- /文章列表 -->

          <!-- 分页 -->
          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                :class="{ active: count === page }"
                v-for="count in pages"
                :key="count"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'home',
                    query: {
                      page: count,
                      tag,
                      tab,
                    },
                  }"
                  >{{ count }}</nuxt-link
                >
              </li>
            </ul>
          </nav>
          <!-- /分页 -->
        </div>

        <!-- 热门标签列表 -->
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                :to="{
                  name: 'home',
                  query: {
                    tag,
                    tab: 'tag',
                  },
                }"
                class="tag-pill tag-default"
                v-for="(tag, index) in tags"
                :key="index"
                >{{ tag }}</nuxt-link
              >
            </div>
          </div>
        </div>
        <!-- /热门标签列表 -->
      </div>
    </div>
  </div>
</template>

<script>
import {
  getArticles,
  addFavorite,
  cancelFavorite,
  getTags,
  getFeedArticles,
} from '@/api/article'
import { mapState } from 'vuex'
export default {
  name: 'HomeIndex',
  watchQuery: ['page', 'tag', 'tab'],
  computed: {
    ...mapState(['user']),
  },
  async asyncData({ store, query }) {
    const page = Number.parseInt(query.page) || 1
    const tag = query.tag
    const tab = query.tab || 'global_feed'
    const limit = 10

    const fetchArticleApi =
      store.state.user && tab === 'your_feed' ? getFeedArticles : getArticles

    const [{ data: articleRes }, { data: tagRes }] = await Promise.all([
      fetchArticleApi({
        limit,
        offset: (page - 1) * limit,
      }),
      getTags(),
    ])
    const { articles, articlesCount } = articleRes
    const { tags } = tagRes
    // 添加是否可点赞标识
    articles.forEach((article) => (article.isDisabled = false))
    return {
      articles,
      articlesCount,
      page,
      pages: Math.ceil(articlesCount / limit),
      tags,
      tag,
      tab,
    }
  },
  methods: {
    async handleFavorite(article) {
      article.isDisabled = true
      if (article.favorited) {
        await cancelFavorite(article.slug)
        article.favorited = false
        article.favoritesCount--
      } else {
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount++
      }
      article.isDisabled = false
    },
  },
}
</script>

<style></style>
