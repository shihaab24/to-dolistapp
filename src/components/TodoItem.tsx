import React from 'react';
      import { motion } from 'framer-motion';
      import clsx from 'clsx';
      import { Trash2, Edit, CheckSquare, Square } from 'lucide-react';
      import type { Todo } from '../types';

      interface TodoItemProps {
        todo: Todo;
        onToggle: (id: number) => void;
        onDelete: (id: number) => void;
        onStartEdit: (todo: Todo) => void;
      }

      export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onStartEdit }) => {
        return (
          <motion.li
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <button onClick={() => onToggle(todo.id)} className="mr-4 flex-shrink-0">
              {todo.completed ? (
                <CheckSquare className="w-6 h-6 text-green-500" />
              ) : (
                <Square className="w-6 h-6 text-gray-400 dark:text-gray-500" />
              )}
            </button>
            <span
              className={clsx(
                'flex-grow text-lg transition-colors duration-300',
                { 'line-through text-gray-400 dark:text-gray-500': todo.completed }
              )}
            >
              {todo.text}
            </span>
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => onStartEdit(todo)}
                className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full transition-all duration-200 transform hover:scale-110"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className="p-2 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-all duration-200 transform hover:scale-110"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </motion.li>
        );
      };