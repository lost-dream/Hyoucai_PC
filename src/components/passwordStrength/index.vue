<template>
  <div>
    <div class="part" :class="{ active: level === 1 }">
      <p>弱</p>
      <div class="strip weak"></div>
    </div>
    <div class="part" :class="{ active: level === 2 }">
      <p>中</p>
      <div class="strip normal"></div>
    </div>
    <div class="part" :class="{ active: level === 3 }">
      <p>强</p>
      <div class="strip strong"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      level: 0
    }
  },
  props: {
    pwd: {
      type: String,
      default: ''
    }
  },
  watch: {
    pwd(value) {
      if (value === '') {
        this.level = 0
      } else {
        this.regPWDLevel(value)
      }
    }
  },
  methods: {
    regPWDLevel(password) {
      let score = 0
      if (password.length >= 8 && password.length <= 10) {
        score += 5
      } else if (password.length > 10 && password.length <= 14) {
        score += 10
      } else if (password.length > 14 && password.length <= 20) {
        score += 20
      }
      if (/^[0-9]*$/.test(password)) {
        score += 0
      } else if (/^[0-9a-z]*$/.test(password)) {
        score += 10
      } else if (/^[0-9A-Z]*$/.test(password)) {
        score += 10
      } else if (/^[0-9A-Za-z]*$/.test(password)) {
        score += 20
      }
      let num = password.replace(/[0-9]/g, '').length
      if (num >= 1 && num <= 14) {
        score += 10
      } else if (num > 14 && num <= 19) {
        score += 20
      }
      if (score <= 30) {
        this.level = 1
      } else if (score >= 31 && score <= 50) {
        this.level = 2
      } else if (score >= 51 && score <= 60) {
        this.level = 3
      }
    }
  }
}
</script>

<style scoped lang="scss">
.part {
  float: left;
  width: 40px;
  margin-right: 1px;
  p {
    font-size: 12px;
    color: #cdcdcd;
  }
  &.active p {
    color: #000;
  }
  &.active .strip {
    opacity: 1;
  }
  &.active .strip strong {
    opacity: 0.6178;
  }
  .strip {
    margin-top: 8px;
    width: 100%;
    height: 4px;
    opacity: 0.24;
    &.weak {
      background: rgba(192, 248, 114, 1);
    }
    &.normal {
      background: rgba(8, 186, 235, 1);
    }
    &.strong {
      background: rgba(250, 22, 66, 1);
    }
  }
}
</style>
