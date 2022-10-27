// pages/search/search.js
import request from '../../utils/request'
let isSend = false;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        keyWord: '', // 默认搜索关键字
        hotList: [], // 热搜列表
        searchWord: '', //搜索词
        searchList: [], //搜索列表
        historyList: [] //历史搜索
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 获取默认关键字
        this.getKeyWord();
        // 获取热搜列表
        this.getHostList();
        // 获取历史记录
        this.getSEarchHistory();
    },
    // 获取默认搜索关键字的回调
    async getKeyWord() {
        let keyWordData = await request('/search/default')
        this.setData({
            keyWord: keyWordData.data.showKeyword
        })
    },
    // 获取热搜列表的回调
    async getHostList() {
        let hotListData = await request('/search/hot/detail');
        this.setData({
            hotList: hotListData.data
        })
    },
    // 表单内容发生改变的回调
    handleInput(event) {
        this.setData({
            searchWord: event.detail.value.trim(),
        })
        // 函数节流(首先判断isSend是否为true，为true则说明已经发过请求直接返回，为false则将isSed置为true然后开启定时器发请求，300ms后将isSend置为false，就可以重新再次发请求)
        if (isSend) {
            return
        }
        isSend = true;
        this.getSearchList();
        setTimeout(() => {
            isSend = false;
        }, 300);
    },
    //获取搜索数据的功能函数
    async getSearchList() {
        if (!this.data.searchWord) {
            this.setData({
                searchList: []
            })
            return
        }
        let {
            searchWord,
            historyList
        } = this.data
        // 发请求获取模糊关键字匹配数据
        let searchListData = await request('/cloudsearch', {
            keywords: searchWord,
            limit: 10
        })
        this.setData({
            searchList: searchListData.result.songs
        })
        // 将搜索历史关键字添加到历史记录中
        if (historyList.indexOf(searchWord) !== -1) {
            historyList.splice(historyList.indexOf(searchWord), 1);
        }
        historyList.unshift(searchWord);
        this.setData({
            historyList
        })
        // 将历史记录存储到本地
        wx.setStorageSync('searchHistory', historyList)
    },
    // 获取本地历史记录的功能函数
    getSEarchHistory() {
        let history = wx.getStorageSync('searchHistory')
        if (history) {
            this.setData({
                historyList: history
            })
        }
    },
    // 清空搜索内容
    clearSearchWord() {
        this.setData({
            searchWord: '',
            searchList: []
        })
        this.getSearchList();
    },
    // 清空搜索历史记录
    deleteSearchHistory() {

        wx.showModal({
            content: '确认删除吗？',
            success: (res) => {
                if (res.confirm) {
                    //清空data中的historyList
                    this.setData({
                        historyList: []
                    })
                    //移除本地的历史记录缓存
                    wx.removeStorageSync('searchHistory')
                }
            }
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