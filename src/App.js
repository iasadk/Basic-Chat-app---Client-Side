import './App.css';
import { useState, useRef, useEffect } from "react";
import io from "socket.io-client";
const socket = io.connect("http://localhost:3001");

function App() {
  const [room, setRoom] = useState("")
  const [message, setMessage] = useState("")
  const [user, setUser] = useState("")
  const [chats, setChats] = useState([]);
  const [show, setShow] = useState(false)



  const sendMessage = () => {
    if (message != "") {
      let messageData = {
        message, "sender": user, room,
        "time": new Date(Date.now()).getHours()
          + ":" +
          ((new Date(Date.now()).getMinutes() < 10) ? "0" + new Date(Date.now()).getMinutes() : new Date(Date.now()).getMinutes())
      }
      socket.emit("sendMsgToServer", messageData);
      setMessage("")
      setChats((list) => [...list, messageData])
    }

  }

  const handleRoom = () => {
    if (room != "" && user != "") {
      socket.emit("joinRoom", room)
      setShow(true);
    }
    else {
      console.log(`No room!!!`)
    }
  }

  useEffect(() => {
    socket.on("sendMsgToClient", (data) => {
      console.log(data)
      setChats((list) => [...list, data])
    })
  }, [socket])
  return (
    <div>

      <div className='gradientDiv'/>
      <div className='font-bold text-5xl text-center'>{!show ? "Join" : "Start"} Chat</div>

      {!show && <div className="mt-2 flex items-center flex-col gap-y-6 bg-slate-800 p-4 rounded-lg">
        <input placeholder="Enter username" type="text" className=" bg-gray-200 px-3 py-2 outline-none focus:border-gray-500 focus:border-[0.1px]" onChange={(e) => setUser(e.target.value)} />
        <input placeholder="Enter Room Id" type="text" className=" bg-gray-200 px-3 py-2 outline-none focus:border-gray-500 focus:border-[0.1px]" onChange={(e) => setRoom(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleRoom()} />
        <button className="bg-slate-400 px-3 py-2 w-full" onClick={handleRoom} >Join Room</button>

      </div>}

      {show && <div className="mt-2 p-2 max-w-[350px]">
        <div className='bg-slate-200 p-2 '>Message</div>
        <div className='min-h-[350px] h-[350px]  max-w-[300px] p-2 overflow-y-auto overflow-x-hidden bg-gray-100 messageContainer'>
          {chats.map((chat, idx) => {
            return (
              <div key={idx} className={`flex ${chat.sender === user ? "flex-row-reverse" : ""}`}>
                <div className={`${chat.sender === user ? "text-right" : "text-left"} bg-slate-800 text-white mb-2 px-2 py-2 rounded-md ${chat.sender === user ? "rounded-br-none" : "rounded-bl-none"} max-w-[250px] min-w-[100px] `}>
                  {chat.message}
                  <div className='text-[10px] font-semiBold text-gray-400'>
                    sent by: {chat.sender === user ? "You" : chat.sender} {chat.time}
                  </div>
                </div>

              </div>
            )
          })}
        </div>
        <div className='shadow-2xl'>
          <input placeholder="Message" type="text" className="bg-gray-200 px-3 py-2 outline-none " onChange={(e) => setMessage(e.target.value)} value={message} onKeyPress={(e) => e.key === "Enter" && sendMessage()} />
          <button className="bg-slate-400 px-3 py-2" onClick={sendMessage}>Send</button>
        </div>
      </div>}
    </div>
  );
}

export default App;
