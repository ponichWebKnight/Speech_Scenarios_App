window.axios = require('axios')
window._ = require('lodash')

let token = document.head.querySelector('meta[name="csrf-token"]')

if (token) {
  window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content
} else {
  console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token')
}

window.assistant_request_path = window.location.origin + window.location.pathname.replace(/\/widget(\/?)/i, '')