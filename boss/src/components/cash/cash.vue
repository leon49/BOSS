<template>
    <div id="main">
      <!--固定的顶部-->
      <div class="main_fixed_top">
        <div class="common_header clear">
          <div class="common_header_text">
            <span>提现</span>
          </div>
        </div>
      </div>
      <div v-if="datas.length != 0" style="margin-bottom: 0.3rem;" >
        <span style="margin-left:0.5rem;font-size: 0.6rem;color: #666666;">审批列表</span>
        <span style="font-size: 0.35rem;color: #666666;">(100金币=1元)</span>
        <span @click.prevent="jumpToTakeMoney" class="buttonCashStyle">申请提现</span>
      </div>
      <!--列表-->
      <div class="job_content" id="jobcontent" ref="wrapper">
        <ul class="job_lists"
            infinite-scroll-distance="50">
          <li v-for="data in datas"  >
            <div >
              <div style="display: inline-block;">
                <h4 style="font-size: 0.3rem;color: #5C5C5C">提现金额:<p style="color:#2F2F2F;font-size: 1rem">{{data.goldCount}}</p></h4>
              </div>
              <div style="display: inline-block;float: right">
                <h4 class="job_status_text" :class="{ 'job_status_text': data.status=='已通过','job_status_text2':data.status!='已通过' }">{{data.status}}</h4>
                <h4 style="font-size: 0.3rem;color: #5C5C5C;margin-top: 0.4rem"><span>{{data.cashTime}}</span></h4>
              </div>
            </div>
          </li>
        </ul>

        <div v-if="datas.length == 0"   >
          <span style="font-size: 0.7rem;color: #aaaaaa;
          text-align: center;position: absolute;left: 0rem;
          top:4.5rem;right:0rem;" >
            :) 还没提现记录呢
          </span>
        </div>

        <div v-show="loading" class="page-infinite-loading">
          <mt-spinner type="fading-circle"></mt-spinner>
          客官您滑慢点...
        </div>
      </div>
    </div>
</template>

