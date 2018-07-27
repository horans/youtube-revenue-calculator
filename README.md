# youtube revenue calculator

"youtube revenue calculator" (or "ytrc"),
will calculate the revenue of [YouTube](https://www.youtube.com/) video/channel, base on video view counts.
Multiple options provided.

## Install

Upload everthing to your server, eg.:

```text
//sample.com/ytrc/
```

## Usage

Embed `iframe.html` into your page.

```html
<iframe src="//sample.com/ytrc/iframe.html" width="800" height="600"></iframe>
```

## Guide

All of the options can by pass by URL query.
When you change them in setting panel, the URL will update at the same time.
Most of the options use "1/0" to present "on/off".
(eg., `channel=1&cpm=1`)

* `key`: Generate your own YouTube app [key](https://console.developers.google.com/)
    * and change it in iframe `head` or pass by URL query.
* `channel`: Default mode is for "video", turn this on for "channel".
* `desc`: To skip description under heading, turn this off.
* `link`: To manually input video views, turn this off.
* `cpm`: To manually input CPM, turn this on.
* `note`: To show note for CPM, turn this on.
* `highlight`: To highlight result with YouTube red background, turn this on.
* `detail`: To show detail for channel/video, turn this on.
    * Disabled when `link` is off, or `highlight` is on.
* `title`: You can override title with this.

## Extra

### Vendor

* [axios](https://github.com/axios/axios)
* [bootstrap](https://github.com/twbs/bootstrap)
* [noUiSlider](https://github.com/leongersen/noUiSlider)
* [pretty-checkbox.css](https://github.com/lokesh-coder/pretty-checkbox)
* [url()](https://github.com/websanova/js-url)
* [Vue](https://github.com/vuejs/vue)
* [vue-nouislider](https://github.com/horans/vue-nouislider)
* [Web Font Loader](https://github.com/typekit/webfontloader)

### References

* [SOCIAL BLADE](https://socialblade.com/youtube/youtube-money-calculator)
* [Influencer MarketingHub](https://influencermarketinghub.com/youtube-money-calculator/)
* [YTSC](https://subscribercounter.com/)
* [YouTube API Reference](https://developers.google.com/youtube/v3/docs/)

### Linter

* HTML: [HTMLHint](https://github.com/yaniswang/HTMLHint)
* CSS: [CSSLint](https://github.com/CSSLint/csslint)
* JavaScript: [standard](https://github.com/standard/standard)

### Change Log

__180727__

* initial release