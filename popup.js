document.addEventListener('DOMContentLoaded', loadTasks);
document.getElementById("AddBtn").addEventListener("click", addTask);

function addTask() {
  const input = document.getElementById('taskInput');
    const taskText = input.value.trim();

    if (taskText !== '') {
      const task = {
        text: taskText,
        id: new Date().getTime()
      };
      
      const tasks = fetchTasks();
      tasks.push(task);
      saveTasks(tasks);

      const list = document.getElementById('taskList');
      const li = createTask(task);
      list.appendChild(li);

      input.value = '';
    }

}

function fetchTasks() {
  const tasks = localStorage.getItem('tasks');
  return JSON.parse(tasks) || [];
}

function saveTasks(tasks) {
  const tasksStr = JSON.stringify(tasks);
  localStorage.setItem('tasks', tasksStr);
}

function completeTask(id) {
  const tasks = fetchTasks();
  const newList = tasks.map(t => {
    if (t.id === id) t.completed = !t.completed;
    return t
  });
  saveTasks(newList);
  loadTasks();
}

function deleteTask(id) {
  const tasks = fetchTasks();
  const newList = tasks.filter(t => t.id !== id);
  saveTasks(newList);
  loadTasks();
}

function createTask(t) {
  const li = document.createElement('li');
  li.innerHTML = `
    <div class="check">
      <input type="checkbox"  ${t.completed ? 'checked' : ''} onchange="completeTask(${t.id})">
      <span ${t.completed ? 'style="text-decoration: line-through;"' : ''}>${t.text}</span>
    </div>
    <button class="delete-btn"  >Delete</button>
  `;

  li.setAttribute('data-id', t.id);
  li.querySelector('input[type="checkbox"]').addEventListener('change', (event) => {
    completeTask(t.id);
  });
  li.querySelector('.delete-btn').addEventListener('click', (event) => {
    deleteTask(t.id);
  });

  return li;
}

function loadTasks() {
  const taskList  = document.getElementById('taskList');
  taskList.innerHTML = '';

  const tasks = fetchTasks();
  tasks.forEach(t => {
    const li = createTask(t);
    taskList.appendChild(li)
  })
}