// ==UserScript==
// @name                 Make HamiVideo Better
// @description          Make your player in HamiVideo better
// @description:zh-TW    讓 HamiVideo 的播放器好用點
// @version              1.1.0
// @author               Mingc
// @match                https://hamivideo.hinet.net/play/*
// @match                https://hamivideo.hinet.net/trailer/*
// @grant                unsafeWindow
// @icon                 https://hamivideo.hinet.net/hamivideo/favicon_hamivideo_new.ico
// @namespace            https://github.com/mingc00
// @run-at               document-end
// ==/UserScript==

function wrap(originalFn, postFn) {
  return function (...args) {
    const returnValue = originalFn(...args);
    postFn();
    return returnValue;
  };
}
// remove rating warning
unsafeWindow.myPlayer.rating = 0;
// resize to fullscreen
function resize() {
  if (myPlayer.video) {
    myPlayer.video.style.height = "100vh";
  }
  if (myPlayer.h5Player) {
    const h5PlayerEl = myPlayer.h5Player.el();
    h5PlayerEl.style.height = "100vh";
  }
}
unsafeWindow._playerSizeChange = resize;
unsafeWindow.myPlayer.startPlay = wrap(unsafeWindow.myPlayer.startPlay, resize);
// set chromecast button auto-hide
function setChromecastVisible(visible) {
  document.querySelector(".chromecast").style.display = visible
    ? "block"
    : "none";
}
unsafeWindow.showTitle = wrap(unsafeWindow.showTitle, function () {
  setChromecastVisible(true);
});
unsafeWindow.hideTitle = wrap(unsafeWindow.hideTitle, function () {
  setChromecastVisible(false);
});
// adjust toolbar position
const toolbarEl = document.querySelector(".toolbar");
toolbarEl.style.bottom = "40px";
toolbarEl.style.left = "20px";
// remove dot on progress bar
const style = document.createElement("style");
style.innerHTML = `
  .video-js .vjs-slider-bar::before,
  .video-js .vjs-volume-level::before {
    content: "" !important;
  }
  .video-js .vjs-play-progress {
    background-color: #bf3b4d !important;
  }
`;
document.head.appendChild(style);

// enable hotkey
videojs.hook("beforesetup", function (_videoEl, options) {
  return {
    ...options,
    userActions: {
      hotkeys: true,
    },
  };
});
