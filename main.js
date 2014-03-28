var cocos2dApp = cc.Application.extend({
    config: document[ 'ccConfig' ],

    ctor: function( scene ) {
        this._super();
        this.startScene = scene;
        cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
        cc.initDebugSetting();
        cc.setup( this.config[ 'tag' ] );
        cc.AppController.shareAppController().didFinishLaunchingWithOptions();

        createjs.Sound.registerSound("musics/roar-katyperry.mp3", "music1");
        createjs.Sound.registerSound("musics/whenyousaynothingatall-ronankeating.mp3", "music2");
    },

    applicationDidFinishLaunching: function() {
        // initialize director
        var director = cc.Director.getInstance();

        //cc.EGLView.getInstance()._adjustSizeToBrowser();

        // turn on display FPS
        director.setDisplayStats( this.config[ 'showFPS' ] );

        // set FPS. the default value is 1.0/60 if you don't call this
        director.setAnimationInterval( 1.0 / this.config[ 'frameRate' ] );

        cc.LoaderScene.preload( this.config.resourceFiles , function(){
            director.replaceScene( new this.startScene() );
        } , this );

        return true;
    }
});

// monkey patching cocos audio engine to pause soundjs
(function(){

    var origPlay = createjs.Sound.play;
    var soundList = [];
    createjs.Sound.play = function(){
        var sound = origPlay.apply(null, arguments);
        soundList.push(sound);
        return sound;
    };
    var origPauseMusic = cc.AudioEngine.getInstance().pauseMusic;
    cc.AudioEngine.getInstance().pauseMusic = function(){
        origPauseMusic.apply(cc.AudioEngine.getInstance());
        soundList.forEach(function(sound){
            sound.pause();
        });
    };
    var origResumeMusic = cc.AudioEngine.getInstance().resumeMusic;
    cc.AudioEngine.getInstance().resumeMusic = function(){
        origResumeMusic.apply(cc.AudioEngine.getInstance());
        soundList.forEach(function(sound){
            sound.resume();
        });
    };

})();

var myApp = new cocos2dApp( StartScene );
