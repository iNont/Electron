var gameScale = 0.5;
var screenWidth = 2048*gameScale;
var screenHeight = 1536*gameScale;

var GameLayer = cc.LayerColor.extend({
    
    init: function() {
        this.stat="miss";
        this.isReverse = false;
        this.isWink = false;
        this.spaceClick=false;
        this.score=0;
        this.scoreBak=0;
        this.maxCombo=0;
        this.combo=0;
        this.comboBak=0;
        this.perfect=0;
        this.great=0;
        this.cool=0;
        this.miss=0;

        this.bg = new BG();
        this.bg.setScale( gameScale );
        this.bg.setPosition( new cc.Point( screenWidth/2, screenHeight/2 ) );
        this.addChild( this.bg );

        this.introLogoO=new IntroLogo(this,"o",1150,256);
        this.addChild(this.introLogoO);
        this.introLogoO.runAnimationO();

        this.introLogoSTop=new IntroLogo(this,"spikeTop",1269,121);
        this.addChild(this.introLogoSTop);
        this.introLogoSTop.runAnimationSTop();

        this.introLogoBTop=new IntroLogo(this,"spikeBot",1060,359);
        this.addChild(this.introLogoBTop);
        this.introLogoBTop.runAnimationBTop();

        this.introLogoFull=new IntroLogo(this,"logo",778.5,227);
        this.addChild(this.introLogoFull);
        this.introLogoFull.runAnimationFull();
        //this.introLogo.setPosition(screenWidth/2,screenHeight/2);

        this._super( new cc.Color4B( 0, 0, 0, 255 ) );
        this.setPosition( new cc.Point( 0, 0 ) );

        this.state = GameLayer.STATES.FRONT;
        this.setKeyboardEnabled( true );
        this.scheduleUpdate();
        //this.startGame();
        return true;
    },
    hideIntro: function() {
        this.removeChild(this.introLogoO);
        this.removeChild(this.introLogoSTop);
        this.removeChild(this.introLogoBTop);
        this.removeChild(this.introLogoFull);
    },
    startGame: function() {
        this.units = [];
        this.hideIntro();
        this.state=GameLayer.STATES.STARTED;
        this.player = new Player();
        this.player.setScale( gameScale );
        this.player.setPosition( GameLayer.PLAYER_POS );
        this.addChild( this.player );

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
            /*LongUnit Test/
            if(i>0)
                this.units[i].setOpacity(100);
            /**/
            var moveAction = cc.MoveTo.create( GameLayer.UNIT_VELOCITY+timePerGap*i+timeForStart, this.units[i].endPos );
            this.units[i].runAction( moveAction );
        }

        this.crashEffect = new CrashEffect(this);
        this.addChild(this.crashEffect);
        this.crashText = new CrashText(this);
        this.addChild(this.crashText);

        this.createScore();
        this.createMaxCombo();
        this.createCurrentCombo();
        this.startSong("sound");

    },
    startSong: function( songKey){
         this.music = createjs.Sound.play(songKey);
    },
    crashEffectPlay: function( type ) {
        var spu = GameLayer.SCORE_PER_UNIT;
        if(type=="perfect") {
            this.score+=(spu+GameLayer.SCORE_PER_COMBO*this.combo);
            this.combo++;
            this.perfect++;
        }
        else if(type=="great") {
            this.score+=(2*spu/3+GameLayer.SCORE_PER_COMBO*this.combo);
            this.combo++;
            this.great++;
        }
        else if(type=="cool") {
            this.score+=(spu/3+GameLayer.SCORE_PER_COMBO*this.combo);
            this.combo++;
            this.cool++;
        }
        else if(type=="miss") {
            this.combo=0;
            this.miss++;
        }
        this.comboBak=this.combo;
        if(this.isMaxCombo(this.combo))
            this.maxCombo=this.combo;
        /*/
        console.log("--------------");
        console.log("Score: "+this.score);
        console.log("Max Combo: "+this.maxCombo);
        console.log("Combo: "+this.combo);
        /**/
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
        this.spaceClick=true;
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
        {
            if(this.state==GameLayer.STATES.FRONT)
                this.startGame();
            this.clickEvent();
        }
    },
    onKeyUp: function( e ) {
        //37 = Left , 39 = Right , 32 = Space , 27 = Escape
        if( e==37 )
            this.turnLeft( false );
        else if( e==39 )
            this.turnRight( false );
        else if( e==32 ) 
            this.spaceClick=false;
    },
    createScore: function() {
        var scoreSize=90;
        this.scoreLabel = cc.LabelTTF.create("000000","Lucida Grande",scoreSize*gameScale);
        this.scoreLabel.setAnchorPoint(0,1);
        this.scoreLabel.setPosition(50*gameScale, screenHeight-50*gameScale);
        this.scoreLabel.setFontFillColor(new cc.Color3B(255,255,255));
        //this.scoreLabel.enableStroke(new cc.Color3B(0,0,0),2);
        this.addChild(this.scoreLabel,10);
    },
    createMaxCombo: function() {
        var fontSize=30;
        this.maxComboLabel = cc.LabelTTF.create("Max Combo: 0","Lucida Grande",fontSize*gameScale);
        this.maxComboLabel.setAnchorPoint(0,1);
        this.maxComboLabel.setPosition(50*gameScale, screenHeight-150*gameScale);
        this.maxComboLabel.setFontFillColor(new cc.Color3B(255,255,255));
        //this.maxComboLabel.enableStroke(new cc.Color3B(0,0,0),2);
        this.addChild(this.maxComboLabel,10);
    },
    createCurrentCombo: function() {
        var fontSize=100;
        this.comboLabel = cc.LabelTTF.create("","Lucida Grande",fontSize*gameScale);
        //this.comboLabel.setAnchorPoint(0,0);
        this.comboLabel.setPosition(screenWidth/2, screenHeight/2+2.5*fontSize*gameScale);
        this.comboLabel.setFontFillColor(new cc.Color3B(255,255,255));
        //this.comboLabel.enableStroke(new cc.Color3B(0,0,0),2);
        this.addChild(this.comboLabel,10);
    },
    update: function(dt) {

        if(this.state==GameLayer.STATES.STARTED) {
            if(this.scoreBak<this.score)
            {
                this.scoreBak+=10;
                if(this.scoreBak>this.score)
                    this.scoreBak=this.score;
                this.scoreLabel.setString(this.to06d(this.scoreBak));
            }
            this.maxComboLabel.setString("Max Combo: "+this.maxCombo);
            if(this.combo!=0) 
            {
               this.comboLabel.setString(this.combo);
            }
            else 
                this.comboLabel.setString("");
            if(this.comboBak-this.combo<=1)
            {
                this.comboLabel.setOpacity(255);
                this.comboBak+=0.02;
            }
            else this.comboLabel.setOpacity(this.comboLabel.getOpacity()*0.95);
        }
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
    STARTED: 2
};
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