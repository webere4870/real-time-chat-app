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
            let li
            if(message.from == message.current)
            {
                li = `<li class="me">
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
                li = `<li class="you">
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
        }
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
            document.querySelector("#innerDropDown").append(li)
        }
    });
    $("#search").on("focus", (evt)=>
    {
        $("ul").css("overflow-y", "hidden")
        $("#dropDown").slideToggle(400)
    })

    $("#innerDropDown svg").click((evt)=>
    {
        $("#dropDown").slideToggle(400)
    })

    // $("#search").focusout((evt)=>
    // {
    //     $("ul").css("overflow-y", "hidden")
    //     $("#dropDown").slideToggle(400)
    // })
})
