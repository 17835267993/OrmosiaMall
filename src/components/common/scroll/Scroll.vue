<template>
  <div class="warpper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  name: "Scroll",
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scroll: null
    }
  },
  mounted() {
    // 1.创建BScroll对象
    // 在querySelector中拿到的不一定是准确的，所以我们要用ref
    // this.scroll = new BScroll(document.querySelector('.wrapper'))
    this.scroll = new BScroll(this.$refs.wrapper, {
      observeDOM: true,
      click: true,
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad
    })

    // 2.监听滚动的位置
    if(this.probeType === 2 || this.probeType === 3) {
      this.scroll.on('scroll', (position) => {
      // console.log(position);
        this.$emit('scroll', position)
    })
    }

    // 3.监听滚动位置
    if(this.pullUpLoad) {
      this.scroll.on('pullingUp', () => {
         // console.log("下载更多");
        this.$emit('pullingUp')
    })
    }
  },
  methods: {
    scrollTo(x, y, time=300) {
      this.scroll && this.scroll.scrollTo(x, y, time)
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp()
    },
    refresh() {
      // console.log('------');
      this.scroll && this.scroll.refresh()
    },
    getScrollY() {
      return this.scroll ? this.scroll.y : 0
    }
  },
}
</script>

<style>

</style>