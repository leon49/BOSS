<template>
  <div id="main">
    <!--固定的顶部-->
    <div class="main_fixed_top">
      <div class="job_header clear">
        <div class="job_header_left">
         <mt-button>申请提现</mt-button>
        </div>
      </div>
      </div>
    <!--列表-->
    <div class="job_content" id="jobcontent" ref="wrapper">
      <ul class="page-infinite-list job_lists" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
          infinite-scroll-distance="50">
        <li v-for="job in jobs">
          <router-link @click="changeDetialId(job)" :to="{ name: 'detail', params: { jobId: job.id }}">
            <h4 class="clear">申请金额:<span>100001</span>
            </h4>
            <h4 class="clear">处理状态:<span>100001</span>
            </h4>
            <h4 class="clear">处理时间：<span>100001</span>
            </h4>
          </router-link>
        </li>
      </ul>
      <div v-show="loading" class="page-infinite-loading">
        <mt-spinner type="fading-circle"></mt-spinner>
        客官您滑慢点...
      </div>
    </div>
    <!--返回顶部-->
    <!-- <img v-show="willshow" @click="gotop" src="/static/images/backTop.png" class="backTop" alt=""> -->
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
        jobs: [],
        temp: [],
        jobId: "",
        loading: false,
        allLoaded: false,
        wrapperHeight: 0
      }
    },
    components: {
      slideTabComp, selectCityComp, compRequireComp
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
        let _this = this;
        this.$http.get(_this.apiUrl)
          .then(response => {
            if (response.data.code == "0") {
              _this.jobs = response.data.main;
              // 模擬每次下拉加載的10條假數據
              _this.temp = response.data.main;
              // console.log(response.data);
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      // 模擬無限下拉加載
      loadMore() {
        this.loading = true;
        setTimeout(() => {
          this.jobs = this.jobs.concat(this.temp);
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
      }

    },
    mounted() {
      // 去掉范湖底部事件监听
      // window.addEventListener("scroll", this.willscroll);
      //this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
      // console.log(this.$refs.wrapper.getBoundingClientRect().top);
    },
    created() {
      this.initApiUrl();
      this.$nextTick(function () {
        this.loadData();
      });
    }
  }

</script>

<style lang="scss" scoped>
  @import "../../styles/main.scss";
</style>
