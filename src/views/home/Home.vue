<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行', '新款', '精选']" 
                    @tabClick="clickTab" ref="tabControl1"
                    class="tab-control" 
                    v-show="isTabFixed"></tab-control>
    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            @scroll="contentScroll"
            :pull-up-load="true" 
            @pullingUp="loadMore" >
      <!-- 轮播图 -->
      <home-swiper :banners="banners" 
                    @swiperImageLoad="swiperImageLoad"
                    ref="hSwiper">
      </home-swiper>
      <!-- 推荐 -->
      <recommend-view :recommends="recommends"/>
      <!-- 本周流行 -->
      <feature-view></feature-view>
      <!-- 控制栏 -->
      <tab-control :titles="['流行', '新款', '精选']" 
                    @tabClick="clickTab" ref="tabControl2"></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <router-view/>
    
    
  </div>

</template>

<script>
import NavBar from 'components/common/navbar/NavBar';
import Scroll from 'components/common/scroll/Scroll';
import TabControl from 'components/content/tabControl/TabControl';
import GoodsList from 'components/content/goods/GoodsList';
import BackTop from 'components/content/backTop/BackTop'

import HomeSwiper from './childComps/HomeSwiper';
import RecommendView from './childComps/RecommendView';
import FeatureView from './childComps/FeatureView'


import {getHomeMultidata, getHomeGoods} from 'network/home';
import {debouce} from 'common/utils';
import {itemListenerMixin} from 'common/mixin'

export default {
  name: 'Home',
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    Scroll,
    TabControl,
    GoodsList,
    BackTop
  },
  mixins: [itemListenerMixin],
  data(){
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': {page: 0, list: []},
        'new': {page: 0, list: []},
        'sell': {page: 0, list: []}
      },
      currentType: 'pop',
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY:0
    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  actived() {
    this.$refs.scroll.scrollTo(0, this.saveY)
    
  },
  deactived() {
    this.$refs.scroll.refresh()
    // 记录离开时的位置
    this.saveY = this.$refs.scroll.getScrollY()

    // 2.取消全局事件的监听
    this.$bus.$off('itemImagLoad', this.itemImgListener)
    
  },
  created() {
    // 1.请求多个数据
    this.getHomeMultidata()
    
    // 2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')


  },
  mounted() {
    // 1.图片加载完的事件监听
    // const refresh = debouce(this.$refs.scroll.refresh, 100)
    // // 3.监听item中图片加载完成
    // this.$bus.$on('itemImageLoad', () => {
    // // this.$refs.scroll.refresh()
    //   refresh()
    // })
    // this.$bus.$on('itemImgLoad', this.itemImgListener)
    // 所有组件都有一个属性$el
    // console.log(this.$refs.tabControl.$el.offsetTop);
  },
  methods: {
    /**
     * 事件监听相关方法
     */
    clickTab(index) {
      switch(index) {
        case 0:
          this.currentType = 'pop';
          break;
        case 1:
          this.currentType = 'new';
          break;
        case 2:
          this.currentType = 'sell';
          break;
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },
    backClick() {
      // 先拿scroll组件，再去调用scroll的一个属性的一个方法
      // this.$refs.scroll.scroll.scrollTo(0, 0, 500)
      this.$refs.scroll.scrollTo(0, 0, 500)
    },
    contentScroll(position) {
      // 1.判断backTop是否显示
      this.isShowBackTop = (-position.y) > 1000

      // 2.判断tabControl是否吸顶
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    loadMore() {
      // console.log("加载更多");
      this.getHomeGoods(this.currentType)
      // 加载图片滑动有卡顿，需要重新加载一下有了图片的页面，
      // this.$refs.scroll.scroll.refresh()
    },
    swiperImageLoad() {
      // 当轮播图加载完成后调用，显示tabControl的offsetTop
      if(this.$refs.tabControl2){
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      }
    },
    /**
     * 网络请求相关 
     */ 
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        // console.log(res);
        // this.result = res;
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      })
    },
    getHomeGoods(type) {
      // 当前的 下一页
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then(res => {
        // console.log(res);
        // push(...items),数组的解构赋值,把新请求到的数组追加到变量中
        this.goods[type].list.push(...res.data.list);
        // 把最新页数更新到对象
        this.goods[type].page += 1;

        // 如果获取到数据 调用框架的finishPullUp()让它能够执行下一次下拉加载更多
        this.$refs.scroll.finishPullUp();
    })
    }
  }
}
</script>

<style scoped>
  #home {
    /* padding-top: 44px; */
    height: 100vh;
    position: relative;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /* position: fixed;
    left: 0;
    right: 0;
    top:0;
    z-index: 9; */
  }
  .tab-control {
    position: relative;
    z-index: 9;
  }
  .content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
</style>>
  