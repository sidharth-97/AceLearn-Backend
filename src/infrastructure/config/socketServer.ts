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

    })

}

export default initializeSocket