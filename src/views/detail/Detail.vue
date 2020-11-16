<template>
  <div class="detail">
    <detail-nav-bar class="detail-bar" @titleClick="titleClick" ref="nav"/>
    <scroll class="content"  ref="scroll" 
            :probe-type="3" @scroll="contentScroll">
      <!-- 属性:topImages 传入值:top-images -->
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @detailImageLoad="detailImageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart" />
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'

import Scroll from 'components/common/scroll/Scroll'
// import Toast from 'components/common/toast/Toast'
import GoodsList from 'components/content/goods/GoodsList'

import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail'
import {debounce} from 'common/utils'
import {itemListenerMixin, backTopMixin} from 'common/mixin'

import { mapAction, mapActions } from 'vuex'

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    // Toast,
    GoodsList
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,
      
    }
  },
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid

    // 2.根据iid请求详情数据
    getDetail(this.iid).then(res => {
      // 1.获取顶部的图片轮播数据
      const data = res.result
      this.topImages = data.itemInfo.topImages

      // 2.获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

      // 3.获取店铺信息
      this.shop = new Shop(data.shopInfo)

      // 4.保存商品的详情数据
      this.detailInfo = data.detailInfo

      // 5.获取参数的信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

      // 6.取出评论的信息
      if(data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }
      this.$nextTick(() => {
        // 根据最新的数据，对应的DOM是已经被渲染出来
        // 但是图片依然没有加载完(目前获取到offsetTop不包含其中的图片)
        // offsetTop值不对的时候，都是因为图片的问题
        // this.themeTopYs = []

        // this.themeTopYs.push(0);
        // this.themeTopYs.push(-this.$refs.params.$el.offsetTop)
        // this.themeTopYs.push(-this.$refs.comment.$el.offsetTop)
        // this.themeTopYs.push(-this.$refs.recommend.$el.offsetTop)

        // console.log(this.themeTopYs);
      })
    })
    // 3.请求推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.list
    })
    // 4.给getThemeTopY赋值
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = []
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      // js中的最大值Number.MAX_VALUE
      this.themeTopYs.push(Number.MAX_VALUE)

    }, 100)
  },
  mounted() {
    
  },
  // updated() {
  //   this.themeTopYs = []

  //   this.themeTopYs.push(0);
  //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
  //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
  //   this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
  // },
  destroyed() {
    this.$bus.$off('itemImgLoad', this.itemImgListener)
  },
  methods: {
    ...mapActions(['addCart']),
    imageLoad() {
      this.$refs.scroll.refresh()
    },
    detailImageLoad() {
      this.refresh()
      this.getThemeTopY()
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100)
    },
    contentScroll(position) {
      // 1.获取y值
      const positionY = -position.y
      // 2，positionY和主题中值进行对比
      let length = this.themeTopYs.length
      for(let i = 0; i < length - 1; i++) {
        
        // if(this.currentIndex !== i && (position >= this.then[i] && positionY < this.themeTopYs[i+1])) {
        //   this.currentIndex = i;
        //   this.$refs.nav.currentIndex = this.currentIndex
        // }

        // if(this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) 
        // || (i === length - 1 && positionY >= this.themeTopYs[i]))){
        //   this.currentIndex = i;
        //   this.$refs.nav.currentIndex = this.currentIndex
        // }

        if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])){
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex
        }

      }
      // 3.是否显示回到顶部
      this.isShowBackTop = (-position.y) > 1000
    },
    addToCart() {
      // 1.创建对象并获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;

      // 2.添加到Store中，将商品加入到购物车
      // this.$store.cartList.push(product)
      // this.$store.commit('addCart', product)
      this.addCart(product).then(res => {
        // console.log(res);
        this.$toast.show(res)
      })
    }
  }
}
</script>

<style scoped>
  .detail {
    position: relative;
    z-index: 99;
    background-color: #fff;
    height: 100Vh;
  }
  .detail-bar {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .content {
    /* position: absolute;
    top: 44px; */
    height: calc(100% - 44px - 49px);
  }

</style>