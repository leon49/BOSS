<template>
    <div class="login-bg">
      <div id="login">
        <form action="">
          <h3>代理登录</h3>
          <ul class="info-login">
            <li><b>用户名<i class="icon-down"></i></b><input type="text" v-model="userules.userid" placeholder="用户名"></li>
            <li><input type="password" v-model="userules.userpwd" placeholder="密码"></b></li>
            <li><input @click.prevent="infologin" type="submit" value="进入"></li>
          </ul>
        </form>
      </div>
      <!--底部-->
    </div>
</template>

<script>
  import Store from "../../js/userstore"
    export default {
        data () {
            return {
                isNhad:false,
                userlist:[],
                //1用户信息
                userules:{
                  userid:"",
                  userpwd:""
                },
                lable:""
            }
        },
        components:{
        },
        watch:{
          '$route' (to, from) {
            const toDepth = to.path.split('/').length
            const fromDepth = from.path.split('/').length
            this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
          },
          userlist:{
            handler:function(items){
              Store.save(items);
            },
            deep:true
          }
        },
        methods: {
          infologin(){
              let _self=this;
              let users=Store.fetch();
              users.forEach(function (i) {
                if(_self.userules.userid==='123'&&_self.userules.userpwd=='234'){
                    _self.$router.push({
                      path:"/home"
                    });
                    //console.log(_self.$router);
                    //console.log("登录成功");
                }else{
                    alert("用户名与密码不匹配！")
                }
              });
          },

        },
        mounted(){
            //加载之前先给一个可以登录的用户
          let _self=this;
          let admin={
            userid:"",
            userpwd:""
          };
          _self.userlist.push(admin);
          _self.userules.userid=admin.userid;
          _self.userules.userpwd=admin.userpwd;
          //console.log("aaa");
        }
    }

</script>

<style lang="scss" scoped>
  @import "../../styles/login.scss";

</style>
