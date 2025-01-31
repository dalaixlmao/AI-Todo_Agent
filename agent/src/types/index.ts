type ActionFunction =
  | "getTodoById"
  | "createTodo"
  | "getUserTodos"
  | "searchTodo"
  | "deleteTodoById";

interface GetTodoAction {
  type: "actions";
  function: "getTodoById";
  input: { id: number };
}

interface CreateTodoAction {
  type: "actions";
  function: "createTodo";
  input: { data: { title: string; description: string; reminderTime?: Date } };
}

interface GetUserTodosAction {
  type: "actions";
  function: "getUserTodos";
  input: Record<string, never>;
}

interface SearchTodoAction {
  type: "actions";
  function: "searchTodo";
  input: { key: string };
}

interface DeleteTodoAction {
  type: "actions";
  function: "deleteTodoById";
  input: { id: number };
}

interface OutputAction {
  type: "output";
  output: string;
}

// Union of all possible actions
type Action =
  | GetTodoAction
  | CreateTodoAction
  | GetUserTodosAction
  | SearchTodoAction
  | DeleteTodoAction
  | OutputAction;

export {
  OutputAction,
  ActionFunction,
  Action,
  GetTodoAction,
  DeleteTodoAction,
  SearchTodoAction,
  CreateTodoAction,
  GetUserTodosAction,
};
