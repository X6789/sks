var Inject = (function () {
    var _this = {};
    _this.init = function () {
        var nodes = document.getElementById('J_prismPlayer').childNodes
        var video = nodes[0]

        if (video.paused) {
            video.play()
        }

        video.addEventListener('play', function() {
            tell('P', '视频开始播放');
        })
        
        video.addEventListener('pause', function() {
            // tell('S', '视频播放暂停，请处理');
        })
        
        video.addEventListener('ended', function() {
            tell('D', '视频播放结束，3秒后自动播放下一章节');
            var nextDom = document.getElementsByClassName('next_button___YGZWZ');
            nextDom[0].click()
            setTimeout(() => {
                nodes = document.getElementById('J_prismPlayer').childNodes
                nodes[0].play()
            }, 3000);
        })
        
        video.addEventListener('error', function() {
            tell('E', '视频播放出错，自动处理');
            location.reload();
            setTimeout(() => {
                nodes = document.getElementById('J_prismPlayer').childNodes
                nodes[0].play()
            }, 3000);
        })
        
        window.onhashchange = function () {
            tell('N', '切换新章节，3秒后自动播放..')
            
            setTimeout(() => {
                video.play()
            }, 3000);
        }
    };

    function tell (tip, msg) {
        var msg = msg || {};
        chrome.extension.sendRequest({
            tip: tip,
            msg: msg
        });
    };

    return _this;
}());

window.addEventListener("load", function () {
    setTimeout(() => {
        Inject.init();
    }, 5000);
    
}, false);