<template>
  <div class="me-info">
    <div class="head">
      <div class="head-t">
        <div class="clear"><span class="iconfont icon-shezhi pull-right seting"></span></div>
      </div>
      <div class="head-b">
        <ul class="clear">
          <li>
            <span>本周新增</span>
            <span style="font-size: 60px"> {{data.addCount}}</span>
          </li>
          <li>
            <span>我的金币</span>
            <span style="font-size: 60px">{{data.goldCount}}</span>
          </li>
          <li>
            <span>我的房卡</span>
            <span style="font-size: 60px">{{data.cardCount}}</span>
          </li>
          <li>
            <span>我的钻石</span>
            <span style="font-size: 60px">{{data.diamondCount}}</span>
          </li>
          <li>
            <span>支付宝号</span>
            <span style="font-size: 60px">{{data.alipayAccout}}</span>
          </li>
          <li>
            <span>微信号</span>
            <span style="font-size: 60px">{{data.wechartAccout}}</span>
          </li>

        </ul>
        <ul>
          <li>
            <span>申请提现 <mt-field  placeholder="请输入金额" v-model="goldCount"></mt-field></span>
            <mt-button type="default"  @click ="submitCash()">确认提款</mt-button>
          </li>
        </ul>
        <ul>
          <li>
            <span>微信号:<mt-field  placeholder="微信号" v-model="waccount"></mt-field></span>
          </li>
          <li>
            <span>支付宝号:<mt-field  placeholder="支付宝号" v-model="aliaccount"></mt-field></span>
          </li>
          <li>
            <mt-button type="default"  @click ="updateAccount()">确认修改</mt-button>
          </li>
        </ul>
      </div>
    </div>

    <div class="main">

    </div>
  </div>
</template>

<script>
  import {queryMy} from '@/api/my'
  import {updateAgent} from '@/api/my'
  import {submitCashToServer} from '@/api/cash'

  export default {
    name: 'hello',
    data() {
      return {
        goldCount:'',
        waccount:'',
        aliaccount:'',
        data: {
          addCount: 0,
          goldCount: 0,
          cardCount: 0,
          diamondCount: 0,
          wechartAccout: '',
          alipayAccout: ''
        }
      }
    },
  watch:{

  }
  ,
  computed:{

  }
  ,
  methods:{
    submitCash(){
      let gold = this.goldCount
      if(!gold || gold < 0) {
        MessageBox.alert('输入值错误!')
        return
      }
      submitCashToServer(gold).then(response=>{
        const  data = response.data.data
        if(data.succ){
          _self.$router.push({
            path: "/cash"
          });
        }else{
          alert(data.message)
        }
      })
    },
    updateAccount(){
      let _self = this
      let alipayaccout = this.aliaccount
      if(alipayaccout === '') {
        alert('请输入支付宝号！')
      }
      let wechartaccout = this.waccount
      if(wechartaccout === '') {
        alert('请输入微信号！')
        return
      }
      updateAgent(alipayaccout,wechartaccout).then(response=>{
        const  data = response.data.data
        if(data){
          alert("修改成功")
        }else{
          alert('修改失败')
        }
      })
    }
  }
  ,
  // 創建后挂载到root之后调用该钩子函数
  mounted()
  {

  }
  ,
  // 该实例被创建还没挂载root之前，ajax可以在这里
  created()
  {

    queryMy().then(response => {
      const data = response.data.data
      this.data = data
    })
  }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .me-info {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #E9EFEF;
  }

  .head {
    .head-t {
      height: 4rem;
      background: #53CAC3;
      .seting {
        padding: 10px;
        font-size: 0.5rem;
        color: #FFFFFF;
        font-weight: bold;
      }
      .my-info {
        margin: 0.533333rem 0.466666rem 0 0.333333rem;
        height: 1.733333rem;
        color: #fff;
        font-weight: normal;
        img {
          width: 1.733333rem;
          height: 1.733333rem;
          border-radius: 0.866666rem;
        }
        .my-m {
          padding: 0.4rem 0.32rem;
          span {
            display: block;
          }
          span:nth-child(1) {
            font-size: 0.4rem;
          }
        }
        .my-r {
          padding: 0.4rem 0.32rem;
        }
        .my-r {
          span {
            display: block;
            text-align: right;
          }
          .my-r-l {
            padding: 0.4rem 0.066666rem;
          }
        }
      }
    }
    .head-b {
      background: #fff;
      ul {
        list-style: none;
        li {
          float: left;
          width: 33.33%;
          text-align: center;
          padding: 0.466666rem 0 0.4rem 0;
          span {
            display: block;
          }
          span:nth-child(1) {
            font-weight: bold;
            font-size: 0.5rem;
          }
          span:nth-child(2) {
            color: #B3B3B3;
          }

        }
      }
    }
  }

  .main {
    margin-top: 0.24rem;
    color: #333;
    ul {
      list-style: none;
      background: #FFFFFF;
      li {
        width: 25%;
        float: left;
        text-align: center;
        border-right: 1px solid #E5E5E5;
        border-bottom: 1px solid #E5E5E5;
        padding: 0.613333rem 0 0.506666rem 0;
        span {
          display: block;
        }
        span:nth-child(1) {
          margin-bottom: 0.266666rem;
          font-size: 0.7rem;
        }
      }
      li:nth-child(4n+0) {
        border-right: none;
      }
    }
  }

  .bottom {
    a {
      color: #333;
      display: block;
      position: relative;
    }
    a:after {
      content: "\e90a";
      position: absolute;
      right: 0;
      top: 0;
    }
    margin-top: 0.24rem;
    ul {
      list-style: none;
      background: #fff;
      li {
        padding: 0.4rem 0.266666rem;
        border-bottom: 1px solid #F4F4F4;
        font-size: 0.48rem;
      }
      .icon {
        font-family: "iconfont" !important;
        font-style: normal;
        font-size: 0.506666rem;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        padding: 0.453333rem;
        /*vertical-align: middle;*/
      }
      /*.icon1:before{
                content: "\e60e";
            }
            .icon2:before{
                content: "\e62a";
            }*/
    }
  }
</style>
