// script.js

document.addEventListener('DOMContentLoaded', loadTasks);

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filterAllBtn = document.getElementById('filter-all');
const filterCompleteBtn = document.getElementById('filter-complete');
const filterIncompleteBtn = document.getElementById('filter-incomplete');
const deleteAllBtn = document.querySelector('.delete-all-btn');
const editModal = document.getElementById('edit-modal');
const editInput = document.getElementById('edit-input');
const editForm = document.getElementById('edit-form');
const closeBtn = document.querySelector('.close-btn');

let currentEditTask;

taskForm.addEventListener('submit', addTask);
filterAllBtn.addEventListener('click', () => filterTasks('all'));
filterCompleteBtn.addEventListener('click', () => filterTasks('complete'));
filterIncompleteBtn.addEventListener('click', () => filterTasks('incomplete'));
deleteAllBtn.addEventListener('click', deleteAllTasks);
closeBtn.addEventListener('click', () => editModal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target == editModal) {
        editModal.style.display = 'none';
    }
});
editForm.addEventListener('submit', saveEditTask);

function addTask(e) {
    e.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Please add a task');
        return;
    }

    const taskItem = createTaskElement(taskText);
    taskList.appendChild(taskItem);
    
    saveTask(taskText);
    
    taskInput.value = '';
}

function createTaskElement(text, completed = false) {
    const li = document.createElement('li');
    li.className = 'task';
    if (completed) li.classList.add('completed');

    li.innerHTML = `
        <span>${text}</span>
        <div>
            <button class="complete">✓</button>
            <button class="edit">✎</button>
            <button class="delete">✗</button>
        </div>
    `;

    li.querySelector('.complete').addEventListener('click', toggleCompleteTask);
    li.querySelector('.edit').addEventListener('click', () => openEditModal(li));
    li.querySelector('.delete').addEventListener('click', deleteTask);

    return li;
}

function toggleCompleteTask(e) {
    const taskItem = e.target.closest('.task');
    taskItem.classList.toggle('completed');

    updateLocalStorage();
}

function openEditModal(taskItem) {
    currentEditTask = taskItem;
    editInput.value = taskItem.querySelector('span').innerText;
    editModal.style.display = 'block';
}

function saveEditTask(e) {
    e.preventDefault();
    if (editInput.value.trim() !== '') {
        currentEditTask.querySelector('span').innerText = editInput.value.trim();
        editModal.style.display = 'none';
        updateLocalStorage();
    }
}

function deleteTask(e) {
    const taskItem = e.target.closest('.task');
    taskList.removeChild(taskItem);

    updateLocalStorage();
}

function deleteAllTasks() {
    taskList.innerHTML = '';
    localStorage.removeItem('tasks');
}

function saveTask(taskText) {
    const tasks = getTasksFromLocalStorage();
    tasks.push({ text: taskText, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(task => {
        const taskItem = createTaskElement(task.text, task.completed);
        taskList.appendChild(taskItem);
    });
}

function getTasksFromLocalStorage() {
    return localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
}

function updateLocalStorage() {
    const tasks = [];
    document.querySelectorAll('.task').forEach(taskItem => {
        const text = taskItem.querySelector('span').innerText;
        const completed = taskItem.classList.contains('completed');
        tasks.push({ text, completed });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function filterTasks(filter) {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        switch (filter) {
            case 'all':
                task.style.display = 'flex';
                break;
            case 'complete':
                task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
                break;
            case 'incomplete':
                task.style.display = !task.classList.contains('completed') ? 'flex' : 'none';
                break;
        }
    });
}