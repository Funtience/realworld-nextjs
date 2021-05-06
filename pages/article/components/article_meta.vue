<template>
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
      <span class="date">{{ article.createdAt }}</span>
    </div>
    <template v-if="user.username === article.author.username">
      <nuxt-link
        class="btn btn-outline-secondary btn-sm"
        :to="{
          name: 'editor',
          params: {
            slug: article.slug,
          },
        }"
      >
        <i class="ion-edit"></i> Edit Article
      </nuxt-link>

      <button
        class="btn btn-outline-danger btn-sm"
        :class="{ disabled: isDeleting }"
        @click="deleteArticle"
      >
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </template>
    <template v-else>
      <button
        class="btn btn-sm"
        :class="[
          article.author.following ? 'btn-secondary' : 'btn-outline-secondary',
        ]"
        @click="handleFollow(article)"
      >
        <i class="ion-plus-round"></i>
        &nbsp; {{ article.author.following ? 'Unfollow' : 'Follow' }}
        {{ article.author.username }}
        <!-- <span class="counter">(10)</span> -->
      </button>
      &nbsp;&nbsp;
      <button
        class="btn btn-sm"
        :class="[article.favorited ? 'btn-primary' : 'btn-outline-primary']"
        @click="handleFavorite(article)"
      >
        <i class="ion-heart"></i>
        &nbsp;
        {{ article.favorited ? 'Unfavorite Article' : 'favorite Article' }}
        <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </template>
  </div>
</template>

<script>
import {
  followAuthor,
  unfollowAuthor,
  favoriteArticle,
  unfavoriteArticle,
  delArticle,
} from '@/api/article'
export default {
  name: 'ArticleMeta',
  props: {
    article: {
      type: Object,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isDeleting: false,
    }
  },
  methods: {
    async handleFollow(article) {
      if (article.author.following) {
        await unfollowAuthor(article.author.username)
        article.author.following = false
      } else {
        await followAuthor(article.author.username)
        article.author.following = true
      }
    },
    async handleFavorite(article) {
      if (article.favorited) {
        await unfavoriteArticle(article.slug)
        article.favorited = false
        article.favoritesCount--
      } else {
        await favoriteArticle(article.slug)
        article.favorited = true
        article.favoritesCount++
      }
    },
    async deleteArticle() {
      await delArticle(this.article.slug)
      this.$router.push('/')
    },
  },
}
</script>

<style></style>
