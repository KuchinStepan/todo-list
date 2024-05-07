function createElement(tag, attributes, children, callbacks) {
  const element = document.createElement(tag);

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      element.setAttribute(key, attributes[key]);
    });
  }

  if (Array.isArray(children)) {
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        element.appendChild(child);
      }
    });
  } else if (typeof children === "string") {
    element.appendChild(document.createTextNode(children));
  } else if (children instanceof HTMLElement) {
    element.appendChild(children);
  }

  if (callbacks) {
    for (const name in callbacks) {
      if (name !== undefined) {
        element.addEventListener(name, callbacks[name]);
      }
    }
  }

  return element;
}

class TaskInfo {
  static tasksIdCounter = 0;

  constructor(name, isCompleted) {
    this.name = name;
    this.isCompleted = isCompleted;
    this.id = `task-id-${TaskInfo.tasksIdCounter}`;
    TaskInfo.tasksIdCounter++;
  }
}

class Component {
  constructor() {
  }

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }

  update() {
    const newNode = this.render();
    this._domNode.parentNode.replaceChild(newNode, this._domNode);
    this._domNode = newNode;
  }
}

class AddTask extends Component {
  constructor(props) {
    super();
    this.onInputChange = props.onInputChange;
    this.onAddTask = props.onAddTask;
  }

  render() {
    return createElement(
        "div",
        { class: "add-todo" },
        [
          createElement("input", {
            id: "new-todo",
            type: "text",
            placeholder: "Задание",
          }, {},{ input: this.onInputChange }),
          createElement("button", { id: "add-btn" }, "+", { click: this.onAddTask }),
        ],
    );
  }
}

class Task extends Component {
  constructor(props) {
    super();
    this.taskInfo = props.taskInfo;
    this.removeTaskById = props.removeTaskById;
    this.state = {
      firstClick: true,
    };
  }

  handleClickWithId(buttonId) {
    if (this.state.firstClick) {
      const button = document.getElementById(buttonId);
      button.style.backgroundColor = 'red';
      this.state.firstClick = false;
    } else {
      this.removeTaskById(this.taskInfo.id);
    }
  }

  render() {
    const input = createElement("input", { type: "checkbox" });
    input.checked = this.taskInfo.isCompleted;
    const buttonStyle =  this.state.firstClick ? "" : "background-color: red;";
    const bondedHandler = this.handleClickWithId.bind(this);
    const buttonId = `button-${this.taskInfo.id}`;

    return createElement("li", {id: this.taskInfo.id}, [
      input,
      createElement("label", {}, this.taskInfo.name),
      createElement("button", { style: buttonStyle, id: buttonId },
                    "🗑️", {click: () => bondedHandler(buttonId)})
    ]);
  }
}


class TodoList extends Component {
  constructor() {
    super();
    this.state = {
      tasks: [
        new TaskInfo("Сделать домашку", false),
        new TaskInfo("Сделать практику", false),
        new TaskInfo("Пойти домой", false),
      ],
      currentInput: "",
    };

    this.onAddInputChange = this.onAddInputChange.bind(this);
    this.onAddTask = this.onAddTask.bind(this);
  }

  onAddInputChange(event) {
    this.state.currentInput = event.target.value;
  }

  onAddTask() {
    const input = this.state.currentInput;
    if (input === "") {
      alert("Введите название новой задачи");
      return;
    }
    const task = new TaskInfo(input, false);
    this.state.currentInput = "";
    this.state.tasks.push(task);
    this.update();
  }

  removeTaskById(id) {
    const task = document.getElementById(id);
    task.remove();
    this.state.tasks = this.state.tasks.filter(t => t.id !== id);
  }

  renderTasks() {
    let tasks = [];
    for (const task of this.state.tasks) {
      const taskComponent = new Task({
        taskInfo: task,
        removeTaskById: this.removeTaskById.bind(this),
      });
      tasks.push(taskComponent.getDomNode());
    }
    return tasks;
  }

  render() {
    return createElement(
        "div",
        { class: "todo-list" },
        [
          createElement("h1", {}, "TODO List"),
          new AddTask({ onInputChange: this.onAddInputChange.bind(this), onAddTask: this.onAddTask.bind(this) }).getDomNode(),
          createElement("ul", { id: "todos" }, this.renderTasks()),
        ]
    );
  }

}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});
