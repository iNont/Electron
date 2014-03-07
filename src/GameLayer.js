var screenWidth = 2014;
var screenHeight = 1536;

var GameLayer = cc.LayerColor.extend({
    
    init: function() {
        this._super( new cc.Color4B( 127, 127, 127, 255 ) );
        this.setPosition( new cc.Point( 0, 0 ) );

        this.bg = new BG();
        this.bg.setScale( 1 );
        this.bg.setPosition( new cc.Point( screenWidth/2, screenHeight/2 ) );
        this.addChild( this.bg );

        this.player = new Player();
        this.player.setScale( 1 );
        this.player.setPosition( GameLayer.PLAYER_POS );
        this.addChild( this.player );

        this.state = GameLayer.STATES.FRONT;
        this.setKeyboardEnabled( true );
        this.scheduleUpdate();
        this.startGame();
        return true;
    },
    startGame: function() {
        this.units = [];
        var timePerGap = GameLayer.UNIT_GAP*GameLayer.timePerPixel;
        var gapForStart = GameLayer.UNIT_GAP-320;
        var timeForStart = gapForStart*GameLayer.timePerPixel;
        for(var i=0; i<GameLayer.UNIT_NUMBER ;i++)
        {
            var unit = new Unit( this );
            this.units.push( unit );
            this.units[i].setPosition( new cc.Point( -screenWidth/4-i*GameLayer.UNIT_GAP-gapForStart, screenHeight/2));
            this.addChild( this.units[i] );
            var pos = this.units[i].getPosition();
            var endPos = new cc.Point( 2*screenWidth , pos.y );
            this.units[i].endPos = endPos;
            var moveAction = cc.MoveTo.create( GameLayer.UNIT_VELOCITY+timePerGap*i+timeForStart, this.units[i].endPos );
            this.units[i].runAction( moveAction );
        }
    },
    randomNumber: function( min,max ) {
        return Math.random()*(max-min)+min;
    },
    reverseMode: function( bool ){
        for(var i=0; i<GameLayer.UNIT_NUMBER ;i++) {
            if(i%2==0)
                this.units[i].isReverse = bool;
        }
    },
    turnLeft: function( bool ) {
        for(var i=0; i<GameLayer.UNIT_NUMBER ;i++) {
            this.units[i].keyLeft = bool;
        }
    },
    turnRight: function( bool ) {
        for(var i=0; i<GameLayer.UNIT_NUMBER ;i++) {
            this.units[i].keyRight = bool;
        }
    },
    onKeyDown: function( e ) {
        //37 = Left , 39 = Right , 32 = Space , 27 = Escape
        if( e==37 )
            this.turnLeft( true );
        else if( e==39 )
            this.turnRight( true );
        /*To Test reverseMode*/
        else if( e==32 ) 
            this.reverseMode( true );
        /**/
    },
    onKeyUp: function( e ) {
        //37 = Left , 39 = Right , 32 = Space , 27 = Escape
        if( e==37 )
            this.turnLeft( false );
        else if( e==39 )
            this.turnRight( false );
        /*To Test reverseMode*/
        else if( e==32 ) 
            this.reverseMode( false );
        /**/
    },
    update: function(dt) {
        
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
    DEAD: 3
};
GameLayer.TURN = {
    STOP: 0,
    LEFT: 1,
    RIGHT: 2
}
GameLayer.PLAYER_POS = new cc.Point( 3*screenWidth/4, screenHeight/2 );
GameLayer.UNIT_NUMBER = 5;
GameLayer.UNIT_GAP = (2*screenWidth)/GameLayer.UNIT_NUMBER;
GameLayer.UNIT_VELOCITY = 7; //sec in one round
GameLayer.UNIT_TURN_SPEED = 4;
GameLayer.timePerPixel = (GameLayer.UNIT_VELOCITY/(2*screenWidth));

