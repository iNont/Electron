var PlayingLayer = cc.LayerColor.extend({
    ctor: function( gameLayer ) {
        this._super();
        this.layer=gameLayer;
        this.initProperties();
    },
    initProperties: function() {
        this.stat="miss";
        this.isInverse = false;
        this.isWink = true;
        this.spacePressed=false;
        this.turnPressed=false;
        this.turn
        this.score=0;
        this.scoreBak=0;
        this.maxCombo=0;
        this.combo=0;
        this.comboBak=0;
        this.perfect=0;
        this.great=0;
        this.cool=0;
        this.miss=0;
    },
    startGame: function() {
        this.units = [];
        this.layer.mainMenuLayer.hideButtonIntro();
        this.layer.state=GameLayer.STATES.STARTED;

        this.player=new Player();
        this.player.setScale( gameScale*GameLayer.PLAYER_SCALE );
        this.player.setPosition( GameLayer.PLAYER_POS );
        this.addChild( this.player );

        //this.startSongByNote( "music2" ,this.getNotes());
        this.startSongByBeat( "music3" );
        this.addEffectToLayer();
        this.addLabelToLayer();
        
        this.schedule(this.updateStarted,0,Infinity,0);
    },
    startSongByBeat: function( songKey ) {
        this.music = createjs.Sound.play( songKey );
        //this.music.on("complete",this.showStatus);
        var BPM=100;
        if( songKey=="music1" ) //roar
            BPM=92.5;
        else if( songKey=="music2" )
            BPM=87;
        else if( songKey=="music3" ) //if i never see your face again
            BPM=106;
        var beat=60/BPM*1000*2;
        this.startGameBeat( 2*beat,beat );
    },
    showStatus: function() {
        console.log("Score: "+this.score);
        console.log("Max Combo: "+this.maxCombo);
        console.log("Perfect: "+this.perfect);
        console.log("Great: "+this.great);
        console.log("Cool: "+this.cool);
        console.log("Miss: "+this.miss);
    },
    startGameBeat: function( startTime,beat ) {
        this.startTime=startTime;
        this.beatTime=beat;
        this.schedule( this.updateBeat,0,Infinity,0 );
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
    addEffectToLayer: function() {
        this.layer.bg.startGameAnimation();

        this.crashEffect=new CrashEffect( this );
        this.addChild( this.crashEffect );
        this.crashText=new CrashText( this );
        this.addChild( this.crashText );
    },
    addLabelToLayer: function() {
        this.createScore();
        this.createMaxCombo();
        this.createCurrentCombo();
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
    printf_to06d: function( int ) {
        var string = int.toString();
        while( string.length<6 )
            string = "0"+string;
        return string;
    },
    randomNumber: function( min,max ) {
        return Math.random()*(max-min)+min;
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
            this.scoreLabel.setString( this.printf_to06d( this.scoreBak ) );
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
    InverseMode: function( bool ){
        for( var i=0; i<this.units.length; i++ ) 
            this.units[i].isInverse=bool;
    },
    clickEvent: function() {
        for( var i=0; i<this.units.length; i++)
                this.units[i].checkEvent();
        this.spacePressed=true;
    },
    turnLeft: function( bool ) {
        for( var i=0; i<this.units.length; i++)
            this.units[i].keyLeft=bool;
        if( this.layer.isSingleTurn )
            this.turnPressed=bool;
    },
    turnRight: function( bool ) {
        for( var i=0; i<this.units.length; i++)
            this.units[i].keyRight=bool;
        if( this.layer.isSingleTurn )
            this.turnPressed=bool;
    },
    onKeyDown: function( e ) {
        if( e==37 && !this.turnPressed )
            this.turnLeft( true );
        if( e==39 && !this.turnPressed )
            this.turnRight( true );
        if( e==32 && !this.spacePressed )
            this.clickEvent();
        if( e==49 )
            this.useBattleItem( 0 );
        if( e==50 )
            this.useBattleItem( 1 );
    },
    onKeyUp: function( e ) {
        if( e==37 )
            this.turnLeft( false );
        if( e==39 )
            this.turnRight( false );
        if( e==32 ) 
            this.spacePressed=false;
    },
    useBattleItem: function( key ) {
        var battleItem = new BattleItems( this,key );
    },


    /*//Additional Features*/

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
    startSongByNote: function( songKey , notes) {
        this.music = createjs.Sound.play( songKey );
        this.notes = notes;
        this.noteRunner=0;
        this.schedule( this.updateNotes,0,Infinity,0 );
    },
    updateNotes: function() {
        var pos=this.music.getPosition()-GameLayer.UNIT_VELOCITY*500;
        var time=this.notes[this.noteRunner].clickPos-GameLayer.UNIT_VELOCITY*500;
        if( pos>=time ) {
            var unit = new Unit( this );
            this.units.push( unit );
            if(this.noteRunner!=0)
                this.units[this.units.length-1].startNewUnit(this.units[this.units.length-2].alreadyTurned+this.notes[this.noteRunner].angle*45);
            else
                this.units[this.units.length-1].startNewUnit(this.notes[this.noteRunner].angle*45);
            this.addChild( this.units[this.units.length-1] );
            if(this.noteRunner<this.notes.length-1)
                this.noteRunner++;
            else
                this.unschedule(this.updateNotes);
        }
    },
    getNotes: function() {
        var notes=[new Note(3950,0),new Note(5322,0),new Note(6694,0),new Note(8080,0),new Note(8799,-1),new Note(9501,0),new Note(10822,0),new Note(12212,0),new Note(13565,0),new Note(14971,1),new Note(16357,-1),new Note(17778,1),new Note(19132,-1),new Note(20488,1),new Note(21857,2),new Note(23279,-1),new Note(24667,-1),new Note(26071,-1),new Note(26724,0),new Note(27375,0),new Note(28781,0),new Note(30185,1),new Note(31556,-1),new Note(32944,-2),new Note(34298,-1),new Note(35702,0),new Note(37124,0),new Note(38462,1),new Note(39766,-1),new Note(41923,-1),new Note(42609,0),new Note(43963,0),new Note(44699,0),new Note(45384,0),new Note(46072,0),new Note(46755,0),new Note(47424,0),new Note(48110,0),new Note(48795,0),new Note(49515,0),new Note(50869,-1),new Note(52223,1),new Note(53628,-1),new Note(53961,0),new Note(54647,-1),new Note(55032,0),new Note(56387,-1),new Note(57791,1),new Note(59196,-1),new Note(60533,-1),new Note(61955,-1),new Note(63310,1),new Note(64680,1),new Note(66068,-1),new Note(67406,-1),new Note(68810,1),new Note(70198,-2),new Note(71536,-1),new Note(72924,1),new Note(74278,-1),new Note(75716,1),new Note(77054,-1),new Note(78426,1),new Note(79813,-1),new Note(81200,1),new Note(82587,-1),new Note(83960,1),new Note(85347,-1),new Note(86684,-1),new Note(88056,1),new Note(89479,-1),new Note(90814,1),new Note(92269,-1),new Note(93658,1),new Note(94997,-1),new Note(96366,1),new Note(97788,-1),new Note(99125,1),new Note(100580,-1),new Note(101901,1),new Note(103290,-1),new Note(104075,0),new Note(105312,-1),new Note(106717,-1),new Note(108121,1),new Note(109458,1),new Note(110830,-1),new Note(112217,-1),new Note(113638,1),new Note(115027,-1),new Note(115695,0),new Note(117085,1),new Note(118471,-1),new Note(119875,-1),new Note(120544,0),new Note(121214,0),new Note(121881,0),new Note(123286,1),new Note(124022,0),new Note(124708,0),new Note(126029,-1),new Note(126748,0),new Note(128121,-2),new Note(129506,-2),new Note(130880,-2),new Note(131632,0),new Note(132349,0),new Note(133638,1),new Note(134991,1),new Note(136397,-1),new Note(137767,-1),new Note(139171,-1),new Note(140526,-1),new Note(141863,-1),new Note(143301,2),new Note(144639,1),new Note(145442,1),new Note(146027,1),new Note(146713,1),new Note(147433,1),new Note(148117,-1),new Note(148853,-1),new Note(150192,-1),new Note(150876,0),new Note(152264,-1),new Note(153635,-1),new Note(154388,0),new Note(155039,0),new Note(156393,-1),new Note(157781,-1),new Note(159152,-1),new Note(160544,-1),new Note(161896,1),new Note(163300,0),new Note(164687,1),new Note(166075,1),new Note(167346,-1),new Note(168784,-1),new Note(170222,-1),new Note(171559,-1),new Note(172228,0),new Note(172596,0),new Note(172931,0),new Note(173633,1),new Note(173968,0),new Note(174335,0),new Note(174686,0),new Note(175022,0),new Note(175355,0),new Note(175690,0),new Note(176007,0),new Note(176391,0),new Note(176710,0),new Note(177428,-1),new Note(177814,0),new Note(178081,0),new Note(178465,0),new Note(178817,0),new Note(179869,-1),new Note(181224,-1),new Note(182845,1),new Note(184819,0),new Note(187061,0),new Note(188531,-1),new Note(190236,-1),new Note(191675,1),new Note(192979,-1),new Note(194335,1),new Note(195755,-2),new Note(197093,1),new Note(198546,1),new Note(199985,1),new Note(202024,-1),new Note(203312,-1),new Note(204667,0),new Note(206055,1),new Note(207493,-1),new Note(208814,1),new Note(210184,-1),new Note(211506,1),new Note(212895,-1),new Note(213596,0),new Note(213980,0),new Note(214650,-1),new Note(215034,0),new Note(216371,0),new Note(217826,0),new Note(219131,-1),new Note(221220,1),new Note(222624,-1),new Note(223996,-1),new Note(225384,1),new Note(226755,-1),new Note(228093,0),new Note(230066,-1),new Note(231587,1),new Note(232976,-1),new Note(234363,1),new Note(235684,-1),new Note(237490,0),new Note(239814,0),new Note(242306,0)] 
        return notes;
    },

    /**/
});