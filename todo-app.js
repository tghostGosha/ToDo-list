
(function(){
    //создаем и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;   
    }

    //Функция чтения локального хранилища
    let parseFromLocalStorage = function(title){
        let getItemString = window.localStorage.getItem(title);
        let getItemObj = JSON.parse(getItemString);
        return getItemObj;
    }

    let localStorageAsObject;
    //создаем и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');
        button.id = 'btn';        //////
        button.disabled = true;
        input.addEventListener('input', function(){
            
            if(input.value.length > 0){
                document.getElementById('btn').disabled = false
            }
            else{
                document.getElementById('btn').disabled = true 
            }
        })

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return{
            form,
            input,
            button,
        };
    }

    //создаем и возвращаем список элементов
    function createRodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(nameAndDoneAndIndex, title){
        let item = document.createElement('li');
        item.setAttribute('id', nameAndDoneAndIndex.id);
        //кнопки помещаем в элемент, который красиво покажет их в одной группе
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');
    
        //устанавливаем стили для элемента списка, а также для размещения кнопок
        //в его правой части с помощью flex
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = nameAndDoneAndIndex.name;
    
        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';
        if (nameAndDoneAndIndex.done === true) {
            item.classList.toggle('list-group-item-success');  
        }

        doneButton.addEventListener('click', function(){
            item.classList.toggle('list-group-item-success');
            for(let object of localStorageAsObject){
                if (object.id === nameAndDoneAndIndex.id){
                    object.done = !object.done; 
                }
            }
            saveObjectToLocalStorage(title);
        });

        deleteButton.addEventListener('click', function(){
            if (confirm('Вы уверены?')) {
                item.remove();
                localStorageAsObject = localStorageAsObject.filter(function(obj){
                    return obj.id != nameAndDoneAndIndex.id;
                })
                saveObjectToLocalStorage (title)
            }
            
        })
        //вкладываем кнопки в отдельный элемент, чтобы они объединились  в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);
    
        return {
            item,
            doneButton,
            deleteButton,
        };
        
    }
    
    //Функция сохранения

    function saveObjectToLocalStorage(title){
        let objAsString = JSON.stringify(localStorageAsObject);
        window.localStorage.setItem(title, objAsString);
    }

    function createTodoApp(container, title = 'Список дел', initialList) {
            let todoAppTitle = createAppTitle(title);
            let todoItemForm = createTodoItemForm();
            let todoList = createRodoList();
            localStorageAsObject = parseFromLocalStorage(title);
             if (initialList == undefined) {
                 initialList = [];
             }
            // window.localStorage.clear();
            
            container.append(todoAppTitle);
            container.append(todoItemForm.form);
            

            let savedList = window.localStorage.getItem(title);
            if (savedList) {                         
                initialList = localStorageAsObject;
                
            }
            else {
                localStorageAsObject = initialList;
                saveObjectToLocalStorage (title);
                
            }
            container.append(todoList);
                for(let item of localStorageAsObject) {
              
                    let todoItem = createTodoItem(item, title);    

                    //создаём и добавляем с список  нвового дела с названием из поля ввода
                    todoList.append(todoItem.item);
                }
                       
            //браузер создает событие submit на форме по нажатию на Enter или на кнопку по созданию дела
            todoItemForm.form.addEventListener('submit', function(e){
                
                //эта строчка необходима, чтобы предотвратить стандартное действие брузера
                //в данном случае мы не хотим, чтобы страничка перезагружалась при отправке формы
                e.preventDefault();
    
                //игнорируем создание элемента, если пользователь ничего не ввел в поле
                if (!todoItemForm.input.value){
                    return;
                }
                
                function getRandomInt(max) {
                    return Math.floor(Math.random() * max);
                }

                let object = {name: todoItemForm.input.value, done: false, id: getRandomInt(10000000)}
                let todoItem = createTodoItem(object, title);
                localStorageAsObject.push(object);
                saveObjectToLocalStorage (title);

                //создаём и добавляем с список  нвового дела с названием из поля ввода
                todoList.append(todoItem.item);
    
                //обнуляем значение в поле, чтоыб не пришлось стирать его в ручную
                todoItemForm.input.value = '';
            });
        
    }

   window.createTodoApp = createTodoApp;
})();


