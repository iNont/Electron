var WaitingGameLayer = cc.LayerColor.extend({
    ctor: function( gameLayer ) {
        _this = this;
        this.layer = gameLayer;
        this.isInstruction = false;
        this._super();
    },
    socketIO: function() {
        this.socket = io.connect('127.0.0.1:8080');
        this.enemy=null;
        this.IOupdate();
        this.socket.emit( 'regis' );
        this.socket.emit( 'findMatch' );
    },
    IOupdate: function() {
        this.socket.on('startGame', function( oppID ) {
            console.log("Opponent ID: "+oppID);
            _this.enemy = oppID;
            _this.onKeyDown( 32 );
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
    onKeyDown: function( e ) {
        if( ( e == 32 ) && ( this.isInstruction ) )
            this.layer.playingLayer.startGame();
    },
});