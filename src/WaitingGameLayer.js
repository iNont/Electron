var WaitingGameLayer = cc.LayerColor.extend({
    ctor: function( gameLayer ) {
        this.layer = gameLayer;
        this.isInstruction = false;
        this.isFinding = false;
        this.altPressed = false;
        this.loading = new ImageShow( "loading.png" );
        this.loading.setScale( gameScale );
        this.loading.setPosition( new cc.Point( screenWidth/2,screenHeight/2 ) );
        this.schedule( this.loadingAnimate,0,Infinity,0 );
        this._super();
    },
    socketIO: function() {
        this.socket = this.layer.socket;
        this.enemy = null;
        this.IOupdate();
    },
    IOupdate: function() {
        var _this = this;
        this.socket.on('startGame', function( oppID,oppName ) {
            _this.messageLog("Opponent : "+oppName);
            _this.enemy = oppID;
            _this.startTheMatch();
            _this.offWaitingSocket();
        });
    },
    offWaitingSocket: function() {
        this.socket.removeAllListeners( 'startGame' );
    },
    messageLog: function( message ) {
        console.log("---------------------------");
        console.log("Message: "+message);
    },
    startInstruction: function() {
        this.layer.state = GameLayer.STATES.WAITING;
        this.layer.mainMenuLayer.hideButtonIntro();
        this.initInstructionShow();
        this.createDetail();
        this.schedule( this.instructionShowAnimate,0,Infinity,0 );
    },
    initInstructionShow: function() {
        this.instructionShow = new ImageShow( "instruction.png" );
        this.instructionShow.setScale( gameScale );
        this.instructionShow.setPosition( new cc.Point( screenWidth/2,screenHeight/2 ) );
        this.instructionShow.setOpacity( 0 );
        this.addChild( this.instructionShow,51 );
    },
    createDetail: function() {
        var fontSize = GameLayer.FONT_SIZE.LOG;
        this.logLabel = cc.LabelTTF.create( "",GameLayer.FONT,fontSize );
        this.logLabel.setAnchorPoint( 1,1 );
        this.logLabel.setPosition( screenWidth-50*gameScale, screenHeight-50*gameScale );
        this.logLabel.setFontFillColor( new cc.Color3B( 255,255,255 ) );
        this.addChild( this.logLabel,52 );
    },
    showDetail: function( key ) {
        this.unschedule( this.hideDetailTimer );
        var string = "";
        if( key >= 0 && key <= 8 )
            string = BattleItems.NAME[key]+": "+BattleItems.DETAIL[key]+"\n"+"Cost: "+(BattleItems.POWER_COST[key])/15+"%";
        this.logLabel.setString( string );
        this.schedule( this.hideDetailTimer,20,0,0 );
    },
    hideDetailTimer: function() {
        this.logLabel.setString( "" );
    },
    hideInstruction: function() {
        this.isInstruction = false;
        this.removeChild( this.loading );
        this.removeChild( this.logLabel );
        this.schedule( this.instructionHideAnimate,0,Infinity,0 );
    },
    instructionShowAnimate: function() {
        this.units = [];
        this.instructionShow.setOpacity( this.instructionShow.getOpacity()+17/2 );
        if( this.instructionShow.getOpacity() >= 255 ) {
            this.instructionShow.setOpacity( 255 );
            this.isInstruction = true;
            this.socketIO();
            this.unschedule( this.instructionShowAnimate );
        }
    },
    instructionHideAnimate: function() {
        this.instructionShow.setOpacity( this.instructionShow.getOpacity()-17/2 );
        if( this.instructionShow.getOpacity() <= 0 ) {
            this.instructionShow.setOpacity( 0 );
            this.removeChild( this.instructionShow );
            this.unschedule( this.instructionHideAnimate );
        }
    },
    findTheMatch: function() {
        this.isFinding = true;
        this.instructionShow.reset( "findMatch.png" );
        this.hideDetailTimer();
        this.addChild( this.loading,52 );
        this.schedule( this.delayToFinding,3,0,0 );
    },
    loadingAnimate: function() {
        this.loading.setRotation( this.loading.getRotation()-5 );
    },
    stopFinding: function() {
        this.unschedule( this.delayToFinding );
        this.isFinding = false;
        this.instructionShow.reset( "instruction.png" );
        this.removeChild( this.loading );
        this.socket.emit( 'stopFinding' );
    },
    delayToFinding: function() {
        this.socket.emit( 'findMatch' );
    },
    startTheMatch: function() {
        this.layer.playingLayer.startGame();
    },
    onKeyDown: function( e ) {
        if( e == 32 ) {
            if( this.isFinding )
                this.stopFinding();
            else if( this.isInstruction )
                this.findTheMatch();
        }
        else if( e == 27 ) {
            if( this.isFinding )
                this.stopFinding();
            this.layer.startMainMenu();
        }
        if( !this.isFinding ) {
            if( this.altPressed )
                this.onKeyDownItem( e );
            if( e==18 )
                this.altPressed = true;
        }
    },
    onKeyUp: function( e ) {
        if( e == 18 )
            this.altPressed = false;
    },
    onKeyDownItem: function( e ) {
        // 81 87 69 65 83 68 90 88 67
        var keyList = [81,87,69,65,83,68,90,88,67];
        for( var i = 0; i < keyList.length; i++ )
            if( e == keyList[i] )
                this.showDetail( i );
    },
});