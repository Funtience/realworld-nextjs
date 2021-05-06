<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <!-- 错误信息提示 -->
          <ul class="error-messages">
            <template v-for="(errors, field) in errorObj">
              <li v-for="(error, index) in errors" :key="field + error">
                {{ `${field} ${error}` }}
              </li>
            </template>
          </ul>
          <!-- /错误信息提示 -->

          <!-- 新增文章表单 -->
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  v-model="article.title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  v-model="article.description"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  v-model="article.body"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  v-model="tag"
                  @keypress="addTag"
                />
                <div class="tag-list">
                  <span
                    v-for="(tag, index) in article.tagList"
                    :key="index"
                    class="tag-default tag-pill"
                  >
                    <i class="ion-close-round" @click="removeTag(tag)"></i>
                    {{ tag }}
                  </span>
                </div>
              </fieldset>
              <button
                @click.prevent="postArticle"
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
          <!-- /新增文章表单 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createArticle, getArticleDetail, udateArticle } from '@/api/article'
export default {
  name: 'EditorIndex',
  middleware: ['auth'],
  data() {
    return {
      article: {
        title: '',
        description: '',
        body: '',
        tagList: [],
      },
      tag: '',
      slug: '',
      errorObj: {},
    }
  },
  async created() {
    this.slug = this.$route.params.slug
    if (this.slug) {
      const { data } = await getArticleDetail(this.slug)

      this.article.title = data.article.title
      this.article.description = data.article.description
      this.article.body = data.article.body
      this.article.tagList = data.article.tagList
    }
  },
  methods: {
    addTag(e) {
      var evt = window.event || e
      if (evt.keyCode == 13) {
        this.article.tagList.push(this.tag)
        this.tag = ''
      }
    },
    removeTag(tag) {
      const index = this.article.tagList.findIndex((t) => t === tag)
      this.article.tagList.splice(index, 1)
    },
    async postArticle() {
      try {
        const { data } = this.slug
          ? await udateArticle(this.slug, {
              article: this.article,
            })
          : await createArticle({
              article: this.article,
            })
        this.$router.push({
          name: 'article',
          params: {
            slug: data.article.slug,
          },
        })
      } catch (error) {
        this.errorObj = error.response.data.errors
      }
    },
  },
}
</script>

<style></style>
