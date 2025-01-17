<template>
  <div class="overview">
    <div class="board">
      <section>
        <h6>累计利息收益</h6>
        <p>
          <span class="big">{{ totalIncomeBig }}</span> <span class="small">.{{ totalIncomeSmall }}元</span>
        </p>
      </section>
      <div>
        <el-button type="info" v-if="user.platformFlag === '3'" @click="switchSystem">系统切换</el-button>
        <checkstatus :success="linkToCharge">
          <el-button type="warning">充值</el-button>
        </checkstatus>
        <checkstatus :success="linkToTocash">
          <el-button type="warning">提现</el-button>
        </checkstatus>
      </div>
    </div>
    <div class="amount" id="amount"></div>
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/graphic'
import checkstatus from '@/components/CheckStatus'

import api from '@/api/djs/Mine/overview'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'overview',
  mixins: [],
  components: { checkstatus },
  data() {
    return {
      dialogOptions: {
        show: false
      },
      amountInfo: {},
      totalIncomeBig: 0,
      totalIncomeSmall: 0
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    switchSystem() {
      location.href = '/hyc/#/mine/overview'
    },
    linkToCharge() {
      this.$router.push({ name: 'charge' })
    },
    linkToTocash() {
      this.$router.push({ name: 'tocash' })
    },
    ...mapMutations({
      setPersonalAccount: 'SET_PERSONALACCOUNT'
    })
  },
  mounted() {
    const $this = this
    ;(async function initPage() {
      const myChart = echarts.init(document.getElementById('amount'))
      await api.getPersonalAccount().then(res => {
        const totalIncome = res.data.totalIncome
        $this.amountInfo = res.data
        $this.totalIncomeBig = totalIncome.split('.')[0]
        $this.totalIncomeSmall = totalIncome.split('.')[1]
        $this.setPersonalAccount($this.amountInfo)
      })

      myChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        color: ['#F8DF38', '#F98128', '#42B1FF', '#37F1BE'],
        legend: {
          top: 'middle',
          left: 370,
          right: 100,
          itemWidth: 20,
          itemHeight: 20,
          itemGap: 30,
          data: ['可用余额', '在投本金', '冻结金额', '待收利息'],
          formatter: function(name) {
            const data = [
              { value: $this.amountInfo.banlance, name: '可用余额' },
              { value: $this.amountInfo.waitBackPrincipal, name: '在投本金' },
              { value: $this.amountInfo.tocashFreeAmount, name: '冻结金额' },
              { value: $this.amountInfo.waitBackInterest, name: '待收利息' }
            ]
            let target
            for (let i = 0; i < data.length; i++) {
              if (data[i].name === name) {
                target = data[i].value
              }
            }
            let arr = ['{a|' + name + '(元)}', '{b|' + target + '}']
            return arr.join('\n')
          },
          textStyle: {
            rich: {
              a: {
                fontSize: 14,
                align: 'center',
                padding: [0, 10, 0, 10],
                lineHeight: 25
              },
              b: {
                fontSize: 20,
                verticalAlign: 'top',
                align: 'center',
                padding: [0, 0, 8, 0]
              }
            }
          }
        },
        series: [
          {
            name: '金额类型',
            type: 'pie',
            radius: ['35%', '50%'],
            center: ['25%', '50%'],
            avoidLabelOverlap: false,
            hoverAnimation: true,
            silent: true,
            label: {
              normal: {
                show: true,
                position: 'center',
                verticalAlign: 'middle',
                formatter: ['{a|总资产(元)}', '{b|' + $this.amountInfo.totalAmount + '}'].join('\n'),
                rich: {
                  a: {
                    textAlign: 'center',
                    fontSize: 14,
                    color: '#4a4a4a',
                    padding: [18, 0],
                    fontWeight: 'normal'
                  },
                  b: {
                    textAlign: 'center',
                    color: '#4a4a4a',
                    fontSize: 20
                  }
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: $this.amountInfo.banlance, name: '可用余额' },
              { value: $this.amountInfo.waitBackPrincipal, name: '在投本金' },
              { value: $this.amountInfo.tocashFreeAmount, name: '冻结金额' },
              { value: $this.amountInfo.waitBackInterest, name: '待收利息' }
            ]
          }
        ]
      })
    })()
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../assets/css/mixins';
@import '../../../../assets/css/theme';

.overview {
  width: 842px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.board {
  height: 180px;
  background-color: #ffffff;
  border: 1px solid #dcdcdc;
  display: flex;
  align-items: center;
  padding: 0 40px;
  justify-content: space-between;
  section {
    font-size: $font-size-small-s;
    color: $color-text;
    line-height: 1;
    h6 {
      text-align: center;
      margin-bottom: 20px;
    }
    span.big {
      font-size: 34px;
    }
    span.small {
      font-size: 18px;
    }
  }
  button {
    width: 120px;
    height: 40px;
    line-height: 40px;
    margin: 0 15px;
    padding: 0;
    border-radius: 8px;
    font-size: $font-size-medium;
    color: #fff;
    cursor: pointer;
    &:last-child {
      margin-right: 0;
    }
    span {
      display: block;
      width: 100%;
      height: 100%;
      a {
        display: block;
        color: #fff;
      }
    }
  }
}

.amount {
  background-color: #fff;
  border: 1px solid #dcdcdc;
  padding: 0 40px;
  margin-top: 20px;
  flex: 1;
}
</style>
