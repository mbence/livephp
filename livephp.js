/**
 * Live.php 
 * @author Bence Meszaros
 * @link http://bencemeszaros.com
 * @link http://wordpress.org/extend/plugins/wp-livephp/
 * @version 1.4
 */

var LivePhp = {

    interval: 1000,
    url: '',
    start: 0,

    /** Initializes the start time and the query cicle */
    init: function() {
        // get the url for our php script (which is just beside this js file)
        LivePhp.url = LivePhp.scriptSource().replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '') + '/livephp-monitor.php';
        
        if (0 === LivePhp.start) {
            LivePhp.start = new Date() * 1;
            setTimeout(LivePhp.heartbeat, LivePhp.interval);
        }
    },

    scriptSource  : function(scripts) {
        var scripts = document.getElementsByTagName('script'),
            script = scripts[scripts.length - 1];

        if (script.getAttribute.length !== undefined) {
            return script.src
        }

        return script.getAttribute('src', -1);
    },

    /** performs a cycle per interval */
    heartbeat: function() {
        if (document.body) {
            LivePhp.ask(LivePhp.start);
        }
    },

    /** Queries the server for changes, and reloads the page on positive answer */
    ask: function(start) {
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XmlHttp");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                if (xhr.responseText == 1) {
                    location.reload();
                }
                else {
                    setTimeout(LivePhp.heartbeat, LivePhp.interval);
                }
            }
        }
        xhr.open("GET", LivePhp.url + '?s=' + start, true);
        xhr.send();
    }

}

LivePhp.init();