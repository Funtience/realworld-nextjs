import dayjs from 'dayjs'
import Vue from 'vue'

Vue.filter('dateFormat', (dateStr, format = 'MMM D, YYYY') => {
  return dayjs(dateStr).format(format)
})
