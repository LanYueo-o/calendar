<template>
    <div>
        <!--登录模态框-->
        <Modal :value="loginModel" title="登录/注册" width="300" draggable @on-visible-change="handleClose">
            <Tabs v-model="tabsActive">
                <TabPane label="登录" name="login" icon="md-contact">
                    <Form ref="loginData" :model="loginData" :rules="loginRules">
                        <FormItem prop="user">
                            <Input type="text" v-model="loginData.user" placeholder="登录用户名"></Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="loginData.password" placeholder="登录密码"></Input>
                        </FormItem>
                        <FormItem align="center">
                            <Button type="primary" @click="handleSubmit('loginData')">登录</Button>
                        </FormItem>
                    </Form>
                </TabPane>
                <TabPane label="注册" name="register" icon="ios-contact-outline">
                    <Form ref="loginData" :model="loginData" :rules="loginRules">
                        <FormItem prop="user">
                            <Input type="text" v-model="loginData.user" placeholder="注册用户名"></Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="loginData.password" placeholder="注册密码"></Input>
                        </FormItem>
                        <FormItem align="center">
                            <Button type="primary" @click="handleRegister('loginData')">注册</Button>
                        </FormItem>
                    </Form>
                </TabPane>
            </Tabs>
            <div slot="footer" align="center">
                <p class="login-text">注册用户可以使用提醒等功能</p>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        name: "loginModel",
        props:['loginModel'],
        data(){
            return{
                tabsActive: "login",
                loginData:{
                    user: "",
                    password: ""
                },
                loginRules: {
                    user: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        // { type: 'string', min: 6, message: 'The password length cannot be less than 6 bits', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            handleClose(value){
                if(!value){
                    this.$emit('loginModelStatus',false);
                }
            },
            /**
             * Register { 注册方法}
             */
            handleRegister(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let params = {
                            userName:this.loginData.user,
                            userPassWord:this.loginData.password,
                            status: 1
                        };
                        this.$axios.$post('http://192.168.1.70:3000/users/userRegister',params).then(res => {
                            console.info('用户注册-------');
                            console.log(res);
                            if(res.result.code === 200){
                                this.$Notice.success({
                                    title: res.result.msg,
                                });
                                this.tabsActive = "login";
                            }else {
                                this.$Notice.error({
                                    title: res.result.msg,
                                });
                            }
                        });
                    }
                });
                this.$refs[name].resetFields();
            },

            /**
             * Register { 登录方法}
             */
            handleSubmit(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let params = {
                            userName:this.loginData.user,
                            userPassWord:this.loginData.password,
                        };
                        this.$axios.$post('http://192.168.1.70:3000/users/userLogin',params).then(res => {
                            console.info('用户登录-------');
                            console.log(res);
                            if(res.result.code === 200){
                                this.$emit('setLoginText',res.result.list.userName);
                                sessionStorage.setItem('setLoginText',res.result.list.userName);
                                sessionStorage.setItem('setLoginStatus','1');
                                this.$emit('loginModelStatus',false);
                                location.reload();
                            }else {
                                this.$Notice.error({
                                    title: res.result.msg,
                                });
                            }
                        });
                    }
                });
                this.$refs[name].resetFields();
            },
        },
    }
</script>

<style scoped>

</style>
