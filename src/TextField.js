var TextField = cc.LayerColor.extend({
    ctor: function( gameLayer ) {
        this._super();
        this.layer = gameLayer;
        this.initProperties();
        this.bgTextBox = new ImageShow( "textBox.png" );
        this.bgTextBox.setScale( gameScale );
        this.bgTextBox.setPosition( new cc.Point( screenWidth/2,screenHeight/2 ) );
        this.scheduleUpdate();
    },
    initProperties: function() {
        this.backupState = -1;
        this.isShift = false;
        this.returnText = "";
        this.typingText = "";
        this.maxLength = 0;
    },
    startTextField: function( maxLength,message ) {
        this.addChild( this.bgTextBox );
        this.backupState = this.layer.state;
        this.maxLength = maxLength;
        this.createTypingTextLabel();
        this.createMessageLabel( message );
        this.layer.addChild( this );
        this.layer.state = GameLayer.STATES.TEXTFIELD;
        this.scheduleUpdate();
    },
    endTextField: function() {
        this.unscheduleUpdate();
        this.returnText = this.typingText;
        this.removeChild( this.typingLabel );
        this.removeChild( this.message );
        this.removeChild( this.bgTextBox );
        this.layer.state = this.backupState;
        this.regisName();
        this.initProperties();
    },
    regisName: function() {
        this.layer.name = this.returnText;
        this.layer.connectSocket();
        this.layer.frontLayer.startIntro();
    },
    createTypingTextLabel: function() {
        var fontSize = 80*gameScale;
        this.typingLabel = cc.LabelTTF.create( "",GameLayer.FONT,fontSize );
        this.typingLabel.setAnchorPoint( 1,0.5 );
        this.typingLabel.setPosition( new cc.Point( screenWidth/2+TextField.TEXTBOX_SIZE.WIDTH/2*gameScale-20*gameScale,screenHeight/2+TextField.TEXTBOX_SIZE.HEIGHT*gameScale/2) );
        this.addChild( this.typingLabel,10 );
    },
    createMessageLabel: function( message ) {
        var fontSize = 40*gameScale;
        this.message = cc.LabelTTF.create( message,GameLayer.FONT,fontSize );
        this.message.setAnchorPoint( 0,0 );
        this.message.setPosition( new cc.Point( screenWidth/2-TextField.TEXTBOX_SIZE.WIDTH*gameScale/2-20*gameScale,screenHeight/2+TextField.TEXTBOX_SIZE.HEIGHT*gameScale+20*gameScale ) );
        this.addChild( this.message,10 );
    },
    typing: function( key ) {
        if( this.typingText.length<=this.maxLength )
            this.typingText += String.fromCharCode( key );
    },
    removeLastChar: function() {
        if( this.typingText.length>0 )
            this.typingText = this.typingText.substring( 0,this.typingText.length-1 ); 
    },
    update: function( dt ) {
        this.typingLabel.setString( this.typingText );
    },
    onKeyDown: function( e ) {
        var key = e;
        if( !this.isShift )
            key += 32;
        if( e>=65 && e<=90 )
            this.typing( key );
        else if( e==16 )
            this.isShift = true;
        else if( e==8 )
            this.removeLastChar();
        else if( e==13 )
            this.endTextField();

    },
    onKeyUp: function( e ) {
        if( e==16 )
            this.isShift = false;
    }
});

TextField.TEXTBOX_SIZE = {
    WIDTH: 1430,
    HEIGHT: 123
};