var Background = (function () {
    var _this = {};
    var _jxdTab;
    var _filter = {
        urls: [
            'https://www.bjjnts.cn/*',
            'https://apif.bjjnts.cn/supervises/code',
            'https://static.zpimg.cn/master/pc/static_00010/static/portrait.b5809123.png'
        ]
    };

    _this.init = function () {
        chrome.extension.onRequest.addListener(onPostMessage);
        chrome.browserAction.onClicked.addListener(onIconClicked);
        chrome.webRequest.onBeforeRequest.addListener(interceptor, _filter, ["blocking"]);
    }

    function interceptor (details) {
        if (details.initiator == 'https://www.bjjnts.cn') {
            _jxdTab = details.tabId

            if (details.url == 'https://apif.bjjnts.cn/supervises/code') {
                notify('V','视频已暂停，需要输入验证码!');
            }

            if (details.url == 'https://static.zpimg.cn/master/pc/static_00010/static/portrait.b5809123.png') {
                notify('F','视频已暂停，需要人脸识别验证!');
            }
        }
    }

    function onPostMessage (request, sender, sendResponse) {
        notify(request.tip,request.msg)
    };

    //图标点击事件监听
    function onIconClicked (tab) {
        resetBadge();
        chrome.tabs.update(_jxdTab, {active: true});
    }

    //将msg数据以桌面通知的方式显示给用户
    function notify (tip, msg) {
        if (tip == 'P' || tip == 'N' || tip == 'D') {
            resetBadge ()
        }else{
            chrome.browserAction.setIcon({
                path: "../images/tv_lock.png"
            });
            chrome.browserAction.setBadgeText({text: tip});
            chrome.browserAction.setBadgeBackgroundColor({ color: [25, 135, 0, 250] });
        }
        
        //弹出通知框
        chrome.notifications.create('', {
            type: 'basic',
            iconUrl:'../images/notify.png',
            title: '京训钉',
            message: msg,
        }, function (id) {
            setTimeout(function(){
                chrome.notifications.clear(id, function(){});
            }, 2000);
        });
    }

    
    function resetBadge () {
        chrome.browserAction.setIcon({
            path: "../images/tv.png"
        });
        chrome.browserAction.setBadgeText({text:null});
        chrome.browserAction.setBadgeBackgroundColor({color:[0,0,0,0]});
    }

    return _this;
}());

window.addEventListener("load", function () {
    Background.init();
}, false);