/*请提前引入jquery*/
var Page = function (option) {
    console.log('auto');
    var win = $(window)
    var winW = win.width()
    var winH = win.height()
    var container = $('.pageContainer')
    var page = $('.page')
    this.win = win
    this.winW = winW
    this.winH = winH
    this.container = container
    this.page = page
    /*传入参数*/
    this.designW = option.width               //设计稿宽度
    this.designH = option.height              //设计稿高度
    this.fitMode = option.fitMode || 'auto'   //采用的适配方案, 为contain和cover
    this.slideMode = option.slideMode || 'Y'  //采用的滑动方向, 为X轴和Y轴
    this.onPageChangedStart = option.onPageChangedStart || null //下一页刚进入的回调函数
    this.onPageChangedEnd = option.onPageChangedEnd || null //下一页完全进入的回调函数
    this.audio = option.audio
    /*固定参数*/
    this.index = 0      //当前的页码
    this.maxIndex = page.length   //最大的页码
    this.touch = {
        userlock: false,  //用户打开关闭的锁
        min: 50, //最小滑动的距离
        sx: 0,
        sy: 0,
        cx: 0,
        cy: 0,
        ex: [0, this.winW],  //滑动限定的X范围
        ey: [0, this.winH],  //滑动限定的Y范围
        elock: true,
        dir: 1   //1为下一页,-1为上一页
    }
    /*初始化模版*/
    this.init()
    /*预加载*/
    this.preload(option.preload)
    /*添加手势操作*/
    this.touchEvent()
}
Page.prototype.init = function () {
    var winW = this.winW
    var winH = this.winH
    var designW = this.designW
    var designH = this.designH
    var winScale = winW / winH
    var designScale = designW / designH
    var origin = '50% 50% 0'
    var initialScale = 0
    var page = this.container
    var maxIndex = this.maxIndex
    var fitMode = this.fitMode
    if (fitMode === 'auto') {

        page.css({
            'width': winW,
            'height': winH
        })
    } else if (fitMode === 'contain') {
        if ( winScale > designScale) {
            initialScale = winH / designH
        } else {
            initialScale = winW / designW
        }
        page.css({
            'width': designW,
            'height': designH,
            '-webkit-transform': 'scale(' + initialScale + ')',
            'transform': 'scale(' + initialScale + ')',
            '-webkit-transform-origin': origin,
            'transform-origin': origin,
            'left': (designW - winW) / -2 + 'px',
            'top': (designH - winH) / -2 + 'px',
        })
    } else if (fitMode === 'cover') {
        if ( winScale > designScale) {
            initialScale = winW / designW
        } else {
            initialScale = winH / designH
        }
        pageC.css({
            'width': designW,
            'height': designH,
            '-webkit-transform': 'scale(' + initialScale + ')',
            'transform': 'scale(' + initialScale + ')',
            '-webkit-transform-origin': origin,
            'transform-origin': origin,
            'left': (designW - winW) / -2 + 'px',
            'top': (designH - winH) / -2 + 'px',
        })
    }
    this.onPageChangedEnd(this, this.index)
    this.nextPageInit()
}
Page.prototype.preload = function (option) {
    var preload = $('.preload')
    var max = this.max = preload.length
    var tag = null
    var src = null
    var onstart = option.onStart || null
    this.preloadIndex = 0
    if (onstart) {
        this.preloadOnstart(onstart)
    }
    this.onprogress = option.onProgress
    this.onend = option.onEnd
    for (var i = 0; i < max; i++) {
        tag =  preload.eq(i)
        src = tag.attr('data-src')
        this.preloadCreatResource(tag, src)
    }
}
Page.prototype.preloadCreatResource = function (dom, src) {
    var self = this
    var max = this.max
    var onProgress = this.onprogress
    var onEnd = this.onend
    var targetNode = dom[0].nodeName
    if (targetNode.toUpperCase() === 'AUDIO') {
        this.music(function () {
            if (self.preloadIndex + 1 == max) {
                onEnd(self)
            } else {
                onProgress(self.preloadIndex, max)
            }
        })
    } else {
        var img = new Image()
        img.src = src
        img.onload = function () {
            self.preloadIndex ++
            dom.attr('src', src)
            if (self.preloadIndex + 1 == max) {
                onEnd(self)
            } else {
                onProgress(self.preloadIndex, max)
            }
        }
        img.onerror = function () {
            console.log(src + '该资源加载出错')
        }
    }

}
Page.prototype.preloadOnstart = function (callback) {
    if(callback) callback()
}
Page.prototype.touchEvent = function () {
    var self = this
    var body = $('body')
    var touch = this.touch
    if (this.slideMode === 'Y') {
        body.on('touchstart', function (event) {
            touch.sx = event.touches[0].clientX
            touch.sy = event.touches[0].clientY
            if (touch.sx >= touch.ex[0] && touch.sy >= touch.ey[0] && touch.sx <= touch.ex[1] && touch.sy <= touch.ey[1]) {
                touch.elock = true
            } else {
                touch.elock = flase
            }
        })
        body.on('touchmove', function (event) {
            touch.cx = event.changedTouches[0].clientX
            touch.cy = event.changedTouches[0].clientY
        })
        body.on('touchend', function (event) {
            touch.cx = event.changedTouches[0].clientX
            touch.cy = event.changedTouches[0].clientY
            /*上滑*/
            if (touch.sy - touch.cy > touch.min && touch.userlock && touch.elock) {
                touch.userlock = false
                touch.dir = 1
                self.pageTurn()
                setTimeout(function () {
                    touch.userlock = true
                }, 300)
            } else if (touch.cy - touch.sy > touch.min && touch.userlock && touch.elock){
                touch.userlock = false
                touch.dir = -1
                self.pageTurn()
                setTimeout(function () {
                    touch.userlock = true
                }, 300)
            }
        })
    }
}
Page.prototype.pageTurn = function () {
    var index = this.index
    var max = this.maxIndex
    var dir = this.touch.dir
    if ( (index >= max-1 && dir > 0 ) || (index <= 1 && dir < 0)) {
        return
    }
    var self = this
    var next = dir > 0 ? ++this.index : --this.index
    var page = this.page
    var onPageChangedEnd = this.onPageChangedEnd
    var onPageChangedStart = this.onPageChangedStart
    var winH = this.winH
    page.eq(index).removeClass('page-hidden')
    page.eq(next).addClass('page-active')
    page.eq(next).css({
        'transition': 'all .4s linear',
        '-webkit-transition': 'all .4s linear',
        'transform':'translate3d(0, 0, 0)',
        '-webkit-transform':'translate3d(0, 0, 0)'
    })
    page[next].addEventListener('transitionend', callback)
    page[next].addEventListener('webkitTransitionEnd', callback)
    function callback (e) {
        page.eq(index).css({
            'transition': 'none',
            '-webkit-transition': 'none',
            'transform':'translate3d(0, -' + winH * dir + 'px, 0)',
            '-webkit-transform':'translate3d(0, -' + winH * dir + 'px, 0)'
        })
        page.eq(index).addClass('page-hidden')
        page[next].removeEventListener('transitionend', callback)
        page[next].removeEventListener('webkitTransitionEnd', callback)
        page.eq(next).addClass('page-show')
        page.eq(next).removeClass('page-active')
        self.nextPageInit()
        if(onPageChangedEnd && page[next] === e.target) onPageChangedEnd(self, next)
    }
}
Page.prototype.nextPageInit = function () {
    var dir = this.touch.dir
    var index = this.index + 1
    var page = this.page
    var winH = this.winH
    dir > 0 && page.eq(index).addClass('page-active')
    dir < 0 && page.eq(index).removeClass('page-active')
    page.eq(index).css({
        'transition': 'none',
        '-webkit-transition': 'none',
        'transform': 'translate3d(0, ' + winH + 'px, 0)',
        '-webkit-transform': 'translate3d(0,' + winH + 'px, 0)'
    })
}
Page.prototype.run = function () {
    this.touch.userlock = true
}
Page.prototype.music = function (callback) {
    var self = this
    var audio = this.audio
    audio.addEventListener('canplay', function(){
    }, false)
    audio.addEventListener('loadedmetadata', function(){
        self.preloadIndex++
        callback()
    }, false)
}