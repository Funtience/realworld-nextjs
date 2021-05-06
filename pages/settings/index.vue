<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                  v-model="user.image"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  v-model="user.username"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                  v-model="user.bio"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                  v-model="user.email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  v-model="user.password"
                />
              </fieldset>
              <button
                @click.prevent="updateSettings"
                class="btn btn-lg btn-primary pull-xs-right"
              >
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr />
          <button class="btn btn-outline-danger" @click="logout">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserInfo, updateUserInfo } from '@/api/user'
const Cookie = process.client ? require('js-cookie') : undefined
export default {
  name: 'SettingsIndex',
  middleware: ['auth'],
  data() {
    return {
      user: {
        bio: '',
        email: '',
        image: '',
        username: '',
        password: '',
      },
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const { data } = await getUserInfo()

      this.user.bio = data.user.bio || ''
      this.user.email = data.user.email
      this.user.image = data.user.image
      this.user.username = data.user.username
    },
    async updateSettings() {
      let params = {}
      // 空值不传
      Object.keys(this.user).forEach((key) => {
        if (this.user[key].trim()) {
          params[key] = this.user[key]
        }
      })
      const { data } = await updateUserInfo({
        user: params,
      })
      this.$router.push({
        name: 'profile',
        params: {
          username: data.user.username,
        },
      })
    },
    logout() {
      Cookie.remove('user')
      this.$router.push('/')
    },
  },
}
</script>

<style></style>
