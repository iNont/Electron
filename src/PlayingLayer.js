var PlayingLayer = cc.LayerColor.extend({
    ctor: function( gameLayer ) {
        this._super();
        this.layer=gameLayer;
        this.initProperties();
    },
    initProperties: function() {
        this.stat="miss";
        this.isReverse = false;
        this.isWink = true;
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
        this.startSongByBeat( "music2" );
        this.addEffectToLayer();
        this.addLabelToLayer();
        
        this.schedule(this.updateStarted,0,Infinity,0);
    },
    startSongByBeat: function( songKey ) {
        this.music = createjs.Sound.play( songKey );
        var BPM=100;
        if( songKey=="music1" ) //roar
            BPM=92.5;
        else if( songKey=="music2" )
            BPM=87;
        var beat=60/BPM*1000*2;
        this.startGameBeat( 2*beat,beat );
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
        if( e==37 )
            this.turnLeft( true );
        if( e==39 )
            this.turnRight( true );
        if( e==32 )
            if( !this.spaceClick )
                this.clickEvent();
    },
    onKeyUp: function( e ) {
        if( e==37 )
            this.turnLeft( false );
        if( e==39 )
            this.turnRight( false );
        if( e==32 ) 
            this.spaceClick=false;
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
                this.units[this.units.length-1].startNewUnit(this.units[this.units.length-2].getRotation()+this.notes[this.noteRunner].angle);
            else
                this.units[this.units.length-1].startNewRandomUnit();
            this.addChild( this.units[this.units.length-1] );
            if(this.noteRunner<this.notes.length-1)
                this.noteRunner++;
            else
                this.unschedule(this.updateNotes);
        }
    },
    getNotes: function() {
        var notes= [new Note(2644,0),new Note(3968,0),new Note(5327,0),new Note(6702,-64),new Note(8078,0),new Note(8779,36),new Note(10135,28),new Note(11509,-24),new Note(12853,-28),new Note(14317,-24),new Note(15762,-16),new Note(17080,8),new Note(17825,0),new Note(18491,0),new Note(19175,0),new Note(20431,0),new Note(21158,0),new Note(21859,0),new Note(23966,-28),new Note(25350,-16),new Note(26686,-8),new Note(27459,0),new Note(28142,0),new Note(28827,0),new Note(30134,-16),new Note(31515,-8),new Note(32926,8),new Note(34286,-12),new Note(35678,-12),new Note(37101,12),new Note(38449,-12),new Note(39111,0),new Note(39795,0),new Note(41217,-20),new Note(42550,20),new Note(43957,-24),new Note(44663,0),new Note(45379,0),new Note(46701,-28),new Note(47413,0),new Note(48113,0),new Note(49451,-20),new Note(50147,0),new Note(50897,0),new Note(52235,-32),new Note(53638,16),new Note(54365,0),new Note(55686,24),new Note(56414,0),new Note(57788,-24),new Note(58497,0),new Note(59149,0),new Note(59865,0),new Note(60515,0),new Note(61215,0),new Note(61915,0),new Note(63020,0),new Note(64605,0),new Note(66061,-32),new Note(66782,0),new Note(67415,0),new Note(68790,28),new Note(69838,0),new Note(70190,0),new Note(71525,0),new Note(72922,-28),new Note(74274,-16),new Note(75672,0),new Note(77057,-32),new Note(78406,40),new Note(79085,0),new Note(79834,0),new Note(81197,0),new Note(82558,0),new Note(83965,-28),new Note(85342,24),new Note(86710,-24),new Note(88108,0),new Note(89475,0),new Note(90846,-32),new Note(92243,20),new Note(93646,-12),new Note(94993,-16),new Note(96382,12),new Note(97743,8),new Note(98422,0),new Note(99814,-16),new Note(100572,0),new Note(101917,8),new Note(102555,0),new Note(103965,-12),new Note(104722,0),new Note(106027,-16),new Note(106772,0),new Note(107473,0),new Note(108173,0),new Note(108789,0),new Note(109439,0),new Note(110156,0),new Note(111565,12),new Note(112949,-12),new Note(114346,12),new Note(115006,0),new Note(116397,-12),new Note(117091,0),new Note(117807,0),new Note(118829,0),new Note(120262,-12),new Note(121894,24),new Note(122592,0),new Note(123980,-12),new Note(124333,0),new Note(125398,20),new Note(126009,0),new Note(127148,0),new Note(128082,0),new Note(128793,0),new Note(129510,0),new Note(130798,-12),new Note(131543,0),new Note(132226,0),new Note(132944,0),new Note(134327,8),new Note(135043,0),new Note(136349,12),new Note(137060,0),new Note(138437,24),new Note(139128,0),new Note(140470,20),new Note(141851,-36),new Note(142900,20),new Note(143284,0),new Note(144638,-16),new Note(146013,12),new Note(146747,0),new Note(148117,20),new Note(149484,-20),new Note(150925,40),new Note(151579,0),new Note(152246,0),new Note(152946,0),new Note(153629,0),new Note(154279,0),new Note(154980,0),new Note(156352,-20),new Note(157047,0),new Note(157765,0),new Note(158481,0),new Note(159164,0),new Note(159830,0),new Note(160514,0),new Note(161198,0),new Note(161864,0),new Note(162581,0),new Note(163298,0),new Note(163948,0),new Note(164631,0),new Note(165365,0),new Note(166047,0),new Note(166732,0),new Note(167398,0),new Note(168082,0),new Note(168766,0),new Note(169432,0),new Note(170133,0),new Note(170816,0),new Note(171533,0),new Note(172250,0),new Note(172999,60),new Note(174305,36),new Note(175689,44),new Note(177093,-36),new Note(178429,-20),new Note(179846,-20),new Note(180568,0),new Note(181267,0),new Note(183261,36),new Note(184741,0),new Note(186109,0),new Note(187390,16),new Note(188765,-32),new Note(190205,-28),new Note(191624,-20),new Note(192891,0),new Note(194277,0),new Note(195358,24),new Note(195742,0),new Note(196949,0),new Note(198376,60),new Note(199845,-52),new Note(201198,-40),new Note(202560,-28),new Note(203943,20),new Note(205326,-32),new Note(206717,-36),new Note(208144,0),new Note(209478,0),new Note(210845,32),new Note(212228,-36),new Note(213578,-36),new Note(214965,28),new Note(216365,36),new Note(217746,36),new Note(218389,0),new Note(219811,0),new Note(220607,0),new Note(221886,0),new Note(223246,0),new Note(223976,0),new Note(225365,0),new Note(226747,32),new Note(228174,40),new Note(229481,-20),new Note(230837,20),new Note(232221,12),new Note(233597,16),new Note(234982,12),new Note(236349,-16),new Note(237765,-20),new Note(239141,-16),new Note(240499,-12),new Note(241899,16),new Note(243299,12)] ;
        return notes;
    },

    /**/
});