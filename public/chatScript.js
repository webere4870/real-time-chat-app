let selected = null
let currentRoom = null
let roomList = []
let currentUser = ""
let talkingToWho = null
let socket = io("localhost:3000")

function toast(messageProfile)
{
    let newToast = `
    
        <h5 class="statusText">${messageProfile.from} sent a message</h5>
        <svg xmlns="http://www.w3.org/2000/svg" style="margin-left: auto;" width="20" height="20" fill="white" class="bi bi-x-circle toastRemove" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
    `
    let toaster = document.createElement('div')
    toaster.className = "toast"
    toaster.innerHTML = newToast
    fetch("/notifications", {
        method: "post",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(messageProfile)
    }).then((result)=>
    {
        document.querySelector("#container").prepend(toaster)
    })
}

socket.on("roomMessage", (messageProfile)=>
{
    console.log(messageProfile, "profiler")
    if(messageProfile.to === talkingToWho)
    {
        let li = document.createElement("li")
        newLi = messageWriter(messageProfile, li)
        document.querySelector("#chat").appendChild(newLi)
        const element = document.getElementById("chat");
        element.scrollTop = element.scrollHeight;
    }
    else
    {
        if(messageProfile.from === talkingToWho)
        {
            let li = document.createElement("li")
            newLi = messageWriter(messageProfile, li)
            document.querySelector("#chat").appendChild(newLi)
            const element = document.getElementById("chat");
            element.scrollTop = element.scrollHeight;
        }
        else
        {
            toast(messageProfile)
        }
    }
    
})

socket.on("getUsername", async (evt)=>
{
    let username = await fetch("/getUsername")
    let json = await username.json()
    console.log(json.email)
    currentUser = json.email
    socket.emit("username", json.email)
    

    let userList = fetch('/userList').then(async (result)=>
    {
        let newRes = await result.json()
        roomList = newRes.activityList
        currentUser = newRes.username
        for(let temp of roomList)
        {
            console.log("here room")
            socket.emit("newRoom", temp)
        }
        for(let temp of roomList)
        {
            socket.emit("userStatus", {currentUser: currentUser, room: temp, active: true})
        }
    })
})
let changeActivity = fetch("/changeActivity?active=true").then((email)=>
{
    email.json().then(async (result)=>
    {
        
    })
})


socket.on("userStatus", (statusObject)=>
{
    console.log(statusObject)
    if(statusObject.active == true)
    {
        console.log("Active")
        $('li').attr("data-id", statusObject.user).find("span").attr("class", "status green")
        $('li').attr("data-id", statusObject.user).find(".statusText").text("Online")
        // $(`li[data-id="${statusObject.user}"] span`).attr("class", "status green")
        // $(`li[data-id="${statusObject.user}"] .statusText`).text("Online")
    }
    else
    {
        console.log("Inavtive")
        $('li').attr("data-id", statusObject.user).find("span").attr("class", "status orange")
        $('li').attr("data-id", statusObject.user).find(".statusText").text("Offline")
        // $(`li[data-id=${statusObject.user}] span`).attr("class", "status orange")
        // $(`li[data-id=${statusObject.user}] .statusText`).text("Offline")
    }
})





function messageWriter(message, li, jsonList)
{
    console.log(message)
    if(message.from == currentUser)
    {
        li.innerHTML = `<li class="me">
        <div class="entete">
            <h3>${message.datetime}</h3>
            <h2>${message.from}</h2>
            
        </div>
        <div class="triangle"></div>
        <div class="message">
            ${message.message}
        </div>
    </li>`
    }
    else
    {
        li.innerHTML = `<li class="you">
        <div class="entete">
            <h3>${message.datetime}</h3>
            <h2>${message.from}</h2>
            
        </div>
        <div class="triangle"></div>
        <div class="message">
            ${message.message}
        </div>
    </li>`
    }
    return li
}
    

$().ready(()=>
{
    $("#bell").click((evt)=>
    {
        $("#notifications").slideToggle(300)
    })
    $("#bellClose").click((evt)=>
    {   
        $("#notifications").slideToggle(300)
    })
    $("#container").on("click", ".toast svg", (evt)=>
    {
        $(evt.currentTarget).parent().remove()
    })
    $("#overDrop").on("click", ">li", async (evt)=>
    {
        let chatList = await fetch(`/messages?username=${$(evt.currentTarget).attr("data-id")}`)
        talkingToWho = $(evt.currentTarget).attr("data-id")
        selected = $(evt.currentTarget).attr("data-id")
        let jsonList = await chatList.json()
        console.log(jsonList)
        let roomName = [selected, jsonList.current]
        roomName.sort()
        let newRoomString = ""
        for(let temp of roomName)
        {
            newRoomString += temp
        }
        socket.emit("newRoom", newRoomString)

        while (document.querySelector("#chat").firstChild) {
            document.querySelector("#chat").removeChild(document.querySelector("#chat").firstChild)
        }

        for(let message of jsonList.chatList)
        {
            let li = document.createElement("li")
            newLi = messageWriter(message, li, jsonList)
            document.querySelector("#chat").appendChild(newLi)
        }
        const element = document.getElementById("chat");
        element.scrollTop = element.scrollHeight;


        $("#send").click((evt)=>
        {
            let messageProfile = {current: jsonList.current, other: jsonList. other, message: $("#message").val(), to: jsonList.other, from: jsonList.current}
            socket.emit("roomMessage", messageProfile)
        })
    })
    $('#innerDropDown').on("click", "li", async (evt)=>
    {
        let chatList = await fetch(`/messages?username=${$(evt.currentTarget).attr("id")}`)
        talkingToWho = $(evt.currentTarget).attr("id")
        selected = $(evt.currentTarget).attr("id")
        let jsonList = await chatList.json()
        console.log(jsonList)
        let roomName = [selected, jsonList.current]
        roomName.sort()
        let newRoomString = ""
        for(let temp of roomName)
        {
            newRoomString += temp
        }
        socket.emit("newRoom", newRoomString)
        while (document.querySelector("#chat").firstChild) {
            document.querySelector("#chat").removeChild(document.querySelector("#chat").firstChild)
        }

        for(let message of jsonList.chatList)
        {
            let li = document.createElement("li")
            newLi = messageWriter(message, li, jsonList)
            document.querySelector("#chat").appendChild(newLi)
        }
        const element = document.getElementById("chat");
        element.scrollTop = element.scrollHeight;

        $("#send").click((evt)=>
        {
            let messageProfile = {current: jsonList.current, other: jsonList. other, message: $("#message").val(), to: jsonList.other, from: jsonList.current}
            socket.emit("roomMessage", messageProfile)
        })
    })


    $('#search').on('input', async function() {
        // do something
        let userList = await fetch(`/users?username=${$("#search").val()}`)
        let json = await userList.json()
        let userArr = json.userList
        for(let temp of userArr)
        {
            let li = document.createElement("li")
            li.id = temp._id
            li.innerHTML = 
            `<img src="${temp.picture}" alt="">
            <div>
                <h2>${temp.name}</h2>
                <h3>
                    <span class="status green"></span>
                    online
                </h3>
            </div>`
            document.querySelector("#innerDropDown").appendChild(li)
        }
    });
    $("#search").on("focus", (evt)=>
    {
        $("#overDrop").css("overflow-y", "hidden")
        $("#dropDown").slideToggle(400)
    })

    $("#innerDropDown svg").click((evt)=>
    {
        $("#overDrop").css("overflow-y", "scroll")
        $("#dropDown").slideToggle(400)
    })

    // $("#search").focusout((evt)=>
    // {
    //     $("ul").css("overflow-y", "hidden")
    //     $("#dropDown").slideToggle(400)
    // })
})
