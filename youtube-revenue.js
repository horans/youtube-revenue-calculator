/*****************************************************
*  project: youtube revenue calculator               *
*  description: main function                        *
*  author: horans@gmail.com                          *
*  url: github.com/horans/youtube-revenue-calculator *
*  update: 190702                                    *
*****************************************************/
/* global Vue, WebFont, url, axios */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "ytrc" }] */

/* bus */
var bus = new Vue()

/* font */
WebFont.load({
  google: { families: ['Roboto'] },
  active: function () { bus.$emit('ytrc.font') },
  inactive: function () { bus.$emit('ytrc.font') },
  timeout: 2000
})

/* vue */
var ytrc = new Vue({
  el: '#app',
  data: {
    config: {
      channel: url('?channel') === undefined ? false : url('?channel') === '1',
      desc: url('?desc') === undefined ? true : url('?desc') === '1',
      link: url('?link') === undefined ? true : url('?link') === '1',
      rpm: url('?rpm') === undefined ? false : url('?rpm') === '1',
      highlight: url('?highlight') === undefined ? false : url('?highlight') === '1',
      note: url('?note') === undefined ? true : url('?note') === '1',
      detail: url('?detail') === undefined ? false : url('?detail') === '1',
      title: url('?title') || '',
      key: url('?key') || window.key || ''
    },
    state: {
      init: false,
      wait: false,
      done: true,
      tool: false,
      help: false,
      title: url('?title'),
      key: url('?key'),
      error: {
        url: false,
        id: false,
        key: false,
        other: false
      }
    },
    link: {
      path: '',
      likes: 0,
      subscribers: 0,
      videos: 0,
      views: 0,
      channel: 'Unknown',
      title: 'Unknown',
      publish: 'Unknown',
      default: 'Unknown'
    },
    slider: {
      views: {
        config: {
          format: {
            to: function (value) {
              return Math.round(value)
            },
            from: Number
          },
          tooltips: {
            to: function (value) {
              return Math.round(value) + ' Views'
            },
            from: Number
          },
          // step: 100,
          connect: [true, false],
          range: {
            'min': [0, 1],
            '20%': [1000, 100],
            '40%': [10000, 1000],
            '60%': [100000, 10000],
            '80%': [1000000, 100000],
            'max': [10000000]
          },
          pips: {
            mode: 'range',
            density: 2.2
          }
        },
        value: [1000]
      },
      rpm: {
        config: {
          format: {
            to: function (value) {
              return parseFloat(value.toFixed(2))
            },
            from: Number
          },
          tooltips: [{
            to: function (value) {
              return '$ ' + value.toFixed(2)
            },
            from: Number
          }, {
            to: function (value) {
              return '$ ' + value.toFixed(2)
            },
            from: Number
          }],
          connect: true,
          step: 0.01,
          range: {
            'min': 0,
            'max': 10
          },
          pips: {
            mode: 'positions',
            density: 5,
            values: [0, 20, 40, 60, 80, 100],
            filter: function (value) {
              return value % 1 ? (value % 0.5 ? 0 : 2) : 1
            },
            format: {
              to: function (value) {
                return '$ ' + value.toFixed(2)
              },
              from: Number
            }
          }
        },
        value: [1.36, 3.40]
      }
    },
    api: {
      base: 'https://www.googleapis.com/youtube/v3/',
      channel: {
        path: 'channels',
        pattern: ['youtube.com/channel/'],
        example: 'https://www.youtube.com/channel/UCY_LMaDAoa6hwHKBE4Dx56w'
      },
      video: {
        path: 'videos',
        pattern: ['youtube.com/watch?v=', 'youtu.be/'],
        example: 'https://www.youtube.com/watch?v=DqbcHgli0ik'
      }
    }
  },
  methods: {
    togglePanel: function (panel, state) {
      if (typeof this.state[panel] === 'boolean') {
        if (typeof state === 'boolean') {
          this.state[panel] = state
        } else {
          this.state[panel] = !this.state[panel]
        }
      }
    },
    toggleLink: function () {
      // stackoverflow.com/questions/1714786/
      var serialize = function (obj, state) {
        var str = []
        for (var p in obj) {
          if (obj.hasOwnProperty(p)) {
            var s = obj[p]
            var v = true
            if (typeof s === 'boolean') s = s ? 1 : 0
            if (p === 'key' && !state.key) v = false
            if (p === 'title' && !state.title) v = false
            if (v) str.push(encodeURIComponent(p) + '=' + encodeURIComponent(s))
          }
        }
        return str.join('&')
      }
      var l = window.location
      window.history.replaceState(null, null, l.protocol + '//' + l.host + l.pathname + '?' + serialize(this.config, this.state))
    },
    // calculate revennue
    calculateRevenue: function (rpm, days) {
      // views * rpm * days / 1000
      return (this.link.views * (parseFloat(rpm) || this.slider.rpm.value[0]) * (parseInt(days) || 1) / 1000)
    },
    // format number
    formatNumber: function (num, cur) {
      return typeof num === 'number' ? num.toLocaleString('en-US', cur ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : undefined) : 0
    },
    // query youtube api for input link
    queryYouTube: function () {
      var t = this
      var a = t.api[t.config.channel ? 'channel' : 'video']
      var n = -1
      var id
      for (var i = 0; i < a.pattern.length; i++) {
        if (n === -1) {
          n = t.link.path.indexOf(a.pattern[i])
          id = t.link.path.substr(n + a.pattern[i].length)
        }
      }
      if (n > -1) {
        t.state.done = true
        t.state.error.url = false
      } else {
        t.state.done = false
        t.state.error.url = true
      }
      if (t.state.done) {
        t.state.wait = true
        t.state.done = true
        t.state.error.id = false
        t.state.error.key = false
        t.state.error.other = false
        axios({
          method: 'get',
          url: t.api.base + a.path,
          params: {
            part: 'snippet,contentDetails,statistics',
            id: id,
            key: t.config.key
          },
          timeout: 2000
        }).then(function (res) {
          if (res.data && res.data.items.length > 0) {
            // success
            t.link.likes = parseInt(res.data.items[0].statistics.likeCount) || 0
            t.link.views = parseInt(res.data.items[0].statistics.viewCount) || 0
            t.link.videos = parseInt(res.data.items[0].statistics.videoCount) || 0
            t.link.subscribers = parseInt(res.data.items[0].statistics.subscriberCount) || 0
            t.link.title = res.data.items[0].snippet.title || t.link.default
            t.link.channel = res.data.items[0].snippet.channelTitle || t.link.default
            t.link.publish = new Date(res.data.items[0].snippet.publishedAt).toLocaleDateString('en-US') || t.link.default
          } else {
            // id error
            t.state.done = false
            t.state.error.id = true
          }
        }).catch(function (err) {
          // fail
          t.state.done = false
          if (err.response && (err.response.status === 400 || err.response.status === 403)) {
            // key error
            t.state.error.key = true
          } else {
            // other error
            t.state.error.other = true
          }
          window.console.log(err)
        }).then(function () {
        // always
          t.state.wait = false
        })
      }
    }
  },
  created: function () {
  },
  mounted: function () {
    // page ready when font loaded
    bus.$on('ytrc.font', function () {
      ytrc.state.init = true
    })
    // copy note
    this.$refs['note-guide'].innerHTML = this.$refs['note-content'].innerHTML
  },
  watch: {
    // update url when config changes
    'config': {
      handler: function () {
        this.toggleLink()
      },
      deep: true,
      immediate: true
    },
    // update url when key/title state changes
    'state.key': function (nv) {
      this.toggleLink()
      if (!nv) this.config.key = window.key
    },
    'state.title': function (nv) {
      this.toggleLink()
      if (!nv) this.config.title = ''
    },
    // link counter with slider for views
    'slider.views.value': {
      handler: function (nv) {
        this.link.views = nv[0]
      },
      immediate: true
    },
    // detail only for link and not for highlight
    'config.detail': {
      handler: function (nv) {
        if (nv && (!this.config.link || this.config.highlight)) this.config.detail = false
      },
      immediate: true
    },
    'config.link': {
      handler: function (nv) {
        if (!nv) this.config.detail = false
      },
      immediate: true
    },
    'config.highlight': {
      handler: function (nv) {
        if (nv) this.config.detail = false
      },
      immediate: true
    }
  }
})
