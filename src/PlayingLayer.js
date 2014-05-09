var PlayingLayer = cc.LayerColor.extend({
    ctor: function( gameLayer ) {
        this.layer = gameLayer;
        this._super();
        this.initProperties();
    },
    initProperties: function() {
        this.initPlayerStatus();
        this.initKeyPressStatus();
        this.initInGameValue();
        this.initItemStatus();
    },
    initPlayerStatus: function() {
        this.score = 0;
        this.perfect = 0;
        this.great = 0;
        this.cool = 0;
        this.miss = 0;
        this.maxCombo = 0;
        this.combo = 0;
        this.power = 0;
    },
    initKeyPressStatus: function() {
        this.spacePressed = false;
        this.turnPressed = false;
        this.altPressed = false;
    },
    initInGameValue: function() {
        this.units=[];
        this.stat = "miss";
        this.isWink = true;
        this.scoreBak = 0;
        this.comboBak = 0;
    },
    initItemStatus: function() {
        this.isInverse = false;
        this.invisibleMode = false;
        this.illusionStack = 0;
        this.isFixNote = false;
    },
    socketIO: function() {
        this.socket = this.layer.socket;
        this.IOupdate();
    },
    IOupdate: function() {
        var _this = this;
        this.socket.on('logMessage', function( message ) {
            _this.logMessage( message );
        });
        this.socket.on('effectBattleItem', function( itemKey ) {
            _this.effectBattleItem( itemKey );
        });
        this.socket.on('showEnemyScore', function( name,score,maxCombo,perfect,great,cool,miss ) {
            var e = {
                name: name,
                score: score,
                maxCombo: maxCombo,
                perfect: perfect,
                great: great,
                cool: cool,
                miss: miss
            };
            _this.showScore( e.name,e.score,e.maxCombo,e.perfect,e.great,e.cool,e.miss );
            _this.enemy = null;
            _this.backToMenu();
        });
    },
    offPlayingSocket: function() {
        this.socket.removeAllListeners( 'effectBattleItem' );
        this.socket.removeAllListeners( 'showEnemyScore' );
        this.socket.removeAllListeners( 'logMessage' );
    },
    startGame: function() {
        this.layer.state = GameLayer.STATES.STARTED;
        this.layer.waitingGameLayer.hideInstruction();
        this.enemy = this.layer.waitingGameLayer.enemy;
        this.isEnemyEnd = null;
        this.socketIO();
        this.initBlueCircle();
        this.addPowerShow();
        this.startSongByBeat( "music3" );
        this.addEffectToLayer();
        this.addLabelToLayer();
        this.schedule( this.updateStarted,0,Infinity,0 );
    },
    initBlueCircle: function() {
        this.player = new Player();
        this.player.setScale( gameScale*GameLayer.PLAYER_SCALE );
        this.player.setPosition( GameLayer.PLAYER_POS );
        this.addChild( this.player );
    },
    addPowerShow: function() {
        this.initPowerGrid();
        this.initPowerBar();
    },
    initPowerGrid: function() {
        this.powerGrid = new ImageShow( "powerGrid.png" );
        this.powerGrid.setPosition( new cc.Point( screenWidth-30*gameScale,screenHeight/2 ) );
        this.powerGrid.setScale( gameScale );
        this.addChild( this.powerGrid,31 );
    },
    initPowerBar: function() {
        this.powerBar = new ImageShow( "powerBar.png" );
        this.powerBar.setAnchorPoint( new cc.Point( 0.5,0 ) );
        this.powerBar.setPosition( new cc.Point( screenWidth-30*gameScale,screenHeight/2-750*gameScale ) );
        this.powerBar.setScaleX( gameScale );
        this.powerBar.setScaleY( 0 );
        this.addChild( this.powerBar,30 );
    },
    startSongByBeat: function( songKey ) {
        var _this = this;
        this.songKey = songKey;
        this.music = createjs.Sound.play( songKey );
        this.music.on("complete", function() {
            _this.schedule( _this.musicEnd,5,0,0 ); 
        });
        this.schedule( this.runMusicAnnoy,BattleItems.MUSIC_ANNOY_DURATION,0,0 );
        var beat = this.genBeat( songKey );
        this.startGameBeat( 2*beat,beat );
    },
    backToMenu: function() {
        this.offPlayingSocket();
        this.hidePlaying();
        this.layer.startMainMenu();
    },
    hidePlaying: function() {
        this.music.stop();
        this.musicAnnoy.stop();
        this.layer.bg.endGameAnimation();
    },
    musicEnd: function() {
        this.showScore( "Your",this.score,this.maxCombo,this.perfect,this.great,this.cool,this.miss );
        this.messageLog( "Waiting for opponent..." );
        this.socket.emit( 'endGame',this.enemy,this.layer.name,this.score,this.maxCombo,this.perfect,this.great,this.cool,this.miss );
    },
    messageLog: function( message ) {
        console.log("---------------------------");
        console.log("Message: "+message);
    },
    showScore: function( name,score,maxCombo,perfect,great,cool,miss ) {
        console.log("---------------------------");
        console.log(name+" Score");
        console.log("   Score     : "+score);
        console.log("   Max Combo : "+maxCombo);
        console.log("   Perfect   : "+perfect);
        console.log("   Great     : "+great);
        console.log("   Cool      : "+cool);
        console.log("   Miss      : "+miss);
    },
    genBeat: function( songKey ) {
        var BPM = 100;
        if( songKey == "music1" ) //roar
            BPM = 92.5;
        else if( songKey == "music2" )
            BPM = 87;
        else if( songKey == "music3" ) //if i never see your face again
            BPM = 106;
        return beat = 60/BPM*1000*2;
    },
    runMusicAnnoy: function() {
        this.musicAnnoy = createjs.Sound.play( this.songKey );
        this.musicAnnoy.setMute( true );
    },
    startGameBeat: function( startTime,beat ) {
        this.startTime = startTime;
        this.beatTime = beat;
        this.schedule( this.updateBeat,0,Infinity,0 );
    },
    updateBeat: function() {
        var pos = this.music.getPosition()-GameLayer.UNIT_VELOCITY*500;
        var time = this.startTime-GameLayer.UNIT_VELOCITY*500;
        if( pos >= time ) {
            this.startTime += this.beatTime;
            var unit = new Unit( this );
            this.units.push( unit );
            this.units[this.units.length-1].startNewRandomUnit();
            this.addChild( this.units[this.units.length-1] );
            if( this.illusionStack>0 )
                this.createIllusion( 2 );
        }
    },
    createIllusion: function( num ) {
        this.illusionStack--;
        for( var i=0;i<num;i++ ) {
            var fakeUnit = new Unit( this );
            fakeUnit.startNewRandomUnit();
            fakeUnit.isFake = true;
            this.addChild( fakeUnit );
        }
    },
    addEffectToLayer: function() {
        this.layer.bg.startGameAnimation();
        this.crashEffect = new CrashEffect( this );
        this.addChild( this.crashEffect );
        this.crashText = new CrashText( this );
        this.addChild( this.crashText );
    },
    addLabelToLayer: function() {
        this.createLog();
        this.createScore();
        this.createMaxCombo();
        this.createCurrentCombo();
    },
    createLog: function() {
        var fontSize = GameLayer.FONT_SIZE.LOG;
        this.logs = [];
        this.logLabel = cc.LabelTTF.create( "",GameLayer.FONT,fontSize );
        this.logLabel.setAnchorPoint( 0,0 );
        this.logLabel.setPosition( 50*gameScale, 50*gameScale );
        this.logLabel.setFontFillColor( new cc.Color3B( 255,255,255 ) );
        this.addChild( this.logLabel,10 );
    },
    createScore: function() {
        var fontSize = GameLayer.FONT_SIZE.SCORE;
        this.scoreLabel = cc.LabelTTF.create( "000000",GameLayer.FONT,fontSize );
        this.scoreLabel.setAnchorPoint( 0,1 );
        this.scoreLabel.setPosition( 50*gameScale, screenHeight-50*gameScale );
        this.scoreLabel.setFontFillColor( new cc.Color3B( 255,255,255 ) );
        this.addChild( this.scoreLabel,10 );
    },
    createMaxCombo: function() {
        var fontSize = GameLayer.FONT_SIZE.MAX_COMBO;
        this.maxComboLabel = cc.LabelTTF.create( "Max Combo: 0",GameLayer.FONT,fontSize );
        this.maxComboLabel.setAnchorPoint( 0,1 );
        this.maxComboLabel.setPosition( 50*gameScale,screenHeight-150*gameScale );
        this.maxComboLabel.setFontFillColor( new cc.Color3B( 255,255,255 ) );
        this.addChild( this.maxComboLabel,10 );
    },
    createCurrentCombo: function() {
        var fontSize = GameLayer.FONT_SIZE.CURRENT_COMBO;
        this.comboLabel = cc.LabelTTF.create( "",GameLayer.FONT,fontSize );
        this.comboLabel.setPosition( screenWidth/2,screenHeight/2+2.5*fontSize );
        this.comboLabel.setFontFillColor( new cc.Color3B( 255,255,255 ) );
        this.addChild( this.comboLabel,10 );
    },
    logMessage: function( message ) {
        this.unschedule( this.logTimer );
        if( this.logs.length >= PlayingLayer.LOGS_MAX )
            this.logs.shift();
        this.logs.push( message );
        this.schedule( this.logTimer,5 );
    },
    logTimer: function() {
        if( this.logs.length > 0 )
            this.logs.shift();
    },
    printf_to06d: function( int ) {
        var string = int.toString();
        while( string.length < 6 )
            string = "0"+string;
        return string;
    },
    randomNumber: function( min,max ) {
        return Math.random()*( max-min )+min;
    },
    updateStarted: function() {
        this.updateStartedScore();
        this.maxComboLabel.setString( "Max Combo: "+this.maxCombo );
        this.updateStartedCombo();
        this.updateStartedPower();
        this.updateLogMessage();
    },
    updateStartedScore: function() {
        if( this.scoreBak < this.score ) {
            this.scoreBak += GameLayer.SCORE_UPDATE_SPEED;
            if( this.scoreBak > this.score )
                this.scoreBak = this.score;
            this.scoreLabel.setString( this.printf_to06d( this.scoreBak ) );
        }
    },
    updateStartedCombo: function() {
        if( this.combo != 0 )
            this.comboLabel.setString( this.combo );
        else 
            this.comboLabel.setString( "" );
        if( this.comboBak-this.combo <= 1 ) {
            this.comboLabel.setOpacity( 255 );
            this.comboBak += GameLayer.COMBO_TIME_CHANGE_SPEED;
        }
        else 
            this.comboLabel.setOpacity( this.comboLabel.getOpacity()*0.95 );
    },
    updateStartedPower: function() {
        var scale = this.power/1500;
        this.powerBar.setScaleY( scale*gameScale );
    },
    updateLogMessage: function() {
        var allLogs = "";
        for( var i = 0; i < this.logs.length;i++ )
            allLogs += ( "\n"+this.logs[i] );
        this.logLabel.setString( allLogs );
    },
    crashEffectPlay: function( type ) {
        this.scoreUpdate( type );
        this.comboBak = this.combo;
        if( this.isMaxCombo( this.combo ) )
            this.maxCombo = this.combo;
        this.runCrashAnimation( type );
    },
    scoreUpdate: function( type ) {
        var scorePerUnit = GameLayer.SCORE_PER_UNIT;
        var bonusScore = GameLayer.SCORE_PER_COMBO*this.combo;
        var scoreGet = 0;
        var array=["miss","cool","great","perfect"];
        for( var i = 0; i < array.length; i++ )
            if( array[i] == type )
                scoreGet = i*scorePerUnit/3+bonusScore;
        if( type == "miss" ) {
            this.computePower( -100-this.combo*40 );
            this.combo = 0;
        }
        else {
            this.computePower( Math.round( scoreGet/3 ) );
            this.combo++;
        }
        this[ type ]++;
        this.score += scoreGet;
    },
    computePower: function( getPower ) {
        this.power += getPower;
        if( this.power > PlayingLayer.MAX_POWER )
            this.power = PlayingLayer.MAX_POWER;
        else if( this.power < 0 )
            this.power = 0;
    },
    runCrashAnimation: function( type ) {
        this.crashEffect.reset( type );
        this.crashText.reset( type );
    },
    isMaxCombo: function( combo ) {
        if( combo > this.maxCombo )
            return true;
        return false;
    },
    InverseMode: function( bool ){
        for( var i = 0; i < this.units.length; i++ ) 
            this.units[i].isInverse=bool;
    },
    clickEvent: function() {
        for( var i = 0; i < this.units.length; i++)
                this.units[i].checkEvent();
        this.spacePressed = true;
    },
    turnLeft: function( bool ) {
        for( var i = 0; i < this.units.length; i++)
            this.units[i].keyLeft = bool;
        this.turnPressed = bool;
    },
    turnRight: function( bool ) {
        for( var i = 0; i < this.units.length; i++)
            this.units[i].keyRight = bool;
        this.turnPressed = bool;
    },
    onKeyDown: function( e ) {
        if( ( e == 37 ) && ( !this.turnPressed ) )
            this.turnLeft( true );
        if( ( e == 39 ) && ( !this.turnPressed ) )
            this.turnRight( true );
        if( ( ( e == 38 ) || ( e == 32 ) ) && ( !this.spacePressed ) )
            this.clickEvent();
        if( this.altPressed )
            this.onKeyDownItem( e );
        if( e==18 )
            this.altPressed = true;
    },
    onKeyDownItem: function( e ) {
        // 81 87 69 65 83 68 90 88 67
        var keyList = [81,87,69,65,83,68,90,88,67];
        for( var i = 0; i < keyList.length; i++ )
            if( e == keyList[i] )
                this.useBattleItem( i );
    },
    onKeyUp: function( e ) {
        if( e == 37 )
            this.turnLeft( false );
        if( e == 39 )
            this.turnRight( false );
        if( ( e == 38 ) || ( e == 32 ) ) 
            this.spacePressed = false;
        if( e == 18 )
            this.altPressed = false;
    },
    useBattleItem: function( key ) {
        if( this.isEnoughPower( key ) ) {
            this.power -= BattleItems.POWER_COST[key];
            if( key<=5 )
                this.socket.emit( 'sendBattleItem',key,this.enemy );
            else
                this.effectBattleItem( key );
            var string = this.layer.name+": Activate "+BattleItems.NAME[key];
            this.socket.emit( 'sendLog',string,this.enemy );
        }
    },
    effectBattleItem: function( key ) {
        var battleItem = new BattleItems( this,key );
    },
    isEnoughPower: function( key ) {
        if( ( key >= 0 ) && ( key <= 8 ) )
            return this.power >= BattleItems.POWER_COST[key];
    },
});

PlayingLayer.LOGS_MAX = 5;
PlayingLayer.MAX_POWER = 1500;