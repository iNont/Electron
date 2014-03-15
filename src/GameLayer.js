var gameScale = 0.5;
var screenWidth = 2048*gameScale;
var screenHeight = 1536*gameScale;

var GameLayer = cc.LayerColor.extend({
    
    init: function() {
        this.isReverse = false;
        this.isWink = false;
        this.score=0;
        this.scoreBak=0;
        this.maxCombo=0;
        this.combo=0;
        this.perfect=0;
        this.great=0;
        this.cool=0;
        this.miss=0;

        this._super( new cc.Color4B( 127, 127, 127, 255 ) );
        this.setPosition( new cc.Point( 0, 0 ) );

        this.bg = new BG();
        this.bg.setScale( gameScale );
        this.bg.setPosition( new cc.Point( screenWidth/2, screenHeight/2 ) );
        this.addChild( this.bg );

        this.player = new Player();
        this.player.setScale( gameScale );
        this.player.setPosition( GameLayer.PLAYER_POS );
        this.addChild( this.player );

        this.crashEffect = new CrashEffect(this);
        this.addChild(this.crashEffect);
        this.crashText = new CrashText(this);
        this.addChild(this.crashText);

        this.createScore();
        this.createMaxCombo();
        this.state = GameLayer.STATES.FRONT;
        this.setKeyboardEnabled( true );
        this.scheduleUpdate();
        this.startGame();
        this.startSong("sound");
        return true;
    },
    startGame: function() {
        this.units = [];
        var timePerGap = GameLayer.UNIT_GAP*GameLayer.timePerPixel;
        var gapForStart = GameLayer.UNIT_GAP-GameLayer.PLAYER_DIAMETER*gameScale;
        var timeForStart = gapForStart*GameLayer.timePerPixel;
        for(var i=0; i<GameLayer.UNIT_NUMBER ;i++)
        {
            var unit = new Unit( this );
            this.units.push( unit );
            this.units[i].setScale( gameScale );
            this.units[i].setPosition( new cc.Point( -screenWidth/4-i*GameLayer.UNIT_GAP-gapForStart, screenHeight/2));
            this.addChild( this.units[i] );
            var pos = this.units[i].getPosition();
            var endPos = new cc.Point( 2*screenWidth , pos.y );
            this.units[i].endPos = endPos;
            if(i%2==0)
                this.units[i].setRotation(90);
            var moveAction = cc.MoveTo.create( GameLayer.UNIT_VELOCITY+timePerGap*i+timeForStart, this.units[i].endPos );
            this.units[i].runAction( moveAction );
        }
    },
    startSong: function( songKey){
         this.sound = createjs.Sound.play(songKey);
    },
    crashEffectPlay: function( type ) {
        var spu = GameLayer.SCORE_PER_UNIT;
        if(type=="perfect") {
            this.score+=(spu+GameLayer.SCORE_PER_COMBO*this.combo);
            this.combo++;
            this.perfect++;
        }
        else if(type=="great") {
            this.score+=(spu/2+GameLayer.SCORE_PER_COMBO*this.combo);
            this.combo++;
            this.great++;
        }
        else if(type=="cool") {
            this.score+=(spu/4+GameLayer.SCORE_PER_COMBO*this.combo);
            this.combo++;
            this.cool++;
        }
        else if(type=="miss") {
            this.combo=0;
            this.miss++;
        }

        if(this.isMaxCombo(this.combo))
            this.maxCombo=this.combo;
        console.log("--------------");
        console.log("Score: "+this.score);
        console.log("Max Combo: "+this.maxCombo);
        console.log("Combo: "+this.combo);
        this.crashEffect.reset(type);
        this.crashText.reset(type);
    },
    isMaxCombo: function( combo ) {
        if(combo>this.maxCombo)
            return true;
        return false;
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
    clickEvent: function() {
        for(var i=0; i<GameLayer.UNIT_NUMBER ;i++) {
            this.units[i].checkEvent();
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
        else if( e==32 ) 
            this.clickEvent();
    },
    onKeyUp: function( e ) {
        //37 = Left , 39 = Right , 32 = Space , 27 = Escape
        if( e==37 )
            this.turnLeft( false );
        else if( e==39 )
            this.turnRight( false );
    },
    createScore: function() {
        var scoreSize=90;
        this.scoreLabel = cc.LabelTTF.create("000000","Lucida Grande",scoreSize*gameScale);
        this.scoreLabel.setAnchorPoint(0,1);
        this.scoreLabel.setPosition(50*gameScale, screenHeight-50*gameScale);
        this.scoreLabel.setFontFillColor(new cc.Color3B(255,255,255));
        this.scoreLabel.enableStroke(new cc.Color3B(0,0,0),2);
        this.addChild(this.scoreLabel,10);
    },
    createMaxCombo: function() {
        var fontSize=30;
        this.maxComboLabel = cc.LabelTTF.create("Max Combo: 0","Lucida Grande",fontSize*gameScale);
        this.maxComboLabel.setAnchorPoint(0,1);
        this.maxComboLabel.setPosition(50*gameScale, screenHeight-150*gameScale);
        this.maxComboLabel.setFontFillColor(new cc.Color3B(255,255,255));
        this.maxComboLabel.enableStroke(new cc.Color3B(0,0,0),2);
        this.addChild(this.maxComboLabel,10);
    },
    update: function(dt) {
        if(this.scoreBak<this.score)
        {
            this.scoreBak+=10;
            if(this.scoreBak>this.score)
                this.scoreBak=this.score;
            this.scoreLabel.setString(this.to06d(this.scoreBak));
        }
        this.maxComboLabel.setString("Max Combo: "+this.maxCombo);
    },
    to06d: function( int ) {
        var string = int.toString();
        while(string.length<6)
        {
            string = "0"+string;
        }
        return string;
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
GameLayer.UNIT_NUMBER = 6;
GameLayer.UNIT_GAP = (2*screenWidth)/GameLayer.UNIT_NUMBER;
GameLayer.UNIT_VELOCITY = 7; //sec in one round
GameLayer.UNIT_TURN_SPEED = 4;
GameLayer.timePerPixel = (GameLayer.UNIT_VELOCITY/(2*screenWidth));
GameLayer.UNIT_DIAMETER = 320*gameScale;
GameLayer.UNIT_BORDER_SIZE = 15*gameScale;
GameLayer.PLAYER_DIAMETER = 71*gameScale;
GameLayer.SCORE_PER_UNIT = 300;
GameLayer.SCORE_PER_COMBO = 5;