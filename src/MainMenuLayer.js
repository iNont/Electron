var MainMenuLayer = cc.LayerColor.extend({
    ctor: function( gameLayer ) {
        this._super();
        this.layer=gameLayer;
    },
    startMainMenu: function() {
        this.layer.frontLayer.hideIntro();
        this.selectButton=0;
        this.buttonArr=[];
        this.addIntroButton();
        this.buttonArr[this.selectButton].select();
        this.layer.state=GameLayer.STATES.MAINMENU;
    },
    addIntroButton: function() {
        for( var i=1; i<=GameLayer.BUTTON_NUMBER.MAINMENU; i++ ) {
            this.introButton = new MainMenuButton( this,i );
            this.addChild( this.introButton );
            this.buttonArr.push( this.introButton );
        }
    },    
    hideButtonIntro: function() {
        for( var i=0; i<this.buttonArr.length; i++ )
            this.buttonArr[i].hideThis();
    },
    selectButtonUp: function() {
        if( this.selectButton>0 ) {
            this.buttonArr[this.selectButton].unselect();
            this.selectButton--;
            this.buttonArr[this.selectButton].select();
        }
    },
    selectButtonDown: function() {
        if( this.selectButton<this.buttonArr.length-1 ) {
            this.buttonArr[this.selectButton].unselect();
            this.selectButton++;
            this.buttonArr[this.selectButton].select();
        }
    },
    onKeyDown: function( e ) {
        if( e==32 )
            if( this.selectButton==0 )
                if(this.layer.noteRecorderMode)
                    this.layer.startNoteRecorderMode("music2");
                else
                    this.layer.playingLayer.startGame();
        if( e==38 )
            this.selectButtonUp();
        if( e==40 )
            this.selectButtonDown();
    },
});