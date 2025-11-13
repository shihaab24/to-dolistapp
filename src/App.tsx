import React, { useState, useEffect, useCallback } from 'react';
      import { Plus, Trash2, Edit, Check, X, Filter, Moon, Sun } from 'lucide-react';
      import { useLocalStorage } from './hooks/useLocalStorage';
      import type { Todo } from './types';
      import { TodoItem } from './components/TodoItem';
      import { AnimatePresence, motion } from 'framer-motion';

      type FilterType = 'all' | 'active' | 'completed';

      export default function App() {
        const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);
        const [newTodo, setNewTodo] = useState('');
        const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
        const [filter, setFilter] = useState<FilterType>('all');
        const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

        useEffect(() => {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }, [theme]);

        const handleAddTask = (e: React.FormEvent) => {
          e.preventDefault();
          if (newTodo.trim() === '') return;
          setTodos([...todos, { id: Date.now(), text: newTodo.trim(), completed: false }]);
          setNewTodo('');
        };

        const toggleTask = useCallback((id: number) => {
          setTodos(
            todos.map(todo =>
              todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
          );
        }, [todos, setTodos]);

        const deleteTask = useCallback((id: number) => {
          setTodos(todos.filter(todo => todo.id !== id));
        }, [todos, setTodos]);

        const startEditing = useCallback((todo: Todo) => {
          setEditingTodo({ ...todo });
        }, []);

        const handleUpdateTask = () => {
          if (!editingTodo || editingTodo.text.trim() === '') return;
          setTodos(
            todos.map(todo => (todo.id === editingTodo.id ? editingTodo : todo))
          );
          setEditingTodo(null);
        };

        const clearCompleted = () => {
          setTodos(todos.filter(todo => !todo.completed));
        };

        const filteredTodos = todos.filter(todo => {
          if (filter === 'active') return !todo.completed;
          if (filter === 'completed') return todo.completed;
          return true;
        });

        const toggleTheme = () => {
          setTheme(theme === 'light' ? 'dark' : 'light');
        };

        return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-3xl">
              <header className="flex justify-between items-center mb-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
                  Todoapp
                </h1>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-110"
                >
                  {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
                </button>
              </header>

              <motion.div layout className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 mb-8">
                <form onSubmit={handleAddTask} className="flex items-center gap-4">
                  <input
                    type="text"
                    value={newTodo}
                    onChange={e => setNewTodo(e.target.value)}
                    placeholder="Add a new masterpiece..."
                    className="flex-grow p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-transparent focus:border-brand-primary focus:ring-0 transition-colors duration-300"
                  />
                  <button
                    type="submit"
                    className="p-3 rounded-lg bg-gradient-to-r from-brand-primary to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Plus size={24} />
                  </button>
                </form>
              </motion.div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                  <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    {(['all', 'active', 'completed'] as FilterType[]).map(f => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-300 capitalize ${
                          filter === f
                            ? 'bg-brand-primary text-white shadow'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  {todos.some(t => t.completed) && (
                    <button
                      onClick={clearCompleted}
                      className="flex items-center gap-2 text-sm text-pink-500 hover:text-pink-600 dark:hover:text-pink-400 font-semibold transition-colors duration-300"
                    >
                      <Trash2 size={16} />
                      Clear Completed
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  <motion.ul layout className="space-y-4">
                    {filteredTodos.map(todo => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={toggleTask}
                        onDelete={deleteTask}
                        onStartEdit={startEditing}
                      />
                    ))}
                  </motion.ul>
                </AnimatePresence>

                {editingTodo && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <motion.div
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md"
                    >
                      <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
                      <input
                        type="text"
                        value={editingTodo.text}
                        onChange={e => setEditingTodo({ ...editingTodo, text: e.target.value })}
                        className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-transparent focus:border-brand-primary focus:ring-0 transition-colors duration-300 mb-4"
                      />
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => setEditingTodo(null)}
                          className="p-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-300"
                        >
                          <X size={20} />
                        </button>
                        <button
                          onClick={handleUpdateTask}
                          className="p-2 px-4 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors duration-300"
                        >
                          <Check size={20} />
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }