<template>
    <div class="container">
        <div class="concat">
            <div class="header">
                <div class="time">
                    <div class="month">
                        <span class="pre" @click="ChangeMonth('reduce')"><</span>
                        <a>{{month}}</a>
                        <span class="next" @click="ChangeMonth('add')">></span>
                    </div>
                    <div class="day-and-year">{{day}}，{{year}}，{{time}}</div>
                </div>
                <div class="login">
                    <a @click="handleLogin">{{loginText}}</a>
                    <Poptip content="content" placement="bottom" v-model="visibleout">
                        <div align="center" slot="content">
                            <a @click="handleLogout">退出</a>
                        </div>
                    </Poptip>
                </div>
            </div>
            <div class="week-info">
                <span v-for="(item,index) in weekDay">{{item}}</span>
            </div>
            <div class="day-and-day">
                <div class="content" v-for="(item,count) in weekIndexCount" :key="count">
                    <span class="date-click"></span>
                </div>

                <div class="content" v-for="(item,index) in DayList" v-bind:class="{'active': dayActive(index + 1)}">
                    <Poptip title="设置提醒" @on-popper-show="handlePop(remindList,index + 1)" v-model="visible[index + 1]">
                        <span class="date-click" @click="openPop(index + 1)">
                            <a v-bind:class="{'weekDayActive':weekDayActive(index + 1)}">
                                <p>{{index + 1}}</p>
                                <p v-if="handleSrc(remindList,index + 1)">
                                    <img class="remind" :src="handleSrc(remindList,index + 1)">
                                </p>
                            </a>
                        </span>
                        <div class="api" slot="content">
                            <div  v-show="checkLoginStatus">
                                <div style="margin-bottom: 10px">
                                    <Input v-model="setMessage" type="textarea" :rows="4" placeholder="请输入提醒内容..."/>
                                </div>
                                <div>
                                    <Button type="primary" @click="handleCreate">设置</Button>
                                    <Button v-for="(item,child) in remindList" :key="child" v-if="checkStatus(item,index + 1)" type="error" @click="handleRemove(item)">移除</Button>
                                </div>
                            </div>
                            <div v-show="!checkLoginStatus" align="center">
                                <span class="no-login-text">登录之后使用提醒功能</span>
                            </div>
                        </div>
                    </Poptip>
                </div>
            </div>
        </div>

        <!--引入登录组件-->
        <Login :loginModel="loginModel" @loginModelStatus="loginModelStatus" @setLoginText="setLoginText"></Login>
    </div>
</template>

<script>
    import { DateTime } from '../../utils/DateTime'
    import Login from './module/login'
    import io from 'socket.io-client'
    export default {
        name: "index",
        components:{
            Login
        },
        data(){
            return{
                monthDataList:['','壹月','貳月','叁月','肆月','伍月','陆月','柒月','捌月','玖月','拾月','拾壹月','拾貳月'],
                month: "",
                num: undefined,
                newNum: undefined,
                day: undefined,
                year: undefined,
                newYear: undefined,
                time: undefined,
                temp : [1,3,5,7,8,10,12],

                MoisteningYearStatus: false,
                weekDay: [],
                weekIndexCount: [],
                DayList: [],
                visible: [],

                remindList:[], //提醒信息列表

                setTime: '',
                setMessage:'',

                checkLoginStatus: false,
                visibleout: false,
                loginModel: false,
                loginText: "",
            }
        },
        watch: {
            year(val){
                console.info('年份改变--------------');
                console.info(val);
                this.newYear = val;
            },
            //监听月份改变，然后生成相对应的天数
            month(val) {
                console.info('月份改变--------------');
                console.info(val);
                const index = this.monthDataList.findIndex(item => item === val);
                console.info(index);
                this.initDay(index);
                this.checkWeekNum(index);
            },
            time(){
                setInterval(()=>{
                    let date = new DateTime();
                    this.time = date.getTime();
                },1000)
            }
        },
        created(){
            this.initMonth();
            this.initDay();
        },
        mounted(){
            let date = new DateTime();
            sessionStorage.setItem("y",date.getYear());
            sessionStorage.setItem("m",Number(date.getMonth()));
            this.newNum = sessionStorage.getItem("m");
            this.newYear = sessionStorage.getItem("y");
            this.loginText = sessionStorage.getItem('setLoginText') || "登录";

            let status = sessionStorage.getItem('setLoginStatus') || '0';
            if(status === '0'){
                this.checkLoginStatus = false;
            }else {
                this.checkLoginStatus = true;
            }

            //查询提醒信息
            this.handleSearchSet();

            this.responseMessage();
        },
        methods:{
            initMonth(){
                let date = new DateTime();
                this.num = Number(date.getMonth());
                this.day = date.getDay();
                this.year = date.getYear();
                this.month = this.monthDataList[this.num];
                this.weekDay = date.getWeekNum();
                this.time = date.getTime();
            },
            initDay(data){
                this.num = data;
                if(JSON.stringify(this.temp).includes(this.num)){
                    this.DayList.length = 31;
                }else {
                    this.DayList.length = 30;
                }
                if(this.num === 2 && this.year % 4 === 0){
                    this.DayList.length = 29;
                }else if(this.num === 2 && this.year % 4 !== 0){
                    this.DayList.length = 28;
                }
            },

            dayActive(index){
                if(index === Number(this.day) && this.num === Number(this.newNum)){
                    return true
                }
            },

            weekDayActive(index){
                const month = this.monthDataList.findIndex(item => item === this.month);
                let time = this.year + '-' + month + '-' + index;
                let weekArray = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
                let weekNum = weekArray[new Date(time).getDay()];
                if(weekNum === '星期六' || weekNum === '星期日'){
                    return true
                }
            },

            openPop(index){
                let month = (this.num < 10) ? '0' + this.num: this.num = this.num;
                index = (index < 10) ? '0' + index: index = index;
                this.setTime = this.year + "-" + month + "-" + index;
                this.visible[index] = true;
            },

            handlePop(item,index){
                for(let i in item){
                    let tm = item[i].set_time_start.split('-');
                    if(Number(tm[1]) === this.num && Number(tm[2]) === index){
                        this.setTime = item[i].set_time_start;
                        this.setMessage = item[i].set_message_info;
                        break;
                    }else {
                        this.setMessage = "";
                    }
                }
            },

            handleSrc(item,index){
                for(let i in item){
                    let tm = item[i].set_time_start.split('-');
                    if(Number(tm[0]) === Number(this.newYear) && Number(tm[1]) === this.num && Number(tm[2]) === index){
                        return  require('../../assets/images/提醒.png');
                    }
                }
            },

            //改变月份，需要计算对应星期数和月号数
            checkWeekNum(index){
                console.info('改变月份----------------');
                let arg = this.year + '-' + index + '-' + '1';
                let weekArray = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
                let week = weekArray[new Date(arg).getDay()];
                const weekIndex = weekArray.findIndex(item => item === week);
                this.weekIndexCount.length = weekIndex;
                console.info(week)
            },

            ChangeMonth(type){
                if(type === 'add'){
                    if(this.num === 12){
                        this.num = 1;
                        this.month = this.monthDataList[this.num];
                        this.year ++ ;
                    }else {
                        this.month = this.monthDataList[this.num + 1];
                        this.num ++;
                    }
                }else {
                    if(this.num === 1){
                        this.num = 12;
                        this.month = this.monthDataList[this.num];
                        this.year -- ;
                    }else {
                        this.month = this.monthDataList[this.num - 1];
                        this.num --;
                    }
                }
            },

            /**
             * Login {open Users to login Model}
             */
            handleLogin(){
                let status = sessionStorage.getItem('setLoginStatus') || '0';
                console.info(status);
                if(status === '1'){
                    setTimeout(()=>{
                        this.visibleout = true;
                    },200);
                }else {
                    this.loginModel = true;
                }
            },
            handleLogout(){
                sessionStorage.clear();
                location.reload();
            },

            loginModelStatus(status){
                this.loginModel = status;
            },
            setLoginText(data){
                this.loginText = data;
            },

            handleCreate() {
                let params = {
                    userName: sessionStorage.getItem('setLoginText'),
                    createTime:this.setTime,
                    createMessage:this.setMessage,
                    status: 1
                };
                this.$axios.$post('http://192.168.1.70:3000/users/userMessage',params).then(res => {
                    console.info('设置提醒信息-------');
                    console.log(res);
                    this.visible = [];
                    let code = res.result.code;
                    if(code === 200){
                        this.$Notice.success({
                            title: '设置提醒成功',
                        });
                        this.handleSearchSet();
                    }else {
                        this.$Notice.error({
                            title: res.result.msg,
                        });
                    }
                });
            },

            checkStatus(item,index){
                let tm = item.set_time_start.split('-');
                if(Number(tm[0]) === Number(this.newYear) && Number(tm[1]) === this.num && Number(tm[2]) === index && item.status === 1){
                    return true;
                }
            },

            handleRemove(item){
                console.info(item);
                let params = {
                    id: item.id,
                };
                this.$axios.$post('http://192.168.1.70:3000/users/userMessageDelete',params).then(res => {
                    console.info('删除提醒信息-------');
                    console.log(res);
                    this.visible = [];
                    let code = res.code;
                    if(code === 200){
                        this.$Notice.success({
                            title: '删除提醒成功',
                        });
                        this.handleSearchSet();
                    }
                });
            },

            handleSearchSet(){
                let date = new DateTime();
                let params = {
                    userName: sessionStorage.getItem('setLoginText') || '',
                    createTime:date.getDate()
                };
                this.$axios.$post('http://192.168.1.70:3000/users/userMessageInfo',params).then(res => {
                    console.info('获取提醒信息-------');
                    console.log(res);
                    this.remindList = res.list;
                });
            },

            responseMessage(){
                // 注意，这里的端口号要和你socket服务的端口号一致
                let socket = io.connect('http://192.168.1.70:3002');
                socket.on('news',  (data)=> {
                    console.log(data);
                    this.$Notice.success({
                        title: data.msg,
                    });
                    socket.emit('complete', { data: 'success' });
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '~/assets/css/main.scss';
</style>
