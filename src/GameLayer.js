var gameScale = 0.5;
var screenWidth = 2048*gameScale;
var screenHeight = 1536*gameScale;

var GameLayer = cc.LayerColor.extend({
    
    init: function() {
        this._super( new cc.Color4B( 0,0,0,255 ) );
        this.setPosition( new cc.Point( 0,0 ) );

        this.initProperties();
        this.bg=new BG();
        this.addChild( this.bg );
        this.startIntro();

        this.state=GameLayer.STATES.FRONT;
        this.setKeyboardEnabled( true );
        this.scheduleUpdate();
        return true;
    },
    initProperties: function() {
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
        this.selectButton=0;
    },
    startIntro:function() {
        this.introArr=[];
        this.addIntroLogo();
        this.buttonArr=[];
        this.addIntroButton();
        this.buttonArr[this.selectButton].select();
    },
    addIntroLogo: function() {
        this.introLogoO=new IntroLogo( this,"o",1150,256 );
        this.addChild( this.introLogoO );
        this.introLogoO.runAnimationO();
        this.introArr.push( this.introLogoO );

        this.introLogoSTop=new IntroLogo( this,"spikeTop",1269,121 );
        this.addChild( this.introLogoSTop );
        this.introLogoSTop.runAnimationSTop();
        this.introArr.push( this.introLogoSTop );

        this.introLogoSBot=new IntroLogo( this,"spikeBot",1060,359 );
        this.addChild( this.introLogoSBot );
        this.introLogoSBot.runAnimationSBot();
        this.introArr.push( this.introLogoSBot );

        this.introLogoFull=new IntroLogo( this,"logo",778.5,227 );
        this.addChild( this.introLogoFull );
        this.introLogoFull.runAnimationFull();
        this.introArr.push( this.introLogoFull );
    },
    addIntroButton: function() {
        for( var i=1; i<=GameLayer.BUTTON_NUMBER.MAINMENU; i++ ) {
            this.introButton = new MainMenuButton( this,i );
            this.addChild( this.introButton );
            this.buttonArr.push( this.introButton );
        }
    },
    hideIntro: function() {
        for( var i=0; i<this.introArr.length; i++ )
            this.introArr[i].hideThis();
        for( var i=0; i<this.buttonArr.length; i++ )
            this.buttonArr[i].hideThis();
    },
    startGame: function() {
        this.units = [];
        this.hideIntro();
        this.state=GameLayer.STATES.STARTED;
        this.player=new Player();
        this.player.setScale( gameScale*GameLayer.PLAYER_SCALE );
        this.player.setPosition( GameLayer.PLAYER_POS );
        this.addChild( this.player );
        this.bg.startGameAnimation();
        this.startSong( "music2" );
        this.crashEffect=new CrashEffect( this );
        this.addChild( this.crashEffect );
        this.crashText=new CrashText( this );
        this.addChild( this.crashText );

        this.createScore();
        this.createMaxCombo();
        this.createCurrentCombo();
    },
    startGameRandom: function() {
        var timePerGap=GameLayer.UNIT_GAP*GameLayer.timePerPixel;
        var gapForStart=GameLayer.UNIT_GAP-GameLayer.PLAYER_DIAMETER*gameScale;
        var timeForStart=gapForStart*GameLayer.timePerPixel;
        for( var i=0; i<GameLayer.UNIT_NUMBER; i++ )
        {
            var unit=new Unit( this );
            this.units.push( unit );
            this.units[i].setPosition( new cc.Point( -screenWidth/4-i*GameLayer.UNIT_GAP-gapForStart,screenHeight/2 ) );
            this.addChild( this.units[i] );
            var pos=this.units[i].getPosition();
            var endPos=new cc.Point( 2*screenWidth,pos.y );
            this.units[i].endPos = endPos;
            if( i%2==0 )
                this.units[i].setRotation( 90 );
            var moveAction=cc.MoveTo.create( GameLayer.UNIT_VELOCITY+timePerGap*i+timeForStart,this.units[i].endPos );
            this.units[i].runAction( moveAction );
        }
    },
    startGameBeat: function( startTime,beat ) {
        this.startTime=startTime;
        this.beatTime=beat;
        this.schedule( this.updateBeat,0,Infinity,0 );
    },
    startSong: function( songKey ) {
        this.music = createjs.Sound.play( songKey );
        var BPM=100;
        if( songKey=="music1" ) //roar
            BPM=92.5;
        else if( songKey=="music2" )
            BPM=87;
        var beat=60/BPM*1000*2;
        this.startGameBeat( 2*beat,beat );
    },
    crashEffectPlay: function( type ) {
        this.scoreUpdate( type );
        this.comboBak=this.combo;
        if( this.isMaxCombo( this.combo ) )
            this.maxCombo=this.combo;
        this.runCrashAnimation( type );
    },
    scoreUpdate: function( type ) {
        var scorePerUnit = GameLayer.SCORE_PER_UNIT;
        var bonusScore = GameLayer.SCORE_PER_COMBO*this.combo;
        if( type=="perfect" ) {
            this.score+=(scorePerUnit+bonusScore);
            this.combo++;
            this.perfect++;
        }
        else if( type=="great" ) {
            this.score+=(2*scorePerUnit/3+bonusScore);
            this.combo++;
            this.great++;
        }
        else if( type=="cool" ) {
            this.score+=(scorePerUnit/3+bonusScore);
            this.combo++;
            this.cool++;
        }
        else if( type=="miss" ) {
            this.combo=0;
            this.miss++;
        }
    },
    runCrashAnimation: function( type ) {
        this.crashEffect.reset( type );
        this.crashText.reset( type );
    },
    isMaxCombo: function( combo ) {
        if( combo>this.maxCombo )
            return true;
        return false;
    },
    randomNumber: function( min,max ) {
        return Math.random()*(max-min)+min;
    },
    reverseMode: function( bool ){
        for( var i=0; i<this.units.length; i++ ) 
            this.units[i].isReverse=bool;
    },
    clickEvent: function() {
        for( var i=0; i<this.units.length; i++)
                this.units[i].checkEvent();
        this.spaceClick=true;
    },
    turnLeft: function( bool ) {
        for( var i=0; i<this.units.length; i++)
            this.units[i].keyLeft=bool;    
    },
    turnRight: function( bool ) {
        for( var i=0; i<this.units.length; i++)
            this.units[i].keyRight=bool;
    },
    onKeyDown: function( e ) {
        //37 = Left , 39 = Right , 32 = Space , 27 = Escape
        if( this.state==GameLayer.STATES.STARTED )
            this.onKeyDownStarted( e );
        else if( this.state==GameLayer.STATES.FRONT )
            this.onKeyDownFront( e );
    },
    onKeyDownStarted: function( e ) {
        if( e==37 )
            this.turnLeft( true );
        if( e==39 )
            this.turnRight( true );
        if( e==32 )
            if( !this.spaceClick )
                this.clickEvent();
    },
    onKeyDownFront: function( e ) {
        if( e==32 )
            if( this.selectButton==0 )
                this.startGame();
        if( e==38 )
            this.selectButtonUp();
        if( e==40 )
            this.selectButtonDown();
    },
    selectButtonUp: function() {
        if( this.selectButton>0 ) {
            this.buttonArr[this.selectButton].unselect();
            this.selectButton--;
            this.buttonArr[this.selectButton].select();
        }
    },
    selectButtonDown: function() {
        if( this.selectButton<this.buttonArr.length-1 ) {
            this.buttonArr[this.selectButton].unselect();
            this.selectButton++;
            this.buttonArr[this.selectButton].select();
        }
    },
    onKeyUp: function( e ) {
        //37 = Left , 39 = Right , 32 = Space , 27 = Escape
        if( this.state==GameLayer.STATES.STARTED ) 
            this.onKeyUpStarted( e );
    },
    onKeyUpStarted: function( e ) {
        if( e==37 )
            this.turnLeft( false );
        if( e==39 )
            this.turnRight( false );
        if( e==32 ) 
            this.spaceClick=false;
    },
    createScore: function() {
        var fontSize=GameLayer.FONT_SIZE.SCORE;
        this.scoreLabel = cc.LabelTTF.create( "000000",GameLayer.FONT,fontSize );
        this.scoreLabel.setAnchorPoint( 0,1 );
        this.scoreLabel.setPosition( 50*gameScale, screenHeight-50*gameScale );
        this.scoreLabel.setFontFillColor( new cc.Color3B( 255,255,255) );
        this.addChild( this.scoreLabel,10 );
    },
    createMaxCombo: function() {
        var fontSize=GameLayer.FONT_SIZE.MAX_COMBO;
        this.maxComboLabel = cc.LabelTTF.create( "Max Combo: 0",GameLayer.FONT,fontSize );
        this.maxComboLabel.setAnchorPoint( 0,1 );
        this.maxComboLabel.setPosition( 50*gameScale,screenHeight-150*gameScale );
        this.maxComboLabel.setFontFillColor( new cc.Color3B( 255,255,255 ) );
        this.addChild( this.maxComboLabel,10 );
    },
    createCurrentCombo: function() {
        var fontSize=GameLayer.FONT_SIZE.CURRENT_COMBO;
        this.comboLabel = cc.LabelTTF.create( "",GameLayer.FONT,fontSize );
        this.comboLabel.setPosition( screenWidth/2,screenHeight/2+2.5*fontSize );
        this.comboLabel.setFontFillColor( new cc.Color3B( 255,255,255 ) );
        this.addChild( this.comboLabel,10 );
    },
    update: function( dt ) {
        if(this.state==GameLayer.STATES.STARTED) 
            this.updateStarted();
    },
    updateStarted: function() {
        this.updateStartedScore();
        this.maxComboLabel.setString("Max Combo: "+this.maxCombo);
        this.updateStartedCombo();
    },
    updateStartedScore: function() {
        if( this.scoreBak<this.score ) {
            this.scoreBak+=GameLayer.SCORE_UPDATE_SPEED;
            if( this.scoreBak>this.score )
                this.scoreBak=this.score;
            this.scoreLabel.setString( this.to06d( this.scoreBak ) );
        }
    },
    updateStartedCombo: function() {
        if( this.combo!=0 )
            this.comboLabel.setString( this.combo );
        else 
            this.comboLabel.setString( "" );
        if( this.comboBak-this.combo<=1 ) {
            this.comboLabel.setOpacity( 255 );
            this.comboBak+=GameLayer.COMBO_TIME_CHANGE_SPEED;
        }
        else 
            this.comboLabel.setOpacity( this.comboLabel.getOpacity()*0.95 );
    },
    updateBeat: function() {
        var pos=this.music.getPosition()-GameLayer.UNIT_VELOCITY*500;
        var time=this.startTime-GameLayer.UNIT_VELOCITY*500;
        if( pos>=time ) {
            this.startTime+=this.beatTime;
            var unit = new Unit( this );
            this.units.push( unit );
            this.units[this.units.length-1].startNewRandomUnit();
            this.addChild( this.units[this.units.length-1] );
        }
    },
    to06d: function( int ) {
        var string = int.toString();
        while( string.length<6 )
            string = "0"+string;
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
GameLayer.UNIT_VELOCITY = 5.2; //sec in one round
GameLayer.UNIT_TURN_SPEED = 4; //normal 4
GameLayer.timePerPixel = (GameLayer.UNIT_VELOCITY/(2*screenWidth));
GameLayer.UNIT_DIAMETER = 320*gameScale;
GameLayer.UNIT_BORDER_SIZE = 15*gameScale;
GameLayer.PLAYER_SCALE = 0.75;
GameLayer.PLAYER_DIAMETER = 71*gameScale*GameLayer.PLAYER_SCALE;
GameLayer.SCORE_PER_UNIT = 300;
GameLayer.SCORE_PER_COMBO = 5;
GameLayer.SCORE_UPDATE_SPEED = 20;
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