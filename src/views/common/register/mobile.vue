<template>
  <div class="app-container">
    <div class="form-container">
      <div class="form">
        <h1><span>新用户注册</span></h1>
        <div class="form-item"><i class="iconfont icon-user"></i> <input type="tel" v-model="mobile" placeholder="请输入手机号" /></div>
        <div class="error-msg" v-if="errorMsg">
          <span>{{ errorMsg }}</span>
        </div>
        <el-button type="primary" @click="nextStep">下一步</el-button>
        <p class="agreement-tip">
          <i class="iconfont" :class="{ 'icon-choose': !agree, 'icon-Check': agree }" @click="agree = !agree"></i> 同意
          <router-link class="link" to="/agreement/register">《汇有财注册协议》</router-link>
        </p>
        <p class="have-account">已有汇有财账号？<router-link class="link" to="/login">立即登录</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import { isExistUser } from '@/api/common/register'
import { isMobile } from '@/assets/js/regular'
import { mapMutations } from 'vuex'

export default {
  name: 'mobile',
  data() {
    return {
      agree: true,
      mobile: '',
      errorMsg: ''
    }
  },
  watch: {
    mobile(newVal) {
      if (newVal === '') {
        this.errorMsg = ''
      }
    }
  },
  methods: {
    nextStep() {
      if (!isMobile(this.mobile)) {
        this.errorMsg = '请输入正确的手机号!!'
        return false
      }
      isExistUser({ mobile: this.mobile }).then(res => {
        if (res.data.data.isExistUser === '1') {
          this.errorMsg = '该手机号已经存在!!'
        } else {
          this.setRegisterMobile(this.mobile)
          this.$router.push({ name: 'registerForm' })
        }
      })
    },
    ...mapMutations({
      setRegisterMobile: 'SET_REGISTER_MOBILE'
    })
  }
}
</script>

<style scoped lang="scss">
@import '../../../assets/css/theme.scss';
.app-container {
  min-width: 1140px;
  width: 100%;
  height: 500px;
  background: url('./mobile_bg.png') center center;
  .form-container {
    width: 1140px;
    height: 100%;
    margin: 0 auto;
    padding: 35px 0;
    .form {
      font-size: $font-size-small-s;
      position: relative;
      width: 380px;
      height: 430px;
      border-radius: 6px;
      margin: 0 0 0 auto;
      background: #fff;
      padding: 21px 29px 0 31px;
      text-align: center;
      h1 {
        height: 20px;
        line-height: 20px;
        font-size: 20px;
        padding: 6px 0;
        margin-bottom: 58px;
        span {
          font-weight: 400;
          color: rgba(74, 74, 74, 1);
          border-bottom: 2px solid #fb9d1f;
        }
      }
      .form-item {
        width: 320px;
        height: 40px;
        background: rgba(255, 255, 255, 1);
        position: relative;
        i {
          display: inline-block;
          position: absolute;
          top: 5px;
          width: 40px;
          border-right: 1px solid;
          border-image: linear-gradient(180deg, rgba(169, 169, 169, 0), rgba(226, 226, 226, 0.96), rgba(151, 151, 151, 0)) 1 1;
          font-size: 20px;
          color: #cecece;
          line-height: 30px;
        }
        input {
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          padding: 4px 0 4px 52px;
          border: 1px solid rgba(227, 227, 227, 1);
          border-radius: 2px;
          &:focus {
            border-color: #fb7b1f;
          }
        }
      }
      .error-msg {
        margin-top: 10px;
        width: 320px;
        padding: 10px;
        border: 1px solid #e84518;
        background: #ffe5e5;
        color: #e84518;
        border-radius: 5px;
        font-size: 12px;
        text-align: left;
      }
      button {
        margin-top: 30px;
        width: 320px;
        height: 40px;
        border-radius: 2px;
        color: #fff;
        font-size: 18px;
        font-weight: 400;
      }
      p.agreement-tip {
        text-align: left;
        margin-top: 20px;
        height: 16px;
        i {
          cursor: pointer;
          &.icon-choose {
            color: #cdcdcd;
          }
          &.icon-Check {
            color: #099ef5;
          }
        }
        .link {
          color: $color-link;
        }
      }
      p.have-account {
        position: absolute;
        bottom: 24px;
        left: 105px;
        .link {
          color: #fb891f;
        }
      }
    }
  }
}
</style>
