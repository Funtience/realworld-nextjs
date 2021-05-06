<template>
  <div class="card">
    <div class="card-block">
      <p class="card-text">
        {{ comment.body }}
      </p>
    </div>
    <div class="card-footer">
      <nuxt-link
        :to="{
          name: 'home',
          params: {
            username: comment.author.username,
          },
        }"
        class="comment-author"
      >
        <img :src="comment.author.image" class="comment-author-img" />
      </nuxt-link>
      &nbsp;
      <nuxt-link
        :to="{
          name: 'home',
          params: {
            username: comment.author.username,
          },
        }"
        class="comment-author"
        >{{ comment.author.username }}</nuxt-link
      >
      <span class="date-posted">{{ comment.updatedAt }}</span>
      <span
        class="mod-options"
        v-if="comment.author.username === user.username"
        @click="handleDel(comment)"
      >
        <i class="ion-trash-a"></i>
      </span>
    </div>
  </div>
</template>

<script>
import { delArticleComments } from '@/api/article'
export default {
  name: 'ArticleMeta',
  props: {
    comment: {
      type: Object,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
  },
  methods: {
    async handleDel(comment) {
      await delArticleComments(this.slug, comment.id)
      this.$emit('del', comment.id)
    },
  },
}
</script>

<style></style>
