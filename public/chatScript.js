let selected = null
let currentRoom = null
let socket = io("localhost:3000")
$().ready(()=>
{
    $('#innerDropDown').on("click", "li", async (evt)=>
    {
        let chatList = await fetch(`/messages?username=${$(evt.currentTarget).attr("id")}`)
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

        function messageWriter(message, li)
        {
            console.log(message)
            if(message.to == jsonList.current)
            {
                li.innerHTML = `<li class="me">
                <div class="entete">
                    <h3>${message.datetime}</h3>
                    <h2>${jsonList.currentName}</h2>
                    <img src='${jsonList[jsonList.current]}' alt='' class='statusPic'>
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
                    <h2>${jsonList.otherName}</h2>
                    <img src='${jsonList[jsonList.other]}' alt='' class='statusPic'>
                </div>
                <div class="triangle"></div>
                <div class="message">
                    ${message.message}
                </div>
            </li>`
            }
            return li
        }
    
        for(let message of jsonList.chatList)
        {
            let li = document.createElement("li")
            newLi = messageWriter(message, li)
            document.querySelector("#chat").appendChild(newLi)
        }
        const element = document.getElementById("chat");
        element.scrollTop = element.scrollHeight;

        socket.on("roomMessage", (messageProfile)=>
        {
            let li = document.createElement("li")
            newLi = messageWriter(messageProfile, li)
            document.querySelector("#chat").appendChild(newLi)
            const element = document.getElementById("chat");
            element.scrollTop = element.scrollHeight;
        })

        $("#send").click((evt)=>
        {
            let messageProfile = {current: jsonList.current, other: jsonList. other, message: $("#message").val(), to: jsonList.other, from: jsonList.current}
            socket.emit("roomMessage", messageProfile)
        })
    })

    $("#send").click(async (evt)=>
    {
        
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
