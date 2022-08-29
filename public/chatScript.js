$().ready(()=>
{
    $('#search').on('input', async function() {
        // do something
        let userList = await fetch(`/users?username=${$("#search").val()}`)
        let json = await userList.json()
        let userArr = json.userList
        for(let temp of userArr)
        {
            let li = document.createElement("li")
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
