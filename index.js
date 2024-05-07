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
      const input = createElement("input", { type: "checkbox" });
      input.checked = task.isCompleted;

      const listItem = createElement("li", { id: task.id }, [
        input,
        createElement("label", {}, task.name),
        createElement("button", {}, "🗑️", { click: () => this.removeTaskById(task.id)})
      ]);

      tasks.push(listItem);
    }
    return tasks;
  }

  render() {
    let children = this.renderTasks();

    return createElement(
        "div",
        { class: "todo-list" },
        [
          createElement("h1", {}, "TODO List"),
          createElement("div", { class: "add-todo" }, [
            createElement("input", {
              id: "new-todo",
              type: "text",
              placeholder: "Задание",
            }),
            createElement("button", { id: "add-btn" }, "+", { click: this.onAddTask }),
          ]),
          createElement("ul", { id: "todos" }, children),
        ],
        { input: this.onAddInputChange }
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});
