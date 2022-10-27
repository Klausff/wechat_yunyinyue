import request from '../../utils/request'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[], //轮播图数据
    recommendList:[], //推荐歌曲
    topList:[] //排行榜数据
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //   获取轮播图数据
    let bannerListData = await request('/banner',{type:2})
    this.setData({
        bannerList:bannerListData.banners
    })
    //  获取推荐歌单数据
    let recommendListData = await request('/personalized',{limit:10})
    this.setData({
        recommendList:recommendListData.result
    })
    // 获取排行榜数据
    let topListData = await request('/toplist')
    let topList = topListData.list.slice(0,4)
    let topListDetail=[]
    for(let item of topList){
        let detaiList = await request(`/playlist/detail?id=${item.id}`,{limit:10})
        topListDetail.push({name:detaiList.playlist.name,tracks:detaiList.playlist.tracks.slice(0,3)})
        this.setData({
            topList:topListDetail
        })
    }
  },
  // 跳转至每日推荐页面
  toRecommendSong(){
      wx.navigateTo({
        url: '/pages/recommendSong/recommendSong',
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }
})