import request from '../../utils/request'
let startY = 0;
let moveY = 0;
let moveDistance = 0;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        coverTransform: 'translateY(0)',
        coverTransition: '',
        userInfo: {}, // 用户信息
        recentPlayList: [] //最近播放记录
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 读取本地存储的用户信息
        let userInfo = wx.getStorageSync('userInfo')
        if (userInfo) {
            this.setData({
                userInfo: JSON.parse(userInfo)
            })
            // 获取用户最近播放记录
            this.getUserRecentPlayList()
        }
        
    },
    // 获取用户播放记录的功能函数
    async getUserRecentPlayList(){
        let index=0;
        let recentPlayListData = await request('/record/recent/song',{limit:10})
        let recentPlayList = recentPlayListData.data.list.map(item=>{
            item.id=index++;
            return item;
        })
        this.setData({
            recentPlayList
        })
    },
    // 获取起始坐标
    handleTouchStart(event) {
        this.setData({
            coverTransition: ''
        })
        startY = event.touches[0].clientY;
    },
    // 获取移动距离
    handleTouchMove(event) {
        moveY = event.touches[0].clientY;
        moveDistance = moveY - startY;
        if (moveDistance <= 0) {
            return;
        }
        if (moveDistance >= 80) {
            moveDistance = 80;
        }
        this.setData({
            coverTransform: `translateY(${moveDistance}rpx)`
        })
    },
    // 回弹的回调
    handleTouchEnd() {
        this.setData({
            coverTransform: `translateY(0rpx)`,
            coverTransition: 'transform 1s linear'
        })
    },
    toLogin() {
        wx.navigateTo({
            url: '/pages/login/login',
            success: (result) => {},
            fail: (res) => {},
            complete: (res) => {},
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