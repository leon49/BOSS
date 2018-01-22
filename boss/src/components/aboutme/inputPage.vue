<template>
  <div class="job_detial">
    <div class="job_detial_header">
      <router-link to="/aboutme" class="flex_child"><span class="icon-left"></span></router-link>
      <div class="sub-page-top-text">
        <span>输入{{typeName}}</span>
      </div>
    </div>
    <div class="top_detial_bg" style="padding:0.6rem">
      <span style="font-size: 0.55rem;" >{{typeName}}</span>
      <div style="margin-top: 0.3rem;margin-bottom: 0.5rem">
        <input style="font-size: 0.45rem;width:100%;background-color: #eeeeee;padding: 0.5rem;border-radius: 0.1rem;" placeholder="请输入" v-model="content">
      </div>
      <b class="buttonstyle"  @click ="submitCash()">提交</b>
    </div>
  </div>
</template>

<script>
  import {updateAgent} from '@/api/my'
  import {submitCashToServer} from '@/api/cash'

  export default {
    data() {
      return {
        typeName:"信息",
        content:'',
        otherContent:''
      }
    },
    name: "take-out-cash",
    methods:{
      submitCash(){
        let _self = this;
        switch (this.typeName){
          case "提现金额":{
            let gold = _self.content
            if(!gold || gold < 0) {
              alert('输入值错误!')
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

            break;
          }
          case "微信号":{
            if(_self.content === '') {
              alert('请输入微信号！')
              return
            }
            updateAgent(_self.otherContent,_self.content).then(response=>{
              const  data = response.data.data
              if(data){
                alert("修改成功")
                _self.$router.push({
                  path: "/aboutme"
                });
              }else{
                alert('修改失败')
              }
            })
            break;
          }
          case "支付宝号":
            if(_self.content === '') {
              alert('请输入支付宝号！')
              return
            }
            updateAgent(_self.content,_self.otherContent).then(response=>{
              const  data = response.data.data
              if(data){
                alert("修改成功")
                _self.$router.push({
                  path: "/aboutme"
                });
              }else{
                alert('修改失败')
              }
            })
            break;
          default:

        }

      },
      fecthIndex(){
        this.typeName=this.$route.params.typeName;
        this.otherContent = this.$route.params.otherContent;
      }
    },
    created(){
      this.fecthIndex()
    },

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../styles/jobdetial.scss";
  @import "../../styles/main.scss";
</style>
