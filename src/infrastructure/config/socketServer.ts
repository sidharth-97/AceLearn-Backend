import { Server } from "socket.io";

function initializeSocket(server:any) {
    const io = new Server(server, {
        cors: {
            origin:"http://localhost:5173"
        }
    }
        
    )

}

export default initializeSocket