import { Server } from "socket.io";

function initializeSocket(server:any) {
    const io = new Server(server, {
        cors: {
            origin:"http://localhost:5173"
        }
    }
        
    )
    io.on("connection", (socket) => {
        console.log("Socket connected", socket.id);
        
        socket.on("room:join", (data) => {
            const { tutor, room } = data;
            io.to(room).emit("user:joined", { tutor, id: socket.id });
            socket.join(room);
            io.to(socket.id).emit("room:join", data);
        });
        
        socket.on('user:call', ({ to, offer }) => {
            console.log("user:call");
            
            io.to(to).emit("incomming:call", {
                from:socket.id,offer
              })
        })

        socket.on("call:accepted", ({ to, ans }) => {
            io.to(to).emit("call:accepted", {
                from:socket.id,ans
              })
        })

        socket.on("peer:nego:needed", ({ to, offer }) => {
            io.to(to).emit("peer:nego:needed", {
                from:socket.id,offer
              })
        })

        socket.on("peer:nego:done", ({ to, ans }) => {
            console.log(`Peer negotiation done from ${socket.id} to ${to}, ans:`, ans);
            io.to(to).emit("peer:nego:final", {
                from:socket.id,ans
              })
        })

        socket.on('startScreenShare', ({ to }) => {
            console.log(`User ${socket.id} started screen share for ${to}`);
            io.to(to).emit('startScreenShare', { from: socket.id });
          });
        
          // Handle user stopping screen share
          socket.on('stopScreenShare', ({ to }) => {
            console.log(`User ${socket.id} stopped screen share for ${to}`);
            io.to(to).emit('stopScreenShare', { from: socket.id });
          });

    })

}

export default initializeSocket