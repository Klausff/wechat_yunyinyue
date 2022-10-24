// pages/songDetail/songDetail.js
import request from '../../utils/request'
import pubsub from 'pubsub-js'
const appInstance = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay: false, //音乐是否在播放 
        song: {}, // 音乐详情
        musicId:'' //音乐id
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
        let musicDetaiListData = await request('/song/detail', {
            ids: musicId
        })
        this.setData({
            song: musicDetaiListData.songs[0]
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
        let {musicId} = this.data
        this.musicControl(isPlay,musicId)
    },
    // 控制音乐播放/暂停的功能函数
    async musicControl(isPlay,musicId) {
        // 获取音乐播放地址
        let src = await request(`/song/url/v1?id=${musicId}&level=lossless`)
        let musicSrc = src.data[0].url;
        if(isPlay){
            this.backgroundAudioManager.title= this.data.song.name;
            this.backgroundAudioManager.src= musicSrc;
        }else{
            this.backgroundAudioManager.pause();
        }
    },
    // 切换歌曲的回调
    handleSwitch(event){
        let type = event.currentTarget.id;
        console.log(type)
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