var WaitingGameLayer = cc.LayerColor.extend({
    ctor: function( gameLayer ) {
        _this = this;
        this.layer = gameLayer;
        this.isInstruction = false;
        this.isFinding = false;
        this.loading = new ImageShow( "loading.png" );
        this.loading.setScale( gameScale );
        this.loading.setPosition( new cc.Point( screenWidth/2,screenHeight/2 ) );
        this.schedule( this.loadingAnimate,0,Infinity,0 );
        this._super();
    },
    socketIO: function() {
        var serverPath = "158.108.225.42"; // "XX.XX.XX.XX" <- IP
        var serverPort = "8080";
        this.socket = io.connect( serverPath+":"+serverPort );
        this.enemy = null;
        this.IOupdate();
        this.socket.emit( 'regis' );
    },
    IOupdate: function() {
        this.socket.on('startGame', function( oppID ) {
            console.log("Opponent ID: "+oppID);
            _this.enemy = oppID;
            _this.startTheMatch();
        });
    },

    startInstruction: function() {
        this.layer.state = GameLayer.STATES.WAITING;
        this.layer.mainMenuLayer.hideButtonIntro();
        this.initInstructionShow();
        this.schedule( this.instructionShowAnimate,0,Infinity,0 );
    },
    initInstructionShow: function() {
        this.instructionShow = new ImageShow( "instruction.png" );
        this.instructionShow.setScale( gameScale );
        this.instructionShow.setPosition( new cc.Point( screenWidth/2,screenHeight/2 ) );
        this.instructionShow.setOpacity( 0 );
        this.addChild( this.instructionShow,51 );
    },
    hideInstruction: function() {
        this.isInstruction = false;
        this.removeChild( this.loading );
        this.schedule( this.instructionHideAnimate,0,Infinity,0 );
        this.unscheduleUpdate();
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
        if( ( e == 32 ) && ( this.isInstruction ) && ( !this.isFinding ) )
            this.findTheMatch();
        else if( this.isFinding && ( e == 32 ) )
            this.stopFinding();
    },
});