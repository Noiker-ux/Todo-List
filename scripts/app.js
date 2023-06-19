'use strict';
const Noiker = "Noiker-ToDo.js"


// функция первой отрисовки при загрузке страницы
window.addEventListener('DOMContentLoaded', ()=>{
    if (localStorage.getItem(Noiker)==null){
        localStorage.setItem(Noiker, JSON.stringify(exampleData));
    }
    const DataArray = JSON.parse(localStorage.getItem(Noiker));
        DataArray.forEach(element => {
            DopDraw(element)
        });
});



// функция дорисовки
function DopDraw(NewTask){
    document.querySelector('.todo__tasks').insertAdjacentHTML('beforeend', `
        <div class="task" id="task${NewTask.id}" data-idtask="${NewTask.id}">
            <div class="checkbox">
                <input class="custom-checkbox" type="checkbox" data-status="${NewTask.active}" data-idTask="${NewTask.id}" id="taskInp${NewTask.id}" name="taskInp${NewTask.id}" value="taskInp${NewTask.id}">
                <label for="taskInp${NewTask.id}">
                    <span class='task__info'>
                        <p class="task__info-title" data-idtaskName="${NewTask.id}" id="title${NewTask.id}">${NewTask.nameTask}</p>
                        <p class="task__info-time">${NewTask.time}</p>
                    </span>   
                </label>
            </div>
            <div class="task__btn">
                <button data-idBtnAdd="${NewTask.id}" id="delete${NewTask.id}" type="button" class="task-right-btn task__btn-del">
                    <img src="./icons/trash-can.png" alt="Delete">
                </button>
                <button data-idBtnUpd="${NewTask.id}" id="update${NewTask.id}" type="button" class="task-right-btn task__btn-update">
                    <img src="./icons/draw.png" alt="Update">
                </button>
            </div>
        </div>
        `);
        checkedboxing(NewTask.id);
        del(NewTask);
        UpdateTask(NewTask);
        chkAct(NewTask);
}


// Активирован чекбокс или нет
function checkedboxing(e){
    let status = document.getElementById(`taskInp${e}`).dataset.status;
    if (status=="true"){
        status=true;
    } else {
        status=false;
    }
    document.getElementById(`taskInp${e}`).checked=status
}
// функция удаления
function del(NewTask){
    document.getElementById(`delete${NewTask.id}`).addEventListener('click',()=>{
        document.getElementById(`task${NewTask.id}`).remove();
        let DataArray = JSON.parse(localStorage.getItem(Noiker));
        const idx = DataArray.findIndex(el=>{
            return el.id==NewTask.id;
        })
        DataArray.splice(idx,1);
        localStorage.setItem(Noiker, JSON.stringify(DataArray));
    })
}
// Открытие попап для редактирования
function UpdateTask(NewTask){
    document.getElementById(`update${NewTask.id}`).addEventListener('click',()=>{
        $.fancybox.open({
            src: '#Updatehidden'
        });
        document.querySelector('.updTask__nameInp').value=NewTask.nameTask;
        let statusUpd = true;
        NewTask.active?statusUpd='Completed':statusUpd='Active';
        document.querySelector('.todo__menu-filter-upd').value=statusUpd;
        document.querySelector('.UpdateTask__buttons-add').setAttribute('data-idUpdate',NewTask.id);
    });
}
// Клик чекбокса
function chkAct(NewTask){
    document.getElementById(`taskInp${NewTask.id}`).addEventListener('change',()=>{
        let DataArray = JSON.parse(localStorage.getItem(Noiker));
        let needCheck = DataArray.findIndex(el=>{
            return el.id==NewTask.id
        })
        if (document.getElementById(`taskInp${NewTask.id}`).checked){
            DataArray[needCheck].active=true;
            document.getElementById(`taskInp${NewTask.id}`).dataset.status=true;
        } else {
            DataArray[needCheck].active=false;
            document.getElementById(`taskInp${NewTask.id}`).dataset.status=false;
        }
        localStorage.setItem(Noiker,JSON.stringify(DataArray));
    })
}
document.querySelector('.UpdateTask__buttons-add').addEventListener('click',()=>{
    const idTaskUpdate =document.querySelector('.UpdateTask__buttons-add').dataset.idupdate
    let valueTitle = document.getElementById('updTask__nameInp').value;
    valueTitle = UpperCaseFirstLetter(valueTitle);

    let statusNewTask = document.getElementById('todo_fileter_upd').value;
    statusNewTask =  BooleanStatus(statusNewTask);

    let DataArray = JSON.parse(localStorage.getItem(Noiker));

    DataArray.forEach(el=>{
        if (el.id == idTaskUpdate){
           el.nameTask = valueTitle;
           el.active = statusNewTask;
        }
    })
    localStorage.setItem(Noiker, JSON.stringify(DataArray));
    document.getElementById(`title${idTaskUpdate}`).textContent=valueTitle;
    document.getElementById(`taskInp${idTaskUpdate}`).checked=statusNewTask;
})








