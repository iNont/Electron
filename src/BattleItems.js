var BattleItems = cc.Sprite.extend({
    ctor: function( layer ) {
    	this.layer = layer;
        this._super();
        this.initProperties();
    },
    initProperties: function() {
    },
    update: function( dt ) {
    },

    reset: function(type){
        var src = "images/BI"+key+".png";
        this.initWithFile( src );
        this.initProperties();
        this.scheduleUpdate();
    }
});