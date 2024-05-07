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

class Component {
  constructor() {
  }

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }
}


class Task {
  constructor(name, isCompleted) {
    this.name = name;
    this.isCompleted = isCompleted;
  }
}

class TodoList extends Component {
  constructor() {
    super();
    this.state = {
      tasks: [
        new Task("Сделать домашку", false),
        new Task("Сделать практику", false),
        new Task("Пойти домой", false),
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
    const task = new Task(this.state.currentInput, false);
    this.state.tasks.push(task);
  }

  _renderTasks() {
    let tasks = [];
    for (const task of this.state.tasks) {
      const input = createElement("input", { type: "checkbox" });
      input.checked = task.isCompleted;

      const listItem = createElement("li", {}, [
        input,
        createElement("label", {}, task.name),
        createElement("button", {}, "🗑️")
      ]);
      tasks.push(listItem);
    }

    return tasks;
  }

  render() {
    let children = this._renderTasks();

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
