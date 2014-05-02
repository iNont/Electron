var gameScale = 0.5;
var screenWidth = 2048*gameScale;
var screenHeight = 1536*gameScale;

var GameLayer = cc.LayerColor.extend({
    
    init: function() {
        this._super( new cc.Color4B( 0,0,0,255 ) );
        this.setPosition( new cc.Point( 0,0 ) );
        this.bg = new BG();
        this.addChild( this.bg );
        this.addAllLayers();
        this.frontLayer.startIntro();
        this.state = GameLayer.STATES.FRONT;
        this.setKeyboardEnabled( true );
        this.scheduleUpdate();
        return true;
    },
    addAllLayers: function() {
        this.frontLayer = new FrontLayer( this );
        this.addChild( this.frontLayer );

        this.mainMenuLayer = new MainMenuLayer( this );
        this.addChild( this.mainMenuLayer );

        this.playingLayer = new PlayingLayer( this );
        this.addChild( this.playingLayer );
    },
    onKeyDown: function( e ) {
        //37 = Left , 39 = Right , 32 = Space , 27 = Escape
        if( this.state==GameLayer.STATES.STARTED )
            this.playingLayer.onKeyDown( e );
        else if( this.state==GameLayer.STATES.MAINMENU )
            this.mainMenuLayer.onKeyDown( e );
        else if( this.state==GameLayer.STATES.FRONT )
            this.frontLayer.onKeyDown( e );
    },
    onKeyUp: function( e ) {
        //37 = Left , 39 = Right , 32 = Space , 27 = Escape
        if( this.state==GameLayer.STATES.STARTED ) 
            this.playingLayer.onKeyUp( e );
    }
});

var StartScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new GameLayer();
        layer.init();
        this.setScale( 1 );
        this.addChild( layer );
    }
});

GameLayer.STATES = {
    FRONT: 1,
    STARTED: 2,
    MAINMENU: 3
};
GameLayer.PLAYER_POS = new cc.Point( 3*screenWidth/4, screenHeight/2 );
GameLayer.UNIT_NUMBER = 6;
GameLayer.UNIT_GAP = (2*screenWidth)/GameLayer.UNIT_NUMBER;
GameLayer.UNIT_VELOCITY = 5.2; //sec in one round
GameLayer.UNIT_TURN_SPEED = 45; //normal 4
GameLayer.timePerPixel = (GameLayer.UNIT_VELOCITY/(2*screenWidth));
GameLayer.UNIT_DIAMETER = 320*gameScale;
GameLayer.UNIT_BORDER_SIZE = 15*gameScale;
GameLayer.PLAYER_SCALE = 0.75;
GameLayer.PLAYER_DIAMETER = 71*gameScale*GameLayer.PLAYER_SCALE;
GameLayer.SCORE_PER_UNIT = 600;
GameLayer.SCORE_PER_COMBO = 10;
GameLayer.SCORE_UPDATE_SPEED = 40;
GameLayer.COMBO_TIME_CHANGE_SPEED = 0.02;
GameLayer.BUTTON_NUMBER = {
    MAINMENU: 4
};
GameLayer.FONT_SIZE = {
    SCORE: 90*gameScale,
    MAX_COMBO: 30*gameScale,
    CURRENT_COMBO: 100*gameScale
};
GameLayer.FONT = "Lucida Grande";