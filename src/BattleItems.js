var BattleItems = cc.Sprite.extend({
    ctor: function( layer,key ) {
    	this.layer = layer;
        this._super();
        this.initProperties();
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