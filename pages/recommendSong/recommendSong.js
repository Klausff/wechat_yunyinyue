import request from '../../utils/request'
import pubsub from 'pubsub-js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        day:'', // 日
        month:'', // 月
        recommendSongsList:[] //每日推荐歌曲数据
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 判断用户是否登录
        let useInfo = wx.getStorageSync('userInfo');
        if(!useInfo){
            wx.showToast({
              title: '请先登录',
              icon:'none',
              success:()=>{
                  // 跳转至登录界面
                  wx.reLaunch({
                    url: '/pages/login/login',
                  })
              }
            })
        }
        this.setData({
            day:new Date().getDate(),
            month: new Date().getMonth()+1
        })
        //获取每日推荐歌曲数据
        this.getRecommendSongsList();
    },
    //获取每日推荐歌曲数据
    async getRecommendSongsList(){
        let recommendSongsListData = await request('/recommend/songs')
        let index=0;
        let recommendSongsList=recommendSongsListData.data.dailySongs.map(item=>{
            item.id=index++;
            return item;
        })
        this.setData({
            recommendSongsList
        })
    },
    // 跳转至songDetail页面
    toSOngDetail(event){
        let song = event.currentTarget.dataset.song;
        //路由跳转传参
        wx.navigateTo({
          url: '/pages/songDetail/songDetail?musicId='+song.privilege.id
        })
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