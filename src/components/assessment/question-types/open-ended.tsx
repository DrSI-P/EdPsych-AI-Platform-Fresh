'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';

interface OpenEndedQuestionProps {
  initialData?: {
    content: string;
    points: number;
    expectedAnswer?: string;
    wordLimit?: number;
  }
  onSave: (data: {
    type: string;
    content: string;
    expectedAnswer?: string;
    wordLimit?: number;
    points: number;
  }) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function OpenEndedQuestion({
  initialData,
  onSave,
  onCancel,
  isEditing = false
}: OpenEndedQuestionProps) {
  const [content, setContent] = useState(initialData?.content || '');
  const [expectedAnswer, setExpectedAnswer] = useState(initialData?.expectedAnswer || '');
  const [wordLimit, setWordLimit] = useState(initialData?.wordLimit || 0);
  const [points, setPoints] = useState(initialData?.points || 1);
  const [errors, setErrors] = useState({
    content: '',
  });

  const validateForm = () => {
    const newErrors = {
      content: '',
    }

    if (!content.trim()) {
      newErrors.content = 'Question content is required';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    onSave({
      type: 'open-ended',
      content,
      expectedAnswer: expectedAnswer || undefined,
      wordLimit: wordLimit || undefined,
      points
    });
  }

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg border">
      <div className="flex justify-between items-centre">
        <h3 className="text-lg font-medium text-grey-900">
          {isEditing ? 'Edit Open-Ended Question' : 'Add Open-Ended Question'}
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
        <label htmlFor="expected-answer" className="block text-sm font-medium text-grey-700 mb-1">
          Expected Answer (Optional)
        </label>
        <p className="text-xs text-grey-500 mb-2">
          This will be used for grading guidance and AI-assisted marking. Students will not see this.
        </p>
        <textarea
          id="expected-answer"
          value={expectedAnswer}
          onChange={(e) => setExpectedAnswer(e.target.value)}
          placeholder="Enter an expected answer or grading criteria"
          rows={4}
          className="w-full px-3 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="word-limit" className="block text-sm font-medium text-grey-700 mb-1">
          Word Limit (Optional)
        </label>
        <div className="flex items-centre">
          <input
            id="word-limit"
            type="number"
            min="0"
            value={wordLimit}
            onChange={(e) => setWordLimit(parseInt(e.target.value) || 0)}
            placeholder="Enter word limit"
            className="w-32 px-3 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-grey-500">
            (0 = no limit)
          </span>
        </div>
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
