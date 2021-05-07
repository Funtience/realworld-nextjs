<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>

        <article-meta :article="article" :user="user" />
      </div>
    </div>

    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12">
          <div v-html="article.body"></div>
          <ul class="tag-list">
            <li
              class="tag-default tag-pill tag-outline"
              v-for="(tag, index) in article.tagList"
            >
              {{ tag }}
            </li>
          </ul>
        </div>
      </div>

      <hr />

      <div class="article-actions">
        <article-meta :article="article" :user="user" />
      </div>

      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <form class="card comment-form">
            <div class="card-block">
              <textarea
                class="form-control"
                placeholder="Write a comment..."
                rows="3"
                v-model="comment.body"
              ></textarea>
            </div>
            <div class="card-footer">
              <img :src="user.image" class="comment-author-img" />
              <button
                class="btn btn-sm btn-primary"
                @click.prevent="postComment"
              >
                Post Comment
              </button>
            </div>
          </form>

          <article-comment
            v-for="(comment, index) in comments"
            :key="index"
            :comment="comment"
            :user="user"
            :slug="article.slug"
            @del="delComment"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getArticleDetail,
  getArticleComments,
  addArticleComments,
} from '@/api/article'
import ArticleMeta from './components/article_meta.vue'
import ArticleComment from './components/article_comment.vue'
import { mapState } from 'vuex'

const MarkdownIt = require('markdown-it')
export default {
  name: 'ArticleIndex',
  components: { ArticleMeta, ArticleComment },
  computed: {
    ...mapState(['user']),
  },
  data() {
    return {
      comment: {
        body: '',
      },
    }
  },
  async asyncData({ params }) {
    const [{ data: detailData }, { data: commentsData }] = await Promise.all([
      getArticleDetail(params.slug),
      getArticleComments(params.slug),
    ])
    const { article } = detailData
    const md = new MarkdownIt()

    article.body = md.render(article.body)

    return {
      article,
      comments: commentsData.comments,
    }
  },
  methods: {
    async postComment() {
      if (this.comment.body.trim()) {
        const { data } = await addArticleComments(this.article.slug, {
          comment: this.comment,
        })

        this.comments = [data.comment].concat(this.comments)
        this.comment.body = ''
      }
    },
    delComment(id) {
      const index = this.comments.findIndex((comment) => comment.id === id)
      this.comments.splice(index, 1)
    },
  },
  head() {
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.article.description,
        },
      ],
    }
  },
}
</script>

<style></style>