<script>
  /*
  * 注=> : somename 向子组件传递数据
  *      @ some 接收子组件传递过来的自定义事件
  *说明：1、keep-alive子组件里的v-show为了点击自己切换自己下组件的显示和隐藏，v-if-else 是为了切换4个切换按钮 对应子组件的显示和隐藏
  * 2、组件内的 slideTemp是传到子组件的 数组数据(切换回变化)，selectCityComp内数据太多没向子组件传递
  * 3、@toParent是子组件传递给父组件的数据的自定义方法,在父组件自定义为：fromChild 方法
  * 4、@hide 子组件传递过来的自定义事件,在父组件自定义为：hide 方法
  * v-show只是单纯的切换css属性display的none和block，v-if 会移除和新建DO树！
  * 5、:indexArr 为了传递到子组件记录是否选中的状态
  *
  *
  *
  *
  **/
  // 推荐子组件
  import {queryList} from '@/api/cash'
  import {queryMy} from '@/api/my'

  export default {
    data() {
      return {
        navlist: [],
        slideIndex: "",
        isShowSlide: false,
        slideTemp: [],
        // 传递到 公司和 要求子组件 记录是否选中的状态
        indexArr: [[[0], [0], [0]], [[0], [0], [0]]],
        slideData: [
          [],
          // 城市选择这项数据太多没用父子通信传递数据
          [0, 1],
          [],
          []
        ],
        willshow: false,
        timer: null,
        mainscroll: null,
        apiUrl: "",
        datas: [],
        temp: [],
        jobId: "",
        loading: false,
        allLoaded: false,
        wrapperHeight: 0,
        data: {
          addCount: 0,
          goldCount: 0,
          cardCount: 0,
          diamondCount: 0,
          wechartAccout: '',
          alipayAccout: '',
          guid:'',
          level:''
        },
      }
    },
    components: {

    },
    computed: {},
    methods: {
      // 3、接收子传来的选项
      fromChild(msg) {
        this.navlist[0].title = msg;
        // console.log(msg);
      },
      ///4、接收子传来的是否隐藏
      hide() {
        // this.isShowSlide=false;
        this.navlist.filter(value => {
          value.isSelected = false;
        });
      },
      // 5、切换的时候动态改变要传递到子组件的数据：this.slideTemp
      changeColor(nav, index) {
        let _this = this;
        this.slideIndex = index;
        this.slideTemp = this.slideData[index];
        if (nav.isSelected) {
          nav.isSelected = false;
        } else {
          // 先清空所有选中效果
          this.navlist.filter(value => {
            value.isSelected = false;
          });
          // 设置当前选中效果
          nav.isSelected = true;
        }
        // console.log(this.slideIndex);
      },
      willscroll() {
        //2.1 使用定时器，防止频繁滚动
        if (window.scrollTime) {
          window.clearTimeout(window.scrollTime);
        }
        //2.2 定时器
        window.scrollTime = window.setTimeout(() => {
          const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
          this.willshow = (scrollTop > 300) ? true : false;
          // console.log("滚动了");
        }, 100);
      },
      //3 返回顶部
      gotop() {
        this.willshow = !this.willshow;
        let d = document.documentElement;
        let b = document.body;
        // console.log(this.timer,d,b);
        this.timer = window.setInterval(() => {
          d.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1);
          b.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1);
          //到达顶部清除定时器，重新绑定滚动事件
          if ((d.scrollTop + b.scrollTop) === 0) clearInterval(this.timer, window.onscroll = this.willscroll);
        }, 10);
      },
      loadData() {
        let _this = this
        queryList().then(response => {
          _this.datas = response.data.data

          // _this.datas = "{{goldCount:10,status=\"已经通过\",cashTime=\"2011 2\"},{goldCount:10,status=\"已经通过\",cashTime=\"2011 2\"},{goldCount:10,status=\"已经通过\",cashTime=\"2011 2\"},{goldCount:10,status=\"已经通过\",cashTime=\"2011 2\"},{goldCount:10,status=\"已经通过\",cashTime=\"2011 2\"},{goldCount:10,status=\"已经通过\",cashTime=\"2011 2\"},{goldCount:10,status=\"已经通过\",cashTime=\"2011 2\"}}";
          // 模擬每次下拉加載的10條假數據
          // console.log(response.data)
        })
          .catch(error => {
            console.log(error);
          });
      },
      // 模擬無限下拉加載
      loadMore() {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          // console.log(this.jobs);
        }, 2500);
      },
      initApiUrl() {
        // 线上
        // let domain="https://"+window.location.host+"/";
        // 本地
        let domain = "http://" + window.location.host + "/";
        var str = "static/data/joblist.json";
        this.apiUrl = domain + str;
        // console.log(this.apiUrl);
      },
      // 4.1、阻止局部滚动到达边界后会造成页面继续滚动(不合适)
      stopScroll() {
        let container = document.getElementById("jobcontent");
        // console.log(container);
        container.addEventListener("touchmove", function (event) {
          event.preventDefault();
        }, false);
      },
      // 4、2把阻止事件remove
      removeStopScroll() {
        let container = document.getElementById("jobcontent");
        container.removeEventListener("touchmove", function (event) {
          event.preventDefault();
        }, false);
      },
      jumpToTakeMoney(){
        var _self = this;
        if( _self.data.alipayAccout==''
          && _self.data.wechartAccout==''){
            alert('请绑定微信号或者支付宝')
          }else{
            _self.$router.push({name : 'inputPage',params:{typeName:'提现金额'}});
          }
      }
    },
    mounted() {
      // 去掉范湖底部事件监听
      // window.addEventListener("scroll", this.willscroll);
      //this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
      // console.log(this.$refs.wrapper.getBoundingClientRect().top);
    },
    created() {
      this.$nextTick(function () {
        this.loadData();
      });

      queryMy().then(response => {
        const data = response.data.data
        this.data = data
      });
    }
  }

</script>

<style lang="scss" scoped>
  @import "../../styles/main.scss";

  .buttonCashStyle{
    position: absolute;
    right: 0.3rem;

    text-align: center;
    font-weight: bold;
    font-size: 0.4rem;
    font-style: normal;

    padding: 0.15rem 0.2rem 0.15rem 0.2rem;

    color: #81b9b4;
    background: #ebfbfa;
    border-radius: 0.3rem;
  }
</style>