document.getElementById('todo_filter').addEventListener('change',(e)=>{
    let valueFilter = e.target.value;
    let activeArr;
    let DataArray = JSON.parse(localStorage.getItem(Noiker));

    if (valueFilter!='All'){
        let status = BooleanStatus(valueFilter);
        activeArr = DataArray.filter(el=>{
           return el.active===status
        })
    } else {
        activeArr =DataArray;
    };
    console.log(activeArr);
    document.querySelector('.todo__tasks').innerHTML=``;
    activeArr.forEach(el=>{
        DopDraw(el)
    })

});



// функция добавления
document.querySelector('.addTask__buttons-add').addEventListener('click', ()=>{
    if (document.querySelector('.addTask__nameInp').value.trim()!=''){
        // Получаем title задачи и переводим первую букву в верхний регистр
        let valueTitle = document.getElementById('addTask__nameInp').value;
        valueTitle = UpperCaseFirstLetter(valueTitle);
        // Получаем значение активности и переводим в true / false
        let statusNewTask = document.getElementById('todo_fileter_add').value;
        statusNewTask = BooleanStatus(statusNewTask);
        // Получаем строку нынешнего времени
        const timeNewTask = nowTimeDetection();
        // Определяем новый айдишник
        let DataArray = JSON.parse(localStorage.getItem(Noiker));
        const idNewTask = DataArray.reduce((acc,el)=>{
            acc<el.id?acc=el.id:acc;
            return acc;
        },0)+1;
        // Собираем новый объект
        const NewTask = {
            id: idNewTask,
            nameTask: valueTitle,
            active: statusNewTask,
            time: timeNewTask
        }
        // Пушим в массив, закидываем в LS, Скидываем value
        DataArray.push(NewTask);
        localStorage.setItem(Noiker,JSON.stringify(DataArray));
        document.querySelector('.addTask__nameInp').value=``;
        // Отрисовка только нового объекта
        DopDraw(NewTask);
        $.fancybox.close();
        
    }
});

// функция active=false completed=true
function BooleanStatus(status){
    status=="Active"?status=false:status=true;
    return status;
}

// Заглваная буква
function UpperCaseFirstLetter(str){
    return str.charAt(0).toUpperCase() + str.slice(1); 
}
// функция возврата строки 
function nowTimeDetection(){
    const nowDate = new Date();
    let str = nowDate.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
    const MonthNow = nowDate.getMonth().toLocaleString().padStart(2,'0');
    const DateNow = nowDate.getDate().toLocaleString().padStart(2,'0');
    const YearNow = nowDate.getFullYear();
    str += `, ${MonthNow}/${DateNow}/${YearNow}`;
    return str
}
// Открыть попап добавления
document.querySelector('.todo__menu-add').addEventListener('click', ()=>{
	$.fancybox.open({
		src: '#Addhidden'
	});
});
// выйти из попап добавления
document.querySelector('.addTask__buttons-close').addEventListener('click',()=>{
    $.fancybox.close();
});
document.querySelector('.UpdateTask__buttons-close').addEventListener('click',()=>{
    $.fancybox.close();
})
