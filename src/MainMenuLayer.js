var MainMenuLayer = cc.LayerColor.extend({
    ctor: function( gameLayer ) {
        this.layer = gameLayer;
        this._super();
    },
    startMainMenu: function() {
        this.selectButton = 0;
        this.buttonArr = [];
        this.addIntroButton();
        this.buttonArr[this.selectButton].select();
        this.layer.state = GameLayer.STATES.MAINMENU;
    },
    addIntroButton: function() {
        for( var i = 1; i <= GameLayer.BUTTON_NUMBER.MAINMENU; i++ ) {
            var introButton = new MainMenuButton( this,i );
            this.addChild( introButton );
            this.buttonArr.push( introButton );
        }
    },    
    hideButtonIntro: function() {
        for( var i = 0; i < this.buttonArr.length; i++ )
            this.buttonArr[i].hideThis();
    },
    selectButtonUp: function() {
        if( this.selectButton > 0 ) {
            this.buttonArr[this.selectButton].unselect();
            this.selectButton--;
            this.buttonArr[this.selectButton].select();
        }
    },
    selectButtonDown: function() {
        if( this.selectButton < this.buttonArr.length-1 ) {
            this.buttonArr[this.selectButton].unselect();
            this.selectButton++;
            this.buttonArr[this.selectButton].select();
        }
    },
    onKeyDown: function( e ) {
        if( e==32 )
            if( this.selectButton==0 )
                this.layer.waitingGameLayer.startInstruction();
        if( e==38 )
            this.selectButtonUp();
        if( e==40 )
            this.selectButtonDown();
    },
});