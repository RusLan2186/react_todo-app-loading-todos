/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { Todo } from './types/Todo';

import { FilterTodos } from './types/FilterTodos';
import { Errors } from './types/Errors';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoFilter } from './components/TodoFilter';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { handleFilteredTodos } from './utils/handleFiltredTodos';
import { handleRequestError } from './utils/handleRequestError';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterSelected, setFilterSelected] = useState<FilterTodos>(
    FilterTodos.all,
  );
  const [error, setError] = useState<Errors>(Errors.default);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => handleRequestError(Errors.loadTodo, setError));
  }, [setTodos, setError]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const preparedTodos = handleFilteredTodos(todos, filterSelected);
  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          completedTodos={completedTodos}
          activeTodos={activeTodos}
        />
        {todos.length > 0 && (
          <>
            <TodoList todos={preparedTodos} />

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {activeTodos.length} items left
              </span>
              <TodoFilter
                filterSelected={filterSelected}
                setFilterSelected={filter => setFilterSelected(filter)}
              />
              {/* Active link should have the 'selected' class */}
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={completedTodos.length < 1}
              >
                {FilterTodos.clearCompleted}
              </button>
            </footer>
          </>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
