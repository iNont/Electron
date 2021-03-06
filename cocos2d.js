(function() {
    var d = document;
    var c = {
        COCOS2D_DEBUG: 1, //0 to turn debug off, 1 for basic debug, and 2 for full debug
        box2d: false,
        chipmunk: false,
        showFPS: false,
        loadExtension: false,
        frameRate: 60,
        renderMode: 1,       //Choose of RenderMode: 0(default), 1(Canvas only), 2(WebGL only)
        tag: 'gameCanvas', //the dom element to run cocos2d on
        engineDir: 'cocos2d/',
        //SingleEngineFile:'',
        appFiles:[
            'src/BG.js',
            'src/MainMenuButton.js',
            'src/IntroLogo.js',
            'src/CrashEffect.js',
            'src/CrashText.js',
            'src/Player.js',
            'src/Unit.js',
            'src/FrontLayer.js',
            'src/MainMenuLayer.js',
            'src/PlayingLayer.js',
            'src/WaitingGameLayer.js',
            'src/BattleItems.js',
            'src/ImageShow.js',
            'src/TextField.js',
            'src/GameLayer.js',     //add your own files in order here
            'src/socket.io.js'
        ],
        resourceFiles: [
            {src: 'images/ingameBG.png'},
            {src: 'images/mute.png'},
            {src: 'images/mys.png'},
            {src: 'images/pause.png'},
            {src: 'images/Player.png'},
            {src: 'images/unit.png'},
            {src: 'images/perfectEffect.png'},
            {src: 'images/greatEffect.png'},
            {src: 'images/coolEffect.png'},
            {src: 'images/perfectText.png'},
            {src: 'images/missEffect.png'},
            {src: 'images/greatText.png'},
            {src: 'images/coolText.png'},
            {src: 'images/missText.png'},
            {src: 'images/intro/o.png'},
            {src: 'images/intro/logo.png'},
            {src: 'images/intro/spikeTop.png'},
            {src: 'images/intro/spikeBot.png'},
            {src: 'images/intro/button1.png'},
            {src: 'images/intro/button2.png'},
            {src: 'images/intro/button3.png'},
            {src: 'images/intro/button4.png'},
            {src: 'images/intro/pressAnyKey.png'},
            {src: 'images/powerGrid.png'},
            {src: 'images/powerBar.png'},
            {src: 'images/BI0.png'},
            {src: 'images/instruction.png'},
            {src: 'images/findMatch.png'},
            {src: 'images/loading.png'},
            {src: 'images/textBox.png'},
            {src: 'musics/ifineverseeyourfaceagain-maroon5.mp3'},
        ]
    };

    if ( !d.createElement( 'canvas' ).getContext ) {
        var s = d.createElement( 'div' );
        s.innerHTML = '<h2>Your browser does not support HTML5 canvas!</h2>' +
            '<p>Google Chrome is a browser that combines a minimal design with sophisticated technology to make the web faster, safer, and easier.Click the logo to download.</p>' +
            '<a href="http://www.google.com/chrome" target="_blank"><img src="http://www.google.com/intl/zh-CN/chrome/assets/common/images/chrome_logo_2x.png" border="0"/></a>';
        var p = d.getElementById( c.tag ).parentNode;
        p.style.background = 'none';
        p.style.border = 'none';
        p.insertBefore( s, d.getElementById( c.tag ) );

        d.body.style.background = '#ffffff';
        return;
    }

    window.addEventListener( 'DOMContentLoaded', function() {
        this.removeEventListener( 'DOMContentLoaded', arguments.callee, false );
        //first load engine file if specified
        var s = d.createElement( 'script' );
        /*********Delete this section if you have packed all files into one*******/
	if ( c.SingleEngineFile && !c.engineDir ) {
            s.src = c.SingleEngineFile;
        } else if ( c.engineDir && !c.SingleEngineFile ) {
            s.src = c.engineDir + 'jsloader.js';
        } else {
            alert('You must specify either the single engine file OR the engine directory in "cocos2d.js"');
        }
        /*********Delete this section if you have packed all files into one*******/

        //s.src = 'myTemplate.js'; //IMPORTANT: Un-comment this line if you have packed all files into one

        d.body.appendChild( s );
        document.ccConfig = c;
        s.id = 'cocos2d-html5';
        //else if single file specified, load singlefile
    });
})();
