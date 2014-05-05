var BattleItems = cc.Sprite.extend({
    ctor: function( layer,key ) {
    	this.layer = layer;
        this._super();
        this.initProperties();
        this.controller(key);
    },
    initProperties: function() {
    },
    controller: function( key ) {
        if( key==BattleItems.KEYS.INK )
            this.runInkItem();
        else if( key==BattleItems.KEYS.INVERSE )
            this.runInverseItem();
        else if( key==BattleItems.KEYS.RANDOM_TURN )
            this.runRandomTurnItem();
        else if( key==BattleItems.KEYS.INVISIBILITY )
            this.runInvisibilityItem();
        else if( key==BattleItems.KEYS.TAUNT )
            this.runTauntItem();
        else if( key==BattleItems.KEYS.MUSIC_ANNOY )
            this.runMusicAnnoyItem();
    },
    runInkItem: function() {
        var src = "images/BI0.png";
        this.initWithFile( src );
        this.setPosition( new cc.Point( screenWidth/2,screenHeight/2 ) );
        this.setScale( gameScale );
        this.setOpacity( 0 );
        this.inkShown=false;
        this.layer.addChild( this,999 );
        this.schedule( this.updateInk,0,Infinity,0 );
    },
    updateInk: function() {
        var opac=this.getOpacity();
        if( opac<255 && !this.inkShown ) {
            this.setOpacity( opac+BattleItems.INK_OPAC.UP );
        }
        else if( opac>0 ) {
            this.inkShown=true;
            this.setOpacity( opac-BattleItems.INK_OPAC.DOWN );
        }
        else
            this.layer.removeChild( this );
    },
    runInverseItem: function() {
        this.layer.addChild( this );
        this.changeInverseControl();
        this.schedule( this.updateInverseTimer,7,0,0 );
    },
    runRandomTurnItem: function() {
        var random=Math.floor( Math.random()*2 );
        var speed=45;
        if( random==0 )
            speed*=-1;
        for( var i=0; i<this.layer.units.length; i++)
            this.layer.units[i].setRotation( this.layer.units[i].getRotation()-speed );
    },
    changeInverseControl: function() {
        this.layer.isInverse=!this.layer.isInverse;
    },
    updateInverseTimer: function() {
        this.changeInverseControl();
        this.layer.removeChild( this );
    },
    runInvisibilityItem: function() {
        this.layer.addChild( this );
        this.changeInvisibleMode();
        this.schedule( this.updateInvisibleTimer,10,0,0 );
    },
    changeInvisibleMode: function() {
        this.layer.invisibleMode=true;
    },
    updateInvisibleTimer: function() {
        this.layer.invisibleMode=false;
        this.layer.removeChild( this );
    },
    runTauntItem: function() {

    },
    runMusicAnnoyItem: function() {
        this.layer.addChild( this );
        this.layer.musicAnnoy.setMute( false );
        this.layer.music.setMute( true );
        this.schedule( this.updateMusicAnnoyTimer,BattleItems.MUSIC_ANNOY_DURATION,0,0 );
    },
    updateMusicAnnoyTimer: function() {
        this.layer.music.setMute( false );
        this.layer.musicAnnoy.setMute( true );
        this.layer.removeChild( this );
    },

    update: function( dt ) {
    },
});

BattleItems.KEYS = {
    RANDOM_TURN: 0,
    INVERSE: 1,
    INVISIBILITY: 2,
    INK: 3,
    TAUNT: 4,
    MUSIC_ANNOY: 5
};
BattleItems.POWER_COST = [750,1200,900,900,0,600];
BattleItems.INK_OPAC = {
    UP: 17,
    DOWN: 1
};
BattleItems.MUSIC_ANNOY_DURATION = 6.5;