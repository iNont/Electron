var io = require('socket.io').listen(8080, {
    log: 0,
});
var colors = require('colors');

var clients = [];
var waiting = null;
var string = {
    info:'   info    - '.bold.green,
    message:'   message - '.bold.blue,
    update:'   update  - '.bold.cyan,
}
var datetime = new Date().toISOString();

console.log('Date: '.underline.bold.red+datetime.bold.yellow);
console.log('>>>>>>>>>>|| ELECTRON ||<<<<<<<<<<'.bold.yellow);

io.sockets.on('connection', function(socket) {
    socket.on('regis', function() {
        console.log(string.message+'New Player Connected'.bold);
        console.log(string.info+'ID : '.bold+this.id);
        clients.push(this.id);
        //io.sockets.socket(clients[0]).emit('test');
    });
    socket.on('findMatch', function() {
        console.log(string.message+'Player finding match'.bold);
        console.log(string.info+'ID : '.bold+this.id);
    	if( waiting == null )
    		waiting = this.id;
    	else {
            console.log(string.message+'Match start'.bold);
            console.log(string.info+'ID : '.bold+waiting);
            console.log(string.info+'ID : '.bold+this.id);
	    	io.sockets.socket(this.id).emit('startGame' , waiting);
	    	io.sockets.socket(waiting).emit('startGame' , this.id);
            waiting = null;
    	}
    });
    socket.on('stopFinding', function() {
        if( waiting == this.id ) {
            console.log(string.message+'Player stop finding match'.bold);
            console.log(string.info+'ID : '.bold+this.id);
            waiting = null;
        }
    });
    socket.on('sendBattleItem', function( itemKey,enemy ) {
        console.log(string.message+'Player use item '.bold+itemKey);
        console.log(string.info+'Sender   ID : '.bold+this.id);
        console.log(string.info+'Receiver ID : '.bold+enemy);
        io.sockets.socket(enemy).emit('effectBattleItem' , itemKey);
    });
    socket.on('endGame', function( enemyID,name,score,maxCombo,perfect,great,cool,miss ) {
        socket.endStatus = ['showEnemyScore', name,score,maxCombo,perfect,great,cool,miss];
        var enemy = io.sockets.socket(enemyID);
        if( enemy.endStatus != null ) {
            console.log(string.message+'Match end'.bold);
            console.log(string.info+'ID : '.bold+enemyID);
            console.log(string.info+'ID : '.bold+this.id);

            socket.emit.apply(socket, enemy.endStatus);
            enemy.emit.apply(enemy, socket.endStatus);
            enemy.endStatus = null;
            socket.endStatus = null;
        }
    });
    socket.on('disconnect', function() {
        for( var i=0;i<clients.length;i++){
        	if(clients[i] == this.id) {
                if( waiting == this.id )
                    waiting = null;
                console.log(string.info+"Disconnect ID : ".bold.red+clients[i]);
    			clients.splice(i, 1);
    			break;
    		}
        }
    });
});  