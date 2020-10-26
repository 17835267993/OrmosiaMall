import { formatDate } from "./utils"
import {debouce} from './utils'

export const itemListenerMixin = {
  data() {
    return {
      itemListenerMixin: null,
      refresh: null
    }
  },
  mounted() {
    this.refresh = debouce(this.$refs.scroll.refresh, 100)
    this.itemImgListener = () => {
      this.refresh()
    }
    this.$bus.$on('itemImgLoad', this.itemImgListener)
  }
}