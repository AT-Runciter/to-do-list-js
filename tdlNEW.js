const todoList = document.getElementById('todo-list');
const todoForm = document.getElementById('todo-form');
const addInput = document.getElementById('add-input');
const paginationContainer = document.getElementById('pagination-container');

let currentPage = 1;
const itemsPerPage = 10;

function createTodoItem(title, completed) {
  const todoItem = document.createElement('li');
  todoItem.className = 'todo-item';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'checkbox';

  const label = document.createElement('label');
  label.className = 'title';
  label.textContent = title;

  const timestamp = document.createElement('span');
  timestamp.className = 'timestamp';
  timestamp.textContent = getCurrentTimestamp();

  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'textfield';

  const editButton = document.createElement('button');
  editButton.className = 'edit';
  editButton.textContent = 'Змінити';

  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete';
  deleteButton.textContent = 'Видалити';

  todoItem.appendChild(checkbox);
  todoItem.appendChild(label);
  todoItem.appendChild(timestamp);
  todoItem.appendChild(editInput);
  todoItem.appendChild(editButton);
  todoItem.appendChild(deleteButton);

  if (completed) {
    todoItem.classList.add('completed');
    checkbox.checked = true;
  }

  return todoItem;
}

function getCurrentTimestamp() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear());
  return `${hours}:${minutes}:${seconds}, ${date}.${month}.${year}`;
}

function saveTodoList() {
  const todoItems = Array.from(todoList.getElementsByClassName('todo-item')).map(todoItem => {
    const label = todoItem.querySelector('.title');
    const isCompleted = todoItem.classList.contains('completed');
    return { title: label.textContent, completed: isCompleted };
  });
  localStorage.setItem('todoItems', JSON.stringify(todoItems));
}

function addTodoItem(event) {
  event.preventDefault();

  const inputValue = addInput.value.trim();

  if (inputValue !== '') {
    const todoItem = createTodoItem(inputValue);
    todoList.appendChild(todoItem);
    addInput.value = '';
    renderPagination();
    saveTodoList();
  }
}

function renderTodoList() {
  const todoItems = todoList.getElementsByClassName('todo-item');
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  for (let i = 0; i < todoItems.length; i++) {
    const todoItem = todoItems[i];
    if (i >= startIndex && i < endIndex) {
      todoItem.style.display = 'flex';
    } else {
      todoItem.style.display = 'none';
    }
  }
}

function renderPagination() {
  const todoItemsCount = todoList.getElementsByClassName('todo-item').length;
  const pageCount = Math.ceil(todoItemsCount / itemsPerPage);

  paginationContainer.innerHTML = '';

  for (let i = 1; i <= pageCount; i++) {
    const pageLink = document.createElement('a');
    pageLink.href = '#';
    pageLink.textContent = i;

    pageLink.classList.add('pagination');

    pageLink.addEventListener('click', function () {
      currentPage = i;
      renderTodoList();
    });

    paginationContainer.appendChild(pageLink);
  }
}

function editTodoItem() {
  const todoItem = this.parentNode;
  const label = todoItem.querySelector('.title');
  const editInput = todoItem.querySelector('.textfield');
  const isEditing = todoItem.classList.contains('editing');

  if (isEditing) {
    label.textContent = editInput.value;
    this.textContent = 'Змінити';
  } else {
    editInput.value = label.textContent;
    this.textContent = 'Зберегти';
  }

  todoItem.classList.toggle('editing');
  saveTodoList();
}

function deleteTodoItem() {
  const todoItem = this.parentNode;
  todoList.removeChild(todoItem);
  renderPagination();
  saveTodoList();
}

function sortTodoList(sortType) {
  const todoItems = Array.from(todoList.getElementsByClassName('todo-item'));
  const sortedItems = todoItems.sort((a, b) => {
    const titleA = a.querySelector('.title').textContent.toLowerCase();
    const titleB = b.querySelector('.title').textContent.toLowerCase();
    const timestampA = a.querySelector('.timestamp').textContent;
    const timestampB = b.querySelector('.timestamp').textContent;

    if (sortType === 'alphabetical') {
      return titleA.localeCompare(titleB);
    } else if (sortType === 'reverseAlphabetical') {
      return titleB.localeCompare(titleA);
    } else if (sortType === 'dateAddedNewest') {
      return timestampB.localeCompare(timestampA);
    } else if (sortType === 'dateAddedOldest') {
      return timestampA.localeCompare(timestampB);
    }
  });

  todoList.innerHTML = '';
  sortedItems.forEach(item => {
    todoList.appendChild(item);
  });
}

todoForm.addEventListener('submit', addTodoItem);

todoList.addEventListener('click', function (event) {
  if (event.target.className === 'edit') {
    editTodoItem.call(event.target);
  } else if (event.target.className === 'delete') {
    deleteTodoItem.call(event.target);
  }
});

document.getElementById('sort-select').addEventListener('change', function (event) {
  const sortType = event.target.value;
  sortTodoList(sortType);
});

function initializeTodoList() {
  const savedTodoItems = localStorage.getItem('todoItems');
  if (savedTodoItems) {
    const todoItems = JSON.parse(savedTodoItems);
    todoItems.forEach(item => {
      const { title, completed } = item;
      const todoItem = createTodoItem(title, completed);
      todoList.appendChild(todoItem);
    });
  }
  renderPagination();
}


initializeTodoList();
