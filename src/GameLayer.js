var gameScale = 0.5;
var screenWidth = 2048*gameScale;
var screenHeight = 1536*gameScale;

var GameLayer = cc.LayerColor.extend({
    
    init: function() {
        this.noteRecorderMode=false;
        this._super( new cc.Color4B( 0,0,0,255 ) );
        this.setPosition( new cc.Point( 0,0 ) );

        this.bg=new BG();
        this.addChild( this.bg );

        this.addAllLayers();
        this.option();

        this.state=GameLayer.STATES.FRONT;
        this.setKeyboardEnabled( true );
        this.scheduleUpdate();
        return true;
    },
    option: function() {
        this.isSingleTurn=true;
        if( this.isSingleTurn )
            GameLayer.UNIT_TURN_SPEED=45;
    },
    addAllLayers: function() {
        this.frontLayer=new FrontLayer( this );
        this.frontLayer.startIntro();
        this.addChild( this.frontLayer );

        this.mainMenuLayer=new MainMenuLayer( this );
        this.addChild( this.mainMenuLayer );

        this.playingLayer=new PlayingLayer( this );
        this.addChild( this.playingLayer );
    },
    startNoteRecorderMode: function( songKey ) {
        this.mainMenuLayer.hideButtonIntro();
        this.schedule(this.updateRecorder,0,Infinity,0);
        this.music = createjs.Sound.play( songKey );
        this.noteRecorder_angle=0;
        this.notesRecorded=[];
        this.state=GameLayer.STATES.NOTE_CREATOR;
    },
    recordNote: function() {
        this.recorederClicked=false;
        this.recorderTurnLeft=false;
        this.recorderTurnRight=false;
        var clickPos = Math.floor(this.music.getPosition());
        var note = new Note(clickPos,this.noteRecorder_angle);
        this.notesRecorded.push(note);
        this.showRecordedNotes();
        this.noteRecorder_angle=0;
    },
    showRecordedNotes: function() {
        var string="[";
        for(var i=0;i<this.notesRecorded.length;i++) {
            var eachNote="new Note("+this.notesRecorded[i].clickPos+","+this.notesRecorded[i].angle+")";
            if(i!=this.notesRecorded.length-1)
                eachNote+=",";
            string+=eachNote;
        }
        string+="]";
        console.log(string);
    },
    onKeyDown: function( e ) {
        //37 = Left , 39 = Right , 32 = Space , 27 = Escape
        if( this.state==GameLayer.STATES.STARTED )
            this.playingLayer.onKeyDown( e );
        else if( this.state==GameLayer.STATES.MAINMENU )
            this.mainMenuLayer.onKeyDown( e );
        else if( this.state==GameLayer.STATES.NOTE_CREATOR )
            this.onKeyDownNoteRecorder( e );
        else if( this.state==GameLayer.STATES.FRONT )
            this.frontLayer.onKeyDown( e );
    },
    onKeyDownNoteRecorder: function( e ) {
        if( e==37 )
            this.recorderTurnLeft=true;
        if( e==39 )
            this.recorderTurnRight=true;
        if( e==32 )
            this.recordNote();
    },
    onKeyUp: function( e ) {
        //37 = Left , 39 = Right , 32 = Space , 27 = Escape
        if( this.state==GameLayer.STATES.STARTED ) 
            this.playingLayer.onKeyUp( e );
        else if( this.state==GameLayer.STATES.NOTE_CREATOR ) 
            this.onKeyUpNoteRecorder( e );
    },
    onKeyUpNoteRecorder: function( e ) {
        if( e==37 )
            this.recorderTurnLeft=false;
        if( e==39 )
            this.recorderTurnRight=false;
        this.recorederClicked=false;
    },
    updateRecorder: function() {
        if(this.recorderTurnLeft&&!this.recorederClicked) {
            this.noteRecorder_angle-=1;
            this.recorederClicked=true;
        }
        if(this.recorderTurnRight&&!this.recorederClicked) {
            this.noteRecorder_angle+=1;
            this.recorederClicked=true;
        }
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
    MAINMENU: 3,
    NOTE_CREATOR: 99
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
GameLayer.SCORE_PER_UNIT = 600;
GameLayer.SCORE_PER_COMBO = 10;
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