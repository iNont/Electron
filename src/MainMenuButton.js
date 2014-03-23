var MainMenuButton = cc.Sprite.extend({
    ctor: function( layer,number ) {
        this.layer=layer;
        this._super();
        this.initWithFile( 'images/intro/button'+number+'.png' );
        this.gab=160*gameScale;
        this.setScale(gameScale*0.75);
        this.setOpacity(255/2);
        this.setPosition(new cc.Point(screenWidth+1350,screenHeight/2-number*this.gab));
        this.scheduleUpdate();
        this.selected=false;
    },
    update: function( dt ) {
        var pos = this.getPosition();
        if(pos.x>screenWidth)
            this.setPosition(new cc.Point(pos.x-15,pos.y));
    },
    updateHide: function() {
        var pos = this.getPosition();
        this.setOpacity(this.getOpacity()-5);
        if(pos.x<screenWidth+500)
            this.setPosition(new cc.Point(pos.x+15,pos.y));
        else
            this.layer.removeChild(this);

    },
    hideThis: function() {
        this.unscheduleUpdate();
        this.schedule(this.updateHide,0,Infinity,0);
    },
    select: function() {
        this.selected=true;
        this.setScale(gameScale);
        this.setOpacity(200);
    },
    unselect: function() {
        this.selected=false;
        this.setScale(gameScale*0.75);
        this.setOpacity(255/2);
    }
});