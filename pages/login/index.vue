<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ isLogin ? 'Sign in' : 'Sign up' }}</h1>
          <p class="text-xs-center">
            <nuxt-link to="/register" v-if="isLogin"
              >Need an account?</nuxt-link
            >
            <nuxt-link to="/login" v-else>Have an account?</nuxt-link>
          </p>

          <ul class="error-messages">
            <template v-for="(messages, field) in errorMsg">
              <li v-for="(message, index) in messages" :key="index">
                {{ `${field} ${message}` }}
              </li>
            </template>
          </ul>

          <form @submit.prevent="handleSubmit">
            <fieldset class="form-group" v-if="!isLogin">
              <input
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Name"
                v-model="user.username"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="email"
                placeholder="Email"
                v-model="user.email"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="password"
                placeholder="Password"
                v-model="user.password"
                required
              />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              {{ isLogin ? 'Sign in' : 'Sign up' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login, register } from '@/api/user'
const Cookie = process.client ? require('js-cookie') : undefined
export default {
  name: 'LoginIndex',
  middleware: ['unAuth'],
  data() {
    return {
      user: {
        username: '',
        email: '',
        password: '',
      },
      errorMsg: {},
    }
  },
  computed: {
    isLogin() {
      return this.$route.name === 'login'
    },
  },
  methods: {
    async handleSubmit() {
      try {
        const loginApi = this.isLogin ? login : register

        const { data } = await loginApi({ user: this.user })

        Cookie.set('user', data.user)
        this.$router.push('/')
      } catch (error) {
        console.dir(error)
        this.errorMsg = error.response.data.errors
      }
    },
  },
}
</script>

<style></style>
