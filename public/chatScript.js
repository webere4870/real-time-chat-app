$().ready(()=>
{
    $('#innerDropDown').on("click", "li", async (evt)=>
    {
        let chatList = await fetch(`/messages?username=${$(evt.currentTarget).attr("id")}`)
        
        let jsonList = await chatList.json()
        console.log(jsonList)

        while (document.querySelector("#innerDropDown").firstChild) {
            parent.removeChild(parent.firstChild);
        }
    
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
