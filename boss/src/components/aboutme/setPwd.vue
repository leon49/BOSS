<template>
  <div class="job_detial">
    <div class="job_detial_header">
      <router-link to="/aboutme" class="flex_child"><span class="icon-left"></span></router-link>
      <div class="sub-page-top-text">
        <span>修改密码</span>
      </div>
    </div>
    <div class="top_detial_bg" style="padding:0.6rem">
      <span class="tip-text" >原始密码</span>
      <div class="container">
        <input class="content-text" placeholder="输入旧密码" v-model="form.oldPwd">
      </div>
      <span class="tip-text"  >新密码</span>
      <div class="container">
        <input class="content-text" placeholder="输入新密码" v-model="form.newPwd">
      </div>
      <span class="tip-text"  >重输新密码</span>
      <div class="container">
        <input class="content-text" placeholder="重复输入" v-model="newPwdRepeat">
      </div>
      <b class="buttonstyle"  @click ="onSubmit()">提交</b>
    </div>
  </div>
</template>

<script>
  import http from '@/utils/fetch'

  export default {
    data() {
      return {
        form: {
          oldPwd: '',
          newPwd: ''
        },
        newPwdRepeat:''
      }
    },
    name: "setPwd",
    methods: {
      onSubmit(){
        if( this.form.oldPwd=='' ){
          alert("旧密码不能为空");
          return;
        }
        if( this.form.newPwd=='' || this.newPwdRepeat=='' ){
          alert("新密码不能为空");
          return;
        }
        if( this.form.newPwd != this.newPwdRepeat ){
          alert("新密码两次输入不一致");
          return;
        }

        let requestParams = JSON.stringify(this.form);
        http.post('/user/updatePwd', requestParams).then((response) => {
          console.log("got response!")
            const succ = response.data.data
            if (succ) {
              alert('重置成功,请退出后重新登录')
            } else {
              alert(response.data.msg)
            }
          })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../styles/jobdetial.scss";
  @import "../../styles/main.scss";

  .tip-text{
    font-size: 0.4rem;
    color: #8D8D8D;
  }
  .container{
    margin-top: 0.2rem;
    margin-bottom: 0.6rem
  }
  .content-text{
    font-size: 0.4rem;
    width:100%;
    background-color: #eeeeee;
    padding: 0.4rem;
    border-radius: 0.1rem;
  }
</style>
