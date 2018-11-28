window.addEventListener('DOMContentLoaded', function(){

    //load from LocalStorage
    let localValue = localStorage.getItem("ToDoList"),
        table = document.querySelector('#content');

    table.innerHTML = localValue;
    if (localValue) {
        for (let i = 0; i < table.childNodes.length; i++) {
            table.childNodes[i].childNodes[0].childNodes[0].value = localStorage.getItem("ToDo_tr"+i+"td_0");
            table.childNodes[i].childNodes[1].childNodes[0].value = localStorage.getItem("ToDo_tr"+i+"td_1");
        }
    }


    //Textarea resize
    function flexibleTextarea(textarea){
        if (textarea) {
            textarea.style.overflow = "hidden";
            let textareaRows = textarea.rows = textarea.rows > 0 ? textarea.rows : 1,
                textareaCols = textarea.cols = textarea.cols > 0 ? textarea.cols : 50,
                reg1 = RegExp("([^\r\n]{" + textareaCols + "})([^\r\n])"),
                reg2 = RegExp("[^\n]{" + textareaCols + "}\n?$|[^\n]{0," + textareaCols + "}\n");
            textarea.onkeyup = textarea.onkeydown = function () {
                textarea.value = textarea.value.replace(reg1, "$1\r\n$2");
                for (var i = 0, textareaValue = textarea.value; textareaValue.search(reg2) >= 0;) {
                    i++;
                    textareaValue = textareaValue.replace(reg2, "");
                }
                i+= 2;
                if (i < textareaRows) i = textareaRows;
                textarea.rows = i-1;
            };
        }
    }

    //Check button

    table.addEventListener('click', function(event){
        if (event.target && event.target.matches('button.button_check')){
            let currentTr = event.target.parentNode.parentNode;
            if (event.target.classList.contains("button_check__true")){
                event.target.classList.remove("button_check__true");
                currentTr.querySelectorAll('.textarea')[0].style.textDecoration = "none";
                currentTr.querySelectorAll('.textarea')[1].style.textDecoration = "none";
            } else {
                event.target.classList.add("button_check__true");
                currentTr.querySelectorAll('.textarea')[0].style.textDecoration = "line-through";
                currentTr.querySelectorAll('.textarea')[1].style.textDecoration = "line-through";
            }
              
        }
    });

    //AddNew button
    let addNew = document.querySelector('#addNew');

    addNew.addEventListener('click', function(event){
        let newTr = document.createElement('tr'),
            ths = document.querySelectorAll('th'),
            col_1 = Math.floor(parseInt(getComputedStyle(ths[0]).width)*0.9/8),
            col_2 = Math.floor(parseInt(getComputedStyle(ths[1]).width)*0.9/8);

        newTr.classList.add("tr");
        table.appendChild(newTr);

        newTr.innerHTML = '<td class="td1">'+
        '<textarea class="textarea" placeholder="task title" id="textarea_1" rows="1" cols="'+col_1+'"></textarea>'+
        '</td><td class="td2">'+
        '<textarea class="textarea"placeholder="task description" id="textarea_2" rows="1" cols="'+col_2+'"></textarea>'+
        '</td><td class="td3"><button class="button button_check"></button>'+
        '<button class="button button_delete"></button></td>';
        let textarea = newTr.querySelectorAll('.textarea');
        flexibleTextarea(textarea[0]);
        flexibleTextarea(textarea[1]);

    });

    //Delete button
    table.addEventListener('click', function(event){
        if (event.target && event.target.matches('button.button_delete')){
            let currentTr = event.target.parentNode.parentNode;
            table.removeChild(currentTr);

        }
    });

    //sort by title
    let sortByTitle = document.querySelector('#sort'),
        todotable = document.querySelector('#todotable');

    sortByTitle.addEventListener('click', function(){
        let rowsArray = [].slice.call(table.rows),
            compare = function(rowA, rowB) {
                if (rowA.childNodes[0].childNodes[0].value > rowB.childNodes[0].childNodes[0].value) {
                    return 1;
                } else {
                    return -1;
                }
            };

        rowsArray.sort(compare);

        todotable.removeChild(table);

        for (let i = 0; i < rowsArray.length; i++) {
            table.appendChild(rowsArray[i]);
        }

        todotable.appendChild(table);

    });

});

//save in LocalStorage

window.addEventListener('beforeunload', function(){
    try
    {
        let tb = document.getElementById("content"),
            mas = [];
        if (tb.childNodes.length > 0) {
            localStorage.setItem("ToDoList", tb.innerHTML);
            mas.push("ToDoList");
            for (let i = 0; i < tb.childNodes.length; i++) {
                localStorage.setItem("ToDo_tr"+i+"td_0", tb.childNodes[i].childNodes[0].childNodes[0].value);
                mas.push("ToDo_tr"+i+"td_0");
                localStorage.setItem("ToDo_tr"+i+"td_1", tb.childNodes[i].childNodes[1].childNodes[0].value);
                mas.push("ToDo_tr"+i+"td_1");   
            }
            localStorage.setItem("mas", mas);
        } else {
            let m = localStorage.getItem("mas").split(',');
            for (let i = 0; i < m.length; i++) {
                localStorage.removeItem(m[i]);
            }
            localStorage.removeItem("mas");
        }
    }
    catch (e)
    {
        console.log("some problems");
    }
        

});
