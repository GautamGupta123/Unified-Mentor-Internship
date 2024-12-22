const socket=io()

let username;
let chat=document.querySelector('.chats')
let user_count=document.querySelector('.user-count')
let user_list=document.querySelector('.user-list')
let user_msg=document.querySelector('#user-message')
let usermsg_send=document.getElementById('usermsg-send')
do{
    username=prompt("Enter your Name:")
}while(!username)


socket.emit("new-user-joined",username)

socket.on('user-connected',(socket_name)=>{
    userjoined(socket_name,'joined')
});

function userjoined(name,status){
       let div=document.createElement("div")
       div.classList.add('user-join')
       let content=`<p><b>${name}</b> ${status} the chat</p>` 
       div.innerHTML=content
       chat.appendChild(div)
       chat.scrollTop=chat.scrollHeight
}

socket.on('user-disconnected',(user)=>{
    userjoined(user,'left')
});

socket.on('user-list',(users)=>{
    user_list.innerHTML=""
    users_arr=Object.values(users)
    for(let i=0;i<users_arr.length;i++){
        let p=document.createElement("p")
        p.innerText=users_arr[i]
        user_list.appendChild(p);
    }
    user_count.innerHTML=users_arr.length;
});

usermsg_send.addEventListener('click',()=>{
    let data={
        user:username,
        msg:user_msg.value
    };
    if(user_msg.value!=''){
        appendmsg(data,'outgoing')
        socket.emit('message',data)
        user_msg.value='';
    }
})
function appendmsg(data,status){
    let div=document.createElement('div')
    div.classList.add('message',status);
    let content=`
       <h5>${data.user}</h5>
       <p>${data.msg}</p>
    `;
    div.innerHTML=content
    chat.appendChild(div)
    chat.scrollTop=chat.scrollHeight
}

socket.on('message',(data)=>{
    appendmsg(data,'incoming')
})