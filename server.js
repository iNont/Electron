var io = require('socket.io').listen(8080);
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
console.log('>>>>>>>>>> ELECTRON <<<<<<<<<<'.bold.yellow);

io.sockets.on('connection', function(socket) {
    socket.on('regis', function() {
        console.log(string.message+'New Player Connected'.bold);
        console.log(string.info+'ID : '.bold+this.id);
        clients.push(this.id);
        //io.sockets.socket(clients[0]).emit('test');
    });
    socket.on('findMatch', function() {
    	if( waiting == null )
    		waiting = this.id;
    	else {
	    	io.sockets.socket(this.id).emit('startGame' , waiting);
	    	io.sockets.socket(waiting).emit('startGame' , this.id);
    	}
    });
    socket.on('disconnect', function() {
        var IDdisconnect = null;
        for( var i=0;i<clients.length;i++){
        	if(clients[i].sessionID == this.id){
                console.log(string.info+"Disconnect ID : ".bold.red+clients[i].sessionID);
                IDdisconnect = clients[i].sessionID;
    			clients.splice(i, 1);
    			break;
    		}
        }
        socket.broadcast.emit('disconnect',IDdisconnect);
    });
});  