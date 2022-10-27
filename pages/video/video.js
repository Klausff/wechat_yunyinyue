// pages/video/video.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoGroupList:[], //导航标签数据
        navId:'', //导航的表示
        videoList:[], //视频列表数据
        videoId:'', // 视频id标识
        videoUpdateTime:[], //记录video播放的时长
        isTriggered:false //下拉刷新是否被触发
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 获取导航数据
        this.getVideoGroupList()
    },
    // 获取导航数据
    async getVideoGroupList(){
        let videoGroupListData = await request('/video/group/list')
        this.setData({
            videoGroupList:videoGroupListData.data.slice(0,14),
            navId:videoGroupListData.data[0].id
        })
        // 获取视频列表数据
        this.getVideoList(this.data.navId)
    },
    // 获取视频列表数据
    async getVideoList(navId){
        let videoListData = await request('/video/group',{id:navId},'GET')
        wx.hideLoading({
          success: (res) => {},
        })
        let videoInfoList=[]
        videoListData.datas.forEach(item=>{
            videoInfoList.push({
                id:item.data.vid,
                title:item.data.title,
                creator:item.data.creator,
                commentCount:item.data.commentCount,
                praisedCount:item.data.praisedCount,
                coverUrl:item.data.coverUrl,
                videoUrl:''
            })
        })
        for (const i of videoInfoList) {
            let result =await request('/video/url',{id:i.id}).then(r =>{
                i.videoUrl = r.urls[0].url
            })
        }
        this.setData({
            videoList:videoInfoList,
            isTriggered:false // 关闭下拉刷新
        })
        wx.hideLoading({
          success: (res) => {},
        })
        // let index=0;
        // let videoList = videoListData.datas.map(item=>{
        //     item.id=index++;
        //     return item;
        // })
        // this.setData({
        //     videoList
        // })
    },
    // 点击切换导航的回调
    changeNav(event){
        let navId = event.currentTarget.id;
        this.setData({
            // 利用event.currentTarget.id获取到的是字符串，所有要*1转为number类型
            navId:navId*1,
            videoList:[]
        })
        // 显示正在加载
        wx.showLoading({
          title: '正在加载',
        })
        // 动态获取当前导航的视频数据
        this.getVideoList(this.data.navId)
    },
    // 点击播放/继续播放的回调
    handlePlay(event){
        // 点击播放之前关闭上一个正在播放的视频
        // 创建控制video标签的实例对象
        let vid = event.currentTarget.id;
        // 关闭上一个播放的视频
        // this.vid!==vid&&this.videoContext&&this.videoContext.stop();
        // if(this.vid!==vid){
        //     if(this.videoContext){
        //         this.videoContext.stop();
        //     }
        // }
        this.vid=vid;
        // 更新data中的videoId的数据
        this.setData({
            videoId:vid
        })
        this.videoContext = wx.createVideoContext(vid);
        // 判断当前的视频之前是否播放过
        let {videoUpdateTime} = this.data;
        let videoItem = videoUpdateTime.find(item=>item.id===vid);
        if(videoItem){
            this.videoContext.seek(videoItem.currentTime)
        }
        this.videoContext.play();
    },
    // 监听视频播放进度的回调
    handleTimeUpdate(event){
        let videoTimeObj = {vid:event.currentTarget.id,currentTime:event.detail.currentTime};
        let {videoUpdateTime} = this.data;
        // 判断videoUpdateTime中是否有当前视频的播放记录 如果有更新播放时间为当前时间，如果没有，需要在数组中添加当前视频的播放对象
        let videoItem = videoUpdateTime.find(item=>item.vid===videoTimeObj.vid);
        if(videoItem){
            videoItem.currentTime=event.detail.currentTime;
        }else{
            videoUpdateTime.push(videoTimeObj);
        }
        this.setData({
            videoUpdateTime
        })
    },
    // 视频播放结束的回调
    handleEnded(event){
        //播放结束移除播放时长数组中的当前视频对象
        let {videoUpdateTime} = this.data;
        videoUpdateTime.splice(videoUpdateTime.findIndex(item=>item.vid===event.currentTarget.id),1);
        this.setData({
            videoUpdateTime
        })
    },
    // 自定义下拉刷新的回调
    handleRefresher(){
        // 再次发请求，获取最新的视频列表数据
        this.getVideoList(this.data.navId);
    },
    // 跳转至搜索界面
    toSearch(){
        wx.navigateTo({
          url: '/pages/search/search',
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