var BattleItems = cc.Sprite.extend({
    ctor: function( layer,key ) {
    	this.layer = layer;
        this._super();
        this.initProperties();
        this.controller(0);
    },
    initProperties: function() {
    },
    controller: function( key ) {
        if( key==BattleItems.KEYS.INK )
            this.runInkItem();
    },
    runInkItem: function() {
        var src = "images/BI0.png";
        this.initWithFile( src );
        this.setPosition( new cc.Point(screenWidth,screenHeight) );
        this.setScale( gameScale );
        setOpacity( 0 );
        this.inkShown=false;
        this.schedule( this.updateInk,0,Infinity,0 );
    },
    updateInk: function() {
        var opac=this.getOpacity();
        if( opac<255 && !this.inkShown ) {
            this.setOpacity( opac+BattleItems.INK_OPAC.UP );
            if( this.getOpacity()==255 );
                this.inkShown=true;
        }
        else if( opac>0 )
            this.setOpacity( opac-BattleItems.INK_OPAC.DOWN );
        else
            this.unschedule( this.updateInk );
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
    DOWN: 0.5
};