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
        if( key==BattleItems.KEYS.INVERSE )
            this.runInverseItem();
        if( key==BattleItems.KEYS.RANDOM_TURN )
            this.runRandomTurnItem();
    },
    runInkItem: function() {
        var src = "images/BI0.png";
        this.initWithFile( src );
        this.setPosition( new cc.Point( screenWidth/2,screenHeight/2 ) );
        this.setScale( gameScale );
        this.setOpacity( 0 );
        this.inkShown=false;
        this.layer.addChild( this,50 );
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
        this.schedule( this.updateInverseTimer,10,0,0 );
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

    update: function( dt ) {
    },
});

BattleItems.KEYS = {
    INK: 0,
    INVERSE: 1,
    RANDOM_TURN: 2,
    INVISIBILITY: 3
};
BattleItems.INK_OPAC = {
    UP: 17,
    DOWN: 1
};