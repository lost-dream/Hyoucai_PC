<template>
  <div class="wrapper">
    <div class="top">
      <img src="./image/date_back.png" alt="" />
      <ul>
        <li>
          <dl>
            <dt>
              <div class="title"><i></i> <span>用户累计出借额（元）</span></div>
            </dt>
            <dd><count-up v-if="lendCount !== null" name="lendCount" :count="lendCount"></count-up></dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>
              <div class="title"><i></i> <span>累计赚取金额（元）</span></div>
            </dt>
            <dd><count-up v-if="incomeCount !== null" name="incomeCount" :count="incomeCount"></count-up></dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>
              <div class="title"><i></i> <span>今日交易（元）</span></div>
            </dt>
            <dd><count-up v-if="todayCount !== null" name="todayCount" :count="todayCount"></count-up></dd>
          </dl>
        </li>
      </ul>
    </div>
    <div class="content">
      <ul class="tabs" v-if="showTabs">
        <li :class="tabActive === 0 ? 'active' : ''" v-if="tabConfig.TZ_YZJH === '1'" @click="getQSList">轻松投</li>
        <li :class="tabActive === 1 ? 'active' : ''" v-if="tabConfig.TZ_SB === '1'" @click="getZXList">自选投</li>
        <li :class="tabActive === 2 ? 'active' : ''" v-if="tabConfig.TZ_ZQZR === '1'" @click="getGRList">个人债转</li>
      </ul>
      <div class="area-wrapper" v-if="tabActive === 0">
        <div class="area" v-for="(item, i) in QSList" :key="i">
          <h3 v-if="item.head">
            <i><img :src="item.head.icon" alt=""/></i> <span>{{ item.head.title }}</span>
          </h3>
          <ul class="items">
            <li class="item">
              <div class="title">
                <i><img :src="item.iconUrl" alt=""/></i> <span>{{ item.projectName }}</span>
                <em v-for="(tag, index) in item.tags" :key="index">{{ tag.tagName }}</em>
              </div>
              <ul class="info-wrapper">
                <li class="info">
                  <dl>
                    <dt>
                      <em class="common">{{ item.basicsInvestRate }}</em>
                      <span class="per">%</span>
                      <span v-if="parseFloat(item.activityInvestRate) !== 0 && item.activityInvestRate !== ''">+{{ item.activityInvestRate }}%</span>
                    </dt>
                    <dd>历史平均年化收益率</dd>
                  </dl>
                </li>
                <li class="info">
                  <dl>
                    <dt>{{ item.minInvAmount }}元</dt>
                    <dd>起投金额</dd>
                  </dl>
                </li>
                <li class="info">
                  <dl>
                    <dt>{{ item.loanMent }}</dt>
                    <dd>锁定期</dd>
                  </dl>
                </li>
                <li class="info">
                  <dl>
                    <dd><el-progress :percentage="item.investPercent"></el-progress></dd>
                  </dl>
                </li>
                <li class="info">
                  <template v-if="item.status !== 1">
                    <!--1.未开启 2.已投X% 3.满标(包括item.investPercent >= 100 || item.investEndTimestamp <= 0 || item.status === 3)-->
                    <el-button disabled v-if="item.investPercent >= 100 || item.investEndTimestamp <= 0 || item.status === 3"> 还款中 </el-button>
                    <checkstatus @success="judgeBooking(item)" v-else style="width:100%;">
                      <el-button> 授权出借 </el-button>
                    </checkstatus>
                  </template>
                  <template v-else>
                    <el-button type="primary" @click.native="judgeBooking(item)"> 预售中 </el-button>
                  </template>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="pagination-wrapper">
          <pagination :count-page="countPage" :page-val="page" @handleCurrentChange="handleCurrentChange"></pagination>
        </div>
        <div class="no-data-wrapper" v-if="QSList.length === 0"><noData :type="noDataType"></noData></div>
      </div>
      <div class="area-wrapper" v-if="tabActive === 1">
        <div class="area" v-for="(item, i) in ZXList" :key="i">
          <h3 v-if="item.head">
            <i><img :src="item.head.icon" alt=""/></i> <span>{{ item.head.title }}</span>
          </h3>
          <ul class="items">
            <li class="item">
              <div class="title">
                <i><img :src="item.iconUrl" alt=""/></i> <span>{{ item.projectName }}</span>
                <em v-for="(tag, index) in item.tags" :key="index">{{ tag.tagName }}</em>
              </div>
              <ul class="info-wrapper">
                <li class="info">
                  <dl>
                    <dt>
                      <em class="common">{{ item.basicsInvestRate }}</em>
                      <span class="per">%</span>
                      <span v-if="item.activityInvestRate !== '0.0'">+{{ item.activityInvestRate }}%</span>
                    </dt>
                    <dd>历史平均年化收益率</dd>
                  </dl>
                </li>
                <li class="info">
                  <dl>
                    <dt>{{ item.minInvAmount }}元</dt>
                    <dd>起投金额</dd>
                  </dl>
                </li>
                <li class="info">
                  <dl>
                    <dt>{{ item.loanMent }}</dt>
                    <dd>锁定期</dd>
                  </dl>
                </li>
                <li class="info">
                  <dl>
                    <dd><el-progress :percentage="item.investPercent"></el-progress></dd>
                  </dl>
                </li>
                <li class="info">
                  <!-- 0.预售 1.投资中 2.满标 3.已完结-->
                  <template v-if="item.status !== 0">
                    <checkstatus @success="judgeBooking(item)" v-if="item.status === 1" style="width:100%;">
                      <el-button> 授权出借 </el-button>
                    </checkstatus>
                    <el-button disabled v-else>还款中</el-button>
                  </template>
                  <template v-else>
                    <el-button type="primary" @click.native="judgeBooking(item)"> 预售中 </el-button>
                  </template>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="pagination-wrapper">
          <pagination :count-page="countPage1" :page-val="page1" @handleCurrentChange="handleCurrentChange1"></pagination>
        </div>
        <div class="no-data-wrapper" v-if="ZXList.length === 0"><noData :type="noDataType"></noData></div>
      </div>
      <div class="area-wrapper" v-if="tabActive === 2">
        <div class="area" v-for="(item, i) in GRList" :key="i">
          <h3 v-if="item.head">
            <i><img :src="item.head.icon" alt=""/></i> <span>{{ item.head.title }}</span>
          </h3>
          <ul class="items">
            <li class="item">
              <div class="title">
                <i><img :src="item.iconUrl" alt=""/></i> <span>{{ item.projectName }}</span>
                <em v-for="(tag, index) in item.tags" :key="index">{{ tag.tagName }}</em>
              </div>
              <ul class="info-wrapper">
                <li class="info">
                  <dl>
                    <dt>{{ item.investRate }} <span>%</span></dt>
                    <dd>历史平均年化收益率</dd>
                  </dl>
                </li>
                <li class="info">
                  <dl>
                    <dt>{{ item.minInvAmount }}元</dt>
                    <dd>起投金额</dd>
                  </dl>
                </li>
                <li class="info">
                  <dl>
                    <dt>{{ item.loanMent }}</dt>
                    <dd>锁定期</dd>
                  </dl>
                </li>
                <li class="info">
                  <dl>
                    <dt>
                      已投<span class="hight-light">{{ item.investPercent }}%</span>
                    </dt>
                    <dd><el-progress :percentage="item.investPercent"></el-progress></dd>
                  </dl>
                </li>
                <li class="info">
                  <el-button type="primary"> <router-link :to="{ name: 'download' }">下载APP</router-link> </el-button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="pagination-wrapper">
          <pagination :count-page="countPage2" :page-val="page2" @handleCurrentChange="handleCurrentChange2"></pagination>
        </div>
        <div class="no-data-wrapper" v-if="GRList.length === 0"><noData :type="noDataType"></noData></div>
      </div>
    </div>
    <!-- 系统不匹配的错误弹窗 -->
    <Dialog
      class="system-maintenance-dialog"
      title="汇有财温馨提示"
      confirmText="我知道了"
      :show.sync="systemDialogOptions.show"
      :singleButton="systemDialogOptions.singleButton"
    >
      <div>
        <p>{{ systemDialogOptions.msg }}</p>
      </div>
    </Dialog>
  </div>
</template>

<script>
import pagination from '@/components/pagination/pagination'
import countUp from '@/components/countUp/index'
import noData from '@/components/NoData/index'
import Dialog from '@/components/Dialog/Dialog'
import {
  getPageConfig,
  getCountMsg,
  getQSList,
  getZXList,
  getGRList, // TODO 个人债转接口（未开发）
  easyInvestDetail,
  optionalInvestDetail
} from '@/api/hyc/lend'
import { getUser } from '@/assets/js/cache'
import { mapGetters } from 'vuex'
import checkstatus from '@/components/CheckStatus'
const ERR_OK = '1'
export default {
  name: 'lend',
  data() {
    return {
      lendCount: null,
      incomeCount: null,
      todayCount: null,
      size: 10,
      page: 1,
      countPage: 0,
      page1: 1,
      countPage1: 0,
      page2: 1,
      countPage2: 0,
      userName: null,
      QSList: [],
      ZXList: [],
      GRList: [],
      tabConfig: {
        TZ_SB: '',
        TZ_YZJH: '',
        TZ_ZQZR: ''
      },
      showTabs: false,
      tabActive: 0,
      noDataType: 'production',
      systemDialogOptions: {
        show: false,
        singleButton: true,
        msg: ''
      }
    }
  },
  props: ['redPacketId', 'couponId'],
  methods: {
    judgeBooking(item) {
      if (this.userName) {
        if (item.itemId) {
          easyInvestDetail({ productId: item.productId, itemId: item.itemId }).then(res => {
            if (res.data.resultCode === '1') {
              this.$router.push({ name: 'easyDetail', query: { productId: item.productId, itemId: item.itemId } })
            } else {
              this.systemDialogOptions.show = true
              this.systemDialogOptions.msg = res.data.resultMsg
            }
          })
        } else {
          optionalInvestDetail({ projectNo: item.projectNo }).then(res => {
            if (res.data.resultCode === '1') {
              this.$router.push({ name: 'optionalDetail', query: { projectNo: item.projectNo, productId: item.productId } })
            } else {
              this.systemDialogOptions.show = true
              this.systemDialogOptions.msg = res.data.resultMsg
            }
          })
        }
      } else {
        this.$router.push({ name: 'login' })
      }
    },
    handleCurrentChange(val) {
      this.page = val
      this.getQSList()
    },
    handleCurrentChange1(val) {
      this.page1 = val
      this.getZXList()
    },
    handleCurrentChange2(val) {
      this.page2 = val
      this.getGRList()
    },
    getQSList() {
      this.tabActive = 0
      let params = {
        userName: this.userName,
        curPage: this.page,
        maxLine: this.size,
        channel: 1
      }
      if (this.couponId) {
        params.couponId = this.couponId
      }
      if (this.redPacketId) {
        params.redPacketId = this.redPacketId
      }
      getQSList(params).then(res => {
        let result = res.data
        if (result.resultCode === ERR_OK) {
          this.QSList = result.data.list
          this.countPage = parseInt(result.data.countPage)
          this.page = parseInt(result.data.curPage)
        }
      })
    },
    getZXList() {
      this.tabActive = 1
      let params = {
        userName: this.userName,
        curPage: this.page1,
        maxLine: this.size,
        channel: '1'
      }
      if (this.couponId) {
        params.couponId = this.couponId
      }
      if (this.redPacketId) {
        params.redPacketId = this.redPacketId
      }
      getZXList(params).then(res => {
        let result = res.data
        if (result.resultCode === ERR_OK) {
          this.ZXList = result.data.list
          this.countPage1 = parseInt(result.data.countPage)
          this.page1 = parseInt(result.data.curPage)
        }
      })
    },
    getGRList() {
      // TODO 个人债转列表（未开发）
      this.tabActive = 2
      let params = {
        userName: this.userName,
        curPage: this.page2,
        maxLine: this.size,
        channel: '1'
      }
      if (this.couponId) {
        params.couponId = this.couponId
      }
      if (this.redPacketId) {
        params.redPacketId = this.redPacketId
      }
      getGRList(params).then(res => {
        let result = res.data
        if (result.resultCode === ERR_OK) {
          this.GRList = result.data.list
          this.countPage2 = parseInt(result.data.countPage)
          this.page2 = parseInt(result.data.curPage)
        }
      })
    },
    getTopMsg() {
      getCountMsg().then(res => {
        let data = res.data
        if (data.resultCode === ERR_OK) {
          this.lendCount = data.accumulativeInvAmountSum
          this.incomeCount = data.accumulativeProfitAmtSum
          this.todayCount = data.invTodayAmt
        }
      })
    },
    getPageConfig() {
      getPageConfig().then(res => {
        let data = res.data
        if (data.resultCode === ERR_OK) {
          this.tabConfig.TZ_YZJH = data.data.TZ_YZJH
          this.tabConfig.TZ_SB = data.data.TZ_SB
          this.tabConfig.TZ_ZQZR = data.data.TZ_ZQZR
          let tabsArr = []
          for (let i in this.tabConfig) {
            if (this.tabConfig[i] === '1') {
              tabsArr.push('1')
            }
          }
          if (tabsArr.length > 1) {
            this.showTabs = true
          }
          this.getQSList()
        }
      })
    }
  },
  components: {
    pagination,
    countUp,
    noData,
    Dialog,
    checkstatus
  },
  computed: {
    ...mapGetters(['user'])
  },
  created() {
    let user = getUser()
    if (user) {
      this.userName = user.userName
    }
    this.getPageConfig()
    this.getTopMsg()
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/css/mixins';
@import '../../../assets/css/theme';
.wrapper {
  .top {
    position: relative;
    width: 100%;
    img {
      width: 100%;
      @media screen and (min-width: 1140px) and (max-width: 1365px) {
        max-width: none;
        width: 120%;
      }
      @media screen and (min-width: 1366px) and (max-width: 1500px) {
        max-width: none;
        width: 115%;
      }
      @media screen and (min-width: 1501px) and (max-width: 1630px) {
        max-width: none;
        width: 107%;
      }
      @media screen and (min-width: 1631px) and (max-width: 1800px) {
        max-width: none;
        width: 103%;
      }
      @media screen and (min-width: 1801px) and (max-width: 1919px) {
        max-width: none;
        width: 101%;
      }
    }
    ul {
      position: absolute;
      top: 23%;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      width: 1140px;
      font-size: 0;
      overflow: hidden;
      li {
        display: inline-block;
        margin-right: 130px;
        font-size: $font-size-small-s;
        text-align: center;
        dl {
          dt {
            color: #ccc;
            font-size: 0;
            margin-bottom: 5px;
            i {
              display: inline-block;
              vertical-align: top;
              @include square(19px);
              margin-right: 8px;
              background-position: center center;
              background-size: 100% 100%;
              background-repeat: no-repeat;
            }
            span {
              display: inline-block;
              vertical-align: top;
              font-size: $font-size-small-s;
            }
          }
          dd {
            font-size: 16px;
            letter-spacing: 1px;
            p {
              letter-spacing: 7px;
            }
          }
        }
        &:nth-of-type(1) {
          dl {
            dt {
              i {
                background-image: url('./image/investment@2x.png');
              }
            }
          }
        }
        &:nth-of-type(2) {
          dl {
            dt {
              i {
                background-image: url('./image/income@2x.png');
              }
            }
          }
        }
        &:nth-of-type(3) {
          dl {
            dt {
              i {
                background-image: url('./image/time@2x.png');
              }
            }
          }
        }
      }
    }
  }
  .content {
    width: 1140px;
    margin: 0 auto;
    margin-top: 30px;
    .tabs {
      height: 36px;
      margin-bottom: 30px;
      font-size: 0;
      overflow: hidden;
      li {
        display: inline-block;
        padding: 0 20px 13px;
        margin-right: 60px;
        font-size: $font-size-small;
        color: $color-text;
        cursor: pointer;
        border-bottom: 1px solid transparent;
        &:last-child {
          margin-right: 0;
        }
        &.active {
          color: $color-button;
          border-bottom-color: $color-button;
        }
      }
    }
    .area-wrapper {
      width: 100%;
      .area {
        h3 {
          font-size: 0;
          margin-top: 30px;
          margin-bottom: 15px;
          i {
            display: inline-block;
            vertical-align: top;
            @include square(19px);
            margin-right: 8px;
            margin-top: 2px;
            img {
              width: 100%;
            }
          }
          span {
            display: inline-block;
            vertical-align: top;
            font-size: $font-size-medium;
          }
        }
        .items {
          border: 1px solid #e5e5e5;
          border-bottom: 0;
          background-color: #fff;
          font-size: 0;
          overflow: hidden;
          .item {
            padding: 37px 30px 39px;
            background-color: #fff;
            border-bottom: 1px solid #eee;
            .title {
              font-size: 0;
              margin-bottom: 27px;
              i {
                display: inline-block;
                vertical-align: top;
                @include square(22px);
                img {
                  width: 100%;
                }
              }
              span {
                display: inline-block;
                vertical-align: top;
                margin: 0 8px;
                font-size: $font-size-medium;
              }
              em {
                display: inline-block;
                vertical-align: top;
                margin: 3px 5px 0 0;
                padding: 0 4px;
                border-radius: 2px;
                border: 1px solid rgba(252, 85, 65, 1);
                font-size: $font-size-small-ss;
                color: rgba(252, 85, 65, 1);
              }
            }
            .info-wrapper {
              display: flex;
              vertical-align: top;
              padding-left: 32px;
              .info {
                flex: 1;
                margin-top: 10px;
                dl {
                  text-align: center;
                  dt {
                    margin-bottom: 12px;
                    font-size: 22px;
                    color: $color-text;
                  }
                  dd {
                    font-size: $font-size-small-s;
                    color: #9b9b9b;
                  }
                }
                &:first-child {
                  margin-top: 0;
                  dl {
                    text-align: left;
                    dt {
                      font-size: 30px;
                      color: #fc5541;
                      span {
                        font-size: 20px;
                      }

                      span:nth-child(3) {
                        margin-left: 6px;
                      }
                    }
                  }
                }
                &:nth-last-of-type(2) {
                  margin-top: 14px;
                  dl {
                    dd {
                      margin-top: 20px;
                    }
                  }
                  span {
                    margin-left: 5px;
                    color: #fc5541;
                  }
                  /deep/ .el-progress-bar__outer {
                    height: 4px !important;
                    border-radius: 0;
                    background-color: #fdc48d;
                  }
                  /deep/ .el-progress-bar__inner {
                    border-radius: 0;
                    background-color: #fb891f;
                  }
                  /deep/ .el-progress__text {
                    display: none;
                  }
                }
                &:last-child {
                  width: 160px;
                  .el-button {
                    float: right;
                    width: 160px;
                    height: 44px;
                    padding: 0;
                    line-height: 44px;
                    margin-top: 8px;
                    background-color: #fb7b1f;
                    color: #fff;
                    font-size: $font-size-medium;
                    &.is-disabled {
                      background-color: #ccc;
                      border-color: #ccc;
                    }
                    a {
                      display: block;
                      width: 100%;
                      height: 100%;
                      color: #fff;
                    }
                  }
                }
              }
            }
            &:last-child {
              border-bottom: none;
            }
          }
        }
        &:nth-last-of-type(2) {
          margin-bottom: 30px;
          .items {
            border-bottom: 1px solid #e5e5e5;
          }
        }
      }
      .no-data-wrapper {
        height: 570px;
        margin: 30px auto;
        .__no__data {
          height: 100%;
          background-color: #fff;
          border: 1px solid #e5e5e5;
        }
      }
    }
    .pagination-wrapper {
      margin-bottom: 29px;
    }
  }
}
</style>
