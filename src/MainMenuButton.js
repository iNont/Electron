var MainMenuButton = cc.Sprite.extend({
    ctor: function( layer,number ) {
        this.layer = layer;
        this._super();
        this.initButton( number );
        this.scheduleUpdate();
    },
    initButton: function( number ) {
        this.initWithFile( "images/intro/button"+number+".png" );
        this.setScale( gameScale*MainMenuButton.SCALE_UNSELECTED );
        this.setOpacity( MainMenuButton.OPACITY_UNSELECTED );
        var initPosX = screenWidth+MainMenuButton.POSITION_INIT;
        var initPosY = screenHeight/2-number*MainMenuButton.GAP*gameScale;
        this.setPosition( new cc.Point( initPosX,initPosY ) );
        this.selected=false;
    },
    update: function( dt ) {
        var pos = this.getPosition();
        if( pos.x > screenWidth )
            this.setPosition( new cc.Point( pos.x-MainMenuButton.SHOW_SPEED,pos.y ) );
    },
    updateHide: function() {
        var pos = this.getPosition();
        this.setOpacity( this.getOpacity()-MainMenuButton.HIDE_SPEED_OPACITY );
        if( pos.x < screenWidth+MainMenuButton.POSITION_HIDE )
            this.setPosition( new cc.Point( pos.x+MainMenuButton.HIDE_SPEED,pos.y ) );
        else
            this.layer.removeChild( this );

    },
    hideThis: function() {
        this.unscheduleUpdate();
        this.schedule( this.updateHide,0,Infinity,0 );
    },
    select: function() {
        this.selected = true;
        this.setScale( gameScale*MainMenuButton.SCALE_SELECTED );
        this.setOpacity( MainMenuButton.OPACITY_SELECTED );
    },
    unselect: function() {
        this.selected = false;
        this.setScale( gameScale*MainMenuButton.SCALE_UNSELECTED );
        this.setOpacity( MainMenuButton.OPACITY_UNSELECTED );
    }
});

MainMenuButton.GAP = 160;
MainMenuButton.SCALE_SELECTED = 1;
MainMenuButton.SCALE_UNSELECTED = 0.75;
MainMenuButton.OPACITY_SELECTED = 200;
MainMenuButton.OPACITY_UNSELECTED = 255/2;
MainMenuButton.POSITION_INIT = 500;
MainMenuButton.POSITION_HIDE = 500;
MainMenuButton.HIDE_SPEED_OPACITY = 5;
MainMenuButton.SHOW_SPEED = 15;
MainMenuButton.HIDE_SPEED = 15;