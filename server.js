const express = require('express');
// const cors =  require('cors');
const app =  express();
  
var http = require('http').createServer(app);
const io = require("socket.io")(http, {
    cors: {
        origin:"http://localhost:4200/",
        methods: ["GET", "POST"]
    }
  });

app.get('/',(req,res)=>
{
    res.send("hello");
});
let userList = new Map();
io.on("connection", socket => { 
    
    let userName = socket.handshake.query.userName;
    addUser(userName,socket.id);
    socket.broadcast.emit("user-list", [...userList.keys()]);
    socket.emit("user-list", [...userList.keys()]);
    

    socket.on("message",(msg) =>
    {
        socket.broadcast.emit("message-broadcast",{message:msg,userName : userName});
    });

    socket.on("ketthuc",(msg) =>
    {
        socket.broadcast.emit("ketthuc-broadcast",{message:msg,userName : userName});
    });
    socket.on("disconnect", (reason)=>
    {
        removeUser(userName,socket.id);
    });
});
function addUser(userName,id)
{
    if(!userList.has(userName))
    {
        userList.set(userName,new Set(id));
    }
    else
    {
        userList.get(userName).add(id);
    }
}
function removeUser(userName,id)
{
    if(userList.has(userName))
    {
        let userId = userList.get(userName);
        if(userId.size == 0)
        {
            userList.delete(userName);
        }
    }
}
http.listen('3000',()=>
{
    console.log("server listen");
})