// pages/songDetail/songDetail.js
import request from '../../utils/request'
import pubsub from 'pubsub-js'
import moment from 'moment'
const appInstance = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay: false, //音乐是否在播放 
        song: {}, // 音乐详情
        musicId:'', //音乐id
        musicSrc:'',// 音乐链接
        type:'next', // 切换歌曲的类型
        currentTime:'00:00', //实时时长
        durationTime:'00:00', //总时长
        currentWidth:0 // 实时进度条长度
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // options用于接收路由跳转传递的参数
        let musicId = options.musicId;
        this.setData({
            musicId
        })
        this.getMusicDetail(musicId)
        // 判断当前页面的音乐是否在播放
        if(appInstance.globalData.isMusicPlay&&appInstance.globalData.musicId===musicId){
            this.setData({
                isPlay:true
            })
        }
        // 监听音乐的播放/暂停/停止
        this.backgroundAudioManager = wx.getBackgroundAudioManager();
        this.backgroundAudioManager.onPlay(()=>{
            this.changePlayState(true);
            // 修改全局音乐播放的状态
            appInstance.globalData.musicId=musicId;
        });
        this.backgroundAudioManager.onPause(()=>{
            this.changePlayState(false);
        });
        this.backgroundAudioManager.onStop(()=>{
            this.changePlayState(false);
        })
        // 监听音乐实时播放进度
        this.backgroundAudioManager.onTimeUpdate(()=>{
            // 格式化实时时间
            let currentTime = moment(this.backgroundAudioManager.currentTime*1000).format('mm:ss');
            // 计算实时进度条长度
            let currentWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration*450
            this.setData({
                currentTime,
                currentWidth
            })
        })
        // 歌曲播放完成后自动切换下一首
        this.backgroundAudioManager.onEnded(()=>{
            let {type} = this.data
            this.handleSwitch(type)
            // 还原新的进度条为0
            this.setData({
                currentTime:'00:00',
                currentWidth:0
            })
        })
    },
    // 修改播放状态的功能函数
    changePlayState(isPlay){
        this.setData({
            isPlay
        })
        // 修改全局音乐播放的状态
        appInstance.globalData.isMusicPlay=isPlay;
    },
    // 获取音乐详情信息功能函数
    async getMusicDetail(musicId) {
        let musicDetaiListData = await request('/song/detail', {ids: musicId})
        let durationTime = moment(musicDetaiListData.songs[0].dt).format('mm:ss')
        this.setData({
            song: musicDetaiListData.songs[0],
            durationTime
        })
        // 动态修改窗口标题
        wx.setNavigationBarTitle({
            title: this.data.song.name
        })
    },
    // 点击播放/暂停的回调
    handleMusicPlay() {
        let isPlay = !this.data.isPlay;
        // this.setData({
        //     isPlay
        // })
        let {musicId,musicSrc} = this.data
        this.musicControl(isPlay,musicId,musicSrc)
    },
    // 控制音乐播放/暂停的功能函数
    async musicControl(isPlay,musicId,musicSrc) {
        // 获取音乐播放地址
        if(isPlay){
            // 判断是否已经得到该歌曲的数据，避免重复发同一个请求
            if(!musicSrc){
                let src = await request(`/song/url/v1?id=${musicId}&level=lossless`)
                musicSrc = src.data[0].url;
                this.setData({
                    musicSrc
                })
            }
            this.backgroundAudioManager.title= this.data.song.name;
            this.backgroundAudioManager.src= musicSrc;
        }else{
            this.backgroundAudioManager.pause();
        }
    },
    // 点击切换歌曲的回调
    handleSwitch(type){
        // 切换前，关闭当前音乐
        this.backgroundAudioManager.stop();
        // 订阅来自recommendSong页面发布的musicId消息
        pubsub.subscribe('musicId',(msg,musicId)=>{
            // 获取切换后的音乐信息
            this.getMusicDetail(musicId);
            this.musicControl(true,musicId)
            // 取消订阅
            pubsub.unsubscribe('musicId');
        })
        // 发布消息到recommendSong页面
        pubsub.publish('switchType',type)
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})