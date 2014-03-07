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
        this.player.setPosition( new cc.Point( 3*screenWidth/4, screenHeight/2 ) );
        this.addChild( this.player );

        this.state = GameLayer.STATES.FRONT;
        this.setKeyboardEnabled( true );
        this.scheduleUpdate();
        this.startGame();
        return true;
    },
    startGame: function() {
        this.units = [];
        var timePerGap = GameLayer.UNIT_GAP/((3*screenWidth/2)/GameLayer.UNIT_VELOCITY);;
        //var timeForStart = GameLayer.UNIT_GAP-320;
        for(var i=0; i<GameLayer.UNIT_NUMBER ;i++)
        {
            var unit = new Unit( this );
            this.units.push( unit );
            this.units[i].setPosition( new cc.Point( -screenWidth/4-i*GameLayer.UNIT_GAP, screenHeight/2));
            this.addChild( this.units[i] );
            var pos = this.units[i].getPosition();
            var endPos = new cc.Point( 5*screenWidth/4 , pos.y );
            this.units[i].endPos = endPos;
            var moveAction = cc.MoveTo.create(  GameLayer.UNIT_VELOCITY+timePerGap*i, this.units[i].endPos );
            this.units[i].runAction( moveAction );
        }
    },
    update: function(dt)
    {
        
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
GameLayer.UNIT_NUMBER = 5;
GameLayer.UNIT_GAP = (6*screenWidth/4)/GameLayer.UNIT_NUMBER;
GameLayer.timePerPixel = 1/((3*screenWidth/2)/GameLayer.UNIT_VELOCITY);
GameLayer.UNIT_VELOCITY = 6; //sec in one round

