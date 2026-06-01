// import { RedisAdapter } from "socket.io-redis";
// import { createClient } from "redis";

// // Create Redis clients
// const pubClient = createClient({ host: process.env.REDIS_HOST || 'localhost', port: process.env.REDIS_PORT || 6379 });
// const subClient = pubClient.duplicate();

// // Handle Redis connection errors
// pubClient.on('error', (err) => console.error('Redis Pub Client Error:', err));
// subClient.on('error', (err) => console.error('Redis Sub Client Error:', err));

// // Create and export the adapter
// export const getRedisAdapter = () => {
//     return new RedisAdapter(pubClient, subClient);
// };


import { Server }
from "socket.io";

let io;



export const initSocket =
  (server) => {

    io = new Server(

      server,

      {

        cors: {

          origin:
            "http://localhost:5173",

          methods: [

            "GET",

            "POST",

            "PUT",

            "DELETE"
          ],

          credentials: true
        }
      }
    );





    io.on(

      "connection",

      (socket) => {

        console.log(

          "USER CONNECTED:",

          socket.id
        );





        socket.on(

          "disconnect",

          () => {

            console.log(
              "USER DISCONNECTED"
            );
          }
        );
      }
    );





    return io;
  };





export const getIO =
  () => {

    if (!io) {

      throw new Error(
        "Socket.io not initialized"
      );
    }

    return io;
  };