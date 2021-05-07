<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <button
              v-if="user.username === $route.params.username"
              class="btn btn-sm btn-outline-secondary action-btn"
              @click="$router.push('/settings')"
            >
              <i class="ion-plus-round"></i>
              &nbsp; Edit Profile Settings
            </button>
            <button
              v-else
              class="btn btn-sm action-btn ng-binding "
              :class="[
                profile.following ? 'btn-secondary' : 'btn-outline-secondary',
                { disabled: isSubmitting },
              ]"
              @click="handleFollow"
            >
              <i class="ion-plus-round"></i>
              &nbsp; {{ profile.following ? 'Unfollow' : 'Follow' }}
              {{ username }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: $route.name === 'profile' }"
                  exact
                  :to="{
                    name: 'profile',
                    params: {
                      username: $route.params.username,
                    },
                  }"
                  >My Articles</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: $route.name === 'profileFavorites' }"
                  exact
                  :to="{
                    name: 'profileFavorites',
                    params: {
                      username: $route.params.username,
                    },
                  }"
                  >Favorited Articles</nuxt-link
                >
              </li>
            </ul>
          </div>

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
                <span class="date">{{ article.createdAt | dateFormat }}</span>
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

          <!-- 分页 -->
          <nav v-if="totalPages > 1">
            <ul class="pagination">
              <li
                class="page-item ng-scope"
                :class="{ active: pageNumber === currentPage }"
                v-for="pageNumber in totalPages"
                @click="changePage"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'profile',
                    params: {
                      username,
                    },
                    query: {
                      page: pageNumber,
                    },
                  }"
                  >{{ pageNumber }}</nuxt-link
                >
              </li>
            </ul>
          </nav>
          <!-- /分页 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProfile, getUserInfo } from '@/api/user'
import {
  getArticles,
  followAuthor,
  unfollowAuthor,
  addFavorite,
  cancelFavorite,
} from '@/api/article'
export default {
  name: 'ProfileIndex',
  // watchQuery: ['page'],
  data() {
    return {
      username: '',
      user: {},
      profile: {},
      articles: [],
      totalPages: 1,
      currentPage: 1,
      isSubmitting: false,
    }
  },
  created() {
    this.username = this.$route.params.username
    this.fetchUser()
    this.fetchProfile()
    this.fetchArticles()
  },
  methods: {
    async fetchProfile() {
      const { data } = await getProfile(this.username)
      this.profile = data.profile
    },
    async fetchArticles() {
      this.currentPage = Number.parseInt(this.$route.query.page) || 1
      const limit = 10
      const { data } =
        this.$route.name === 'profile'
          ? await getArticles({
              author: this.username,
              limit,
              offset: (this.currentPage - 1) * limit,
            })
          : await getArticles({
              favorited: this.username,
              limit,
              offset: (this.currentPage - 1) * limit,
            })

      this.articles = data.articles
      this.articles.forEach((article) => (article.isDisabled = false))
      this.articlesCount = data.articlesCount
      this.totalPages = Math.ceil(this.articlesCount / limit)
    },
    async fetchUser() {
      const { data } = await getUserInfo()
      this.user = data.user
    },
    async handleFollow() {
      if (this.profile.following) {
        await unfollowAuthor(this.username)
        this.profile.following = false
      } else {
        await followAuthor(this.username)
        this.profile.following = true
      }
    },
    async handleFavorite(article) {
      const index = this.articles.findIndex((art) => art.slug === article.slug)
      this.$set(
        this.articles,
        index,
        Object.assign(article, { isDisabled: true })
      )
      if (article.favorited) {
        await cancelFavorite(article.slug)
        article.favorited = false
        article.favoritesCount--
      } else {
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount++
      }
      this.$set(
        this.articles,
        index,
        Object.assign(article, { isDisabled: false })
      )
    },
    changePage() {
      this.fetchArticles()
    },
  },
  watch: {
    $route(to, from) {
      if (to !== from) {
        this.username = this.$route.params.username
        this.fetchUser()
        this.fetchProfile()
        this.fetchArticles()
      }
    },
  },
}
</script>

<style></style>
