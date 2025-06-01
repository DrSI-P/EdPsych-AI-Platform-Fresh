'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';

interface MultipleChoiceOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface MultipleChoiceQuestionProps {
  initialData?: {
    content: string;
    options: any[];
    points: number;
  }
  onSave: (data: {
    type: string;
    content: string;
    options: any[];
    correctAnswer: any[];
    points: number;
  }) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function MultipleChoiceQuestion({
  initialData,
  onSave,
  onCancel,
  isEditing = false
}: MultipleChoiceQuestionProps) {
  const [content, setContent] = useState(initialData?.content || '');
  const [options, setOptions] = useState<MultipleChoiceOption[]>(
    initialData?.options || [
      { id: '1', text: '', isCorrect: false },
      { id: '2', text: '', isCorrect: false },
      { id: '3', text: '', isCorrect: false },
      { id: '4', text: '', isCorrect: false }
    ]
  );
  const [points, setPoints] = useState(initialData?.points || 1);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [errors, setErrors] = useState({
    content: '',
    options: '',
    correctAnswer: ''
  });

  const handleOptionChange = (id: string, text: string) => {
    setOptions(
      options.map(option => 
        option.id === id ? { ...option, text } : option
      )
    );
  }

  const handleCorrectChange = (id: string) => {
    if (allowMultiple) {
      setOptions(
        options.map(option => 
          option.id === id ? { ...option, isCorrect: !option.isCorrect } : option
        )
      );
    } else {
      setOptions(
        options.map(option => 
          option.id === id ? { ...option, isCorrect: true } : { ...option, isCorrect: false }
        )
      );
    }
  }

  const addOption = () => {
    const newId = (options.length + 1).toString();
    setOptions([...options, { id: newId, text: '', isCorrect: false }]);
  }

  const removeOption = (id: string) => {
    if (options.length <= 2) {
      return; // Maintain at least 2 options
    }
    setOptions(options.filter(option => option.id !== id));
  }

  const validateForm = () => {
    const newErrors = {
      content: '',
      options: '',
      correctAnswer: ''
    }

    if (!content.trim()) {
      newErrors.content = 'Question content is required';
    }

    const emptyOptions = options.some(option => !option.text.trim());
    if (emptyOptions) {
      newErrors.options = 'All options must have text';
    }

    const hasCorrectAnswer = options.some(option => option.isCorrect);
    if (!hasCorrectAnswer) {
      newErrors.correctAnswer = 'At least one correct answer must be selected';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const correctAnswerIds = options
      .filter(option => option.isCorrect)
      .map(option => option.id);

    onSave({
      type: 'multiple-choice',
      content,
      options,
      correctAnswer: correctAnswerIds,
      points
    });
  }

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg border">
      <div className="flex justify-between items-centre">
        <h3 className="text-lg font-medium text-grey-900">
          {isEditing ? 'Edit Multiple Choice Question' : 'Add Multiple Choice Question'}
        </h3>
        <div className="flex items-centre space-x-2">
          <label className="text-sm text-grey-600">Points:</label>
          <input
            type="number"
            min="1"
            value={points}
            onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
            className="w-16 px-2 py-1 border rounded-md"
          />
        </div>
      </div>

      {Object.values(errors).some(error => error) && (
        <Alert type="error">
          Please correct the errors below before saving.
        </Alert>
      )}

      <div>
        <label htmlFor="question-content" className="block text-sm font-medium text-grey-700 mb-1">
          Question <span className="text-red-500">*</span>
        </label>
        <textarea
          id="question-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your question here"
          rows={3}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.content ? 'border-red-500' : 'border-grey-300'
          }`}
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content}</p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-centre mb-2">
          <label className="block text-sm font-medium text-grey-700">
            Options <span className="text-red-500">*</span>
          </label>
          <div className="flex items-centre">
            <input
              type="checkbox"
              id="allow-multiple"
              checked={allowMultiple}
              onChange={() => setAllowMultiple(!allowMultiple)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-grey-300 rounded"
            />
            <label htmlFor="allow-multiple" className="ml-2 text-sm text-grey-600">
              Allow multiple correct answers
            </label>
          </div>
        </div>

        {errors.options && (
          <p className="mt-1 text-sm text-red-600 mb-2">{errors.options}</p>
        )}

        {errors.correctAnswer && (
          <p className="mt-1 text-sm text-red-600 mb-2">{errors.correctAnswer}</p>
        )}

        <div className="space-y-3">
          {options.map((option) => (
            <div key={option.id} className="flex items-centre space-x-3">
              <div className="flex-shrink-0">
                <input
                  type={allowMultiple ? 'checkbox' : 'radio'}
                  checked={option.isCorrect}
                  onChange={() => handleCorrectChange(option.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-grey-300"
                />
              </div>
              <div className="flex-grow">
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(option.id, e.target.value)}
                  placeholder={`Option ${option.id}`}
                  className="w-full px-3 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => removeOption(option.id)}
                  className="text-grey-400 hover:text-grey-600"
                  aria-label="Remove option"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addOption}
          className="mt-3 inline-flex items-centre px-3 py-1.5 border border-grey-300 shadow-sm text-sm font-medium rounded-md text-grey-700 bg-white hover:bg-grey-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Option
        </button>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
        >
          {isEditing ? 'Update Question' : 'Add Question'}
        </Button>
      </div>
    </div>
  );
}
