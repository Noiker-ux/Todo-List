'use strict';
const Noiker = "Noiker-ToDo.js"


window.addEventListener('DOMContentLoaded', ()=>{
    if (localStorage.getItem(Noiker)==null){
        localStorage.setItem(Noiker, JSON.stringify(exampleData));
    }
    const DataArray = JSON.parse(localStorage.getItem(Noiker));
    DataArray.forEach(element => {
        document.querySelector('.todo__tasks').insertAdjacentHTML('beforeend', `
        <div class="task" data-idtask=${element.id}>
            <div class="checkbox">
                <input class="custom-checkbox" type="checkbox" data-status=${element.active} data-idTask="${element.id}" id="task${element.id}" name="task${element.id}" value="task${element.id}">
                <label for="task${element.id}">
                    <span class='task__info'>
                        <p class="task__info-title" data-idtaskName="${element.id}">${element.nameTask}</p>
                        <p class="task__info-time">${element.time}</p>
                    </span>   
                </label>
            </div>
            <div class="task__btn">
                <button data-idBtnAdd="${element.id}" type="button" class="task-right-btn task__btn-del">
                    <img src="./icons/trash-can.png" alt="Delete">
                </button>
                <button data-idBtnUpd="${element.id}" type="button" class="task-right-btn task__btn-update">
                    <img src="./icons/draw.png" alt="Update">
                </button>
            </div>
        </div>
        `);
    });
    checkedboxing();
    UpdateTask();
});


function checkedboxing(){
    document.querySelectorAll('.custom-checkbox').forEach(e=>{
        let status = e.dataset.status;
        if (status=="true"){
            e.checked=true;
        } else {
            e.checked=false;
        }
    });
}

// Открытие попап для редактирования
function UpdateTask(){
    document.querySelectorAll('.task__btn-update').forEach(el=>{
         el.addEventListener('click', ()=>{
            const idTaskUpdate = el.dataset.idbtnupd;
            const DataArray = JSON.parse(localStorage.getItem(Noiker));
            let task = DataArray.find(el=>{
                return el.id==idTaskUpdate;
            })
            $.fancybox.open({
                src: '#Updatehidden'
            });
            document.querySelector('.updTask__nameInp').value=task.nameTask;
            let statusUpd = true;
            task.active?statusUpd='Completed':statusUpd='Active';
            document.querySelector('.todo__menu-filter-upd').value=statusUpd;
            document.querySelector('.UpdateTask__buttons-add').setAttribute('data-idUpdate',idTaskUpdate);
         });
    })
}

document.querySelectorAll('.UpdateTask__buttons-add').forEach(e=>{
    e.addEventListener('click', ()=>{
            const idTaskUpdate = e.dataset.idupdate;

            let valueTitle = document.getElementById('updTask__nameInp').value;
            valueTitle = UpperCaseFirstLetter(valueTitle);
        
            let statusNewTask = document.getElementById('todo_fileter_upd').value;
            statusNewTask =  BooleanStatus(statusNewTask);
        
            let DataArray = JSON.parse(localStorage.getItem(Noiker));
        
            const updTask = DataArray.find(el=>{
                return el.id == idTaskUpdate;
            })
            updTask.nameTask = valueTitle;
            updTask.active = statusNewTask;
            localStorage.setItem(Noiker, JSON.stringify(DataArray));
            reDraw(idTaskUpdate,valueTitle,statusNewTask);
            
    });
})
function reDraw(idRedr,valueTitle,status){
    let DataArray = JSON.parse(localStorage.getItem(Noiker));
    document.querySelectorAll('.task__info-title').forEach(e=>{
        if (e.dataset.idtaskname==idRedr){
            e.textContent=valueTitle;
            console.log(e.parentNode);
        }
    })
    document.querySelectorAll('.custom-checkbox').forEach(e=>{
        if (e.dataset.idtask==idRedr){
            e.checked=status;
            e.dataset.status=status;
        }
    })
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
// функция дорисовки
function DopDraw(NewTask){
    document.querySelector('.todo__tasks').insertAdjacentHTML('beforeend', `
        <div class="task">
            <div class="checkbox">
                <input class="custom-checkbox" type="checkbox" data-status=${NewTask.active} data-idTask="${NewTask.id}" id="task${NewTask.id}" name="task${NewTask.id}" value="task${NewTask.id}">
                <label for="task${NewTask.id}">
                    <span class='task__info'>
                        <p class="task__info-title">${NewTask.nameTask}</p>
                        <p class="task__info-time">${NewTask.time}</p>
                    </span>   
                </label>
            </div>
            <div class="task__btn">
                <button data-idBtnAdd="${NewTask.id}" type="button" class="task-right-btn task__btn-del">
                    <img src="./icons/trash-can.png" alt="Delete">
                </button>
                <button data-idBtnUpd="${NewTask.id}" type="button" class="task-right-btn task__btn-update">
                    <img src="./icons/draw.png" alt="Update">
                </button>
            </div>
        </div>
        `);
        checkedboxing();
}
// Заглваная буква
function UpperCaseFirstLetter(str){
    return str.charAt(0).toUpperCase() + str.slice(1); 
}
// функция active=false completed=true
function BooleanStatus(status){
    status=="Active"?status=false:status=true;
    return status;
}




// функция добавления
document.querySelector('.addTask__buttons-add').addEventListener('click', ()=>{
    if (document.querySelector('.addTask__nameInp').value.trim()!=''){

        let valueTitle = document.getElementById('addTask__nameInp').value;
        valueTitle = UpperCaseFirstLetter(valueTitle);

        let statusNewTask = document.getElementById('todo_fileter_add').value;
        statusNewTask = BooleanStatus(statusNewTask);

        const timeNewTask = nowTimeDetection();
        let DataArray = JSON.parse(localStorage.getItem(Noiker));
        const idNewTask = DataArray.reduce((acc,el)=>{
            acc<el.id?acc=el.id:acc;
            return acc;
        },0)+1;
        console.log(idNewTask);
        const NewTask = {
            id: idNewTask,
            nameTask: valueTitle,
            active: statusNewTask,
            time: timeNewTask
        }
        DataArray.push(NewTask);
        localStorage.setItem(Noiker,JSON.stringify(DataArray));
        document.querySelector('.addTask__nameInp').value=``;
        DopDraw(NewTask);
        $.fancybox.close();
        UpdateTask();
        checkedboxing();
    }
});




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
