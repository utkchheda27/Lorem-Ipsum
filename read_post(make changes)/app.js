myBlurFunction = function(state) {
    /* state can be 1 or 0 */
    var containerElement = document.getElementById('container');
    var overlayEle = document.getElementById('overlay');

    if (state) {
        var keys = {37: 1, 38: 1, 39: 1, 40: 1};

        function preventDefault(e) {
          e.preventDefault();
        }

         function preventDefaultForScrollKeys(e) {
             if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
             }
          }

        // modern Chrome requires { passive: false } when adding event
        var supportsPassive = false;
          try {
             window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
             get: function () { supportsPassive = true; } 
             }));
          } catch(e) {}

        var wheelOpt = supportsPassive ? { passive: false } : false;
        var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
        overlayEle.style.display = 'block';
        containerElement.setAttribute('class', 'blur');
        
        //disable scrolling when viewing post
        function disableScroll() {
            window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
            window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
            window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
            window.addEventListener('keydown', preventDefaultForScrollKeys, false);
          }
        disableScroll();
    } else {
        overlayEle.style.display = 'none';
        containerElement.setAttribute('class', null);
        function enableScroll() {
            window.removeEventListener('DOMMouseScroll', preventDefault, false);
            window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
            window.removeEventListener('touchmove', preventDefault, wheelOpt);
            window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
          }
        enableScroll();
    }
};

