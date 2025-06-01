'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';

interface MatchingItem {
  id: string;
  left: string;
  right: string;
}

interface MatchingQuestionProps {
  initialData?: {
    content: string;
    items: any[];
    points: number;
    shuffleOptions: boolean;
  }
  onSave: (data: {
    type: string;
    content: string;
    items: any[];
    points: number;
    shuffleOptions: boolean;
  }) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function MatchingQuestion({
  initialData,
  onSave,
  onCancel,
  isEditing = false
}: MatchingQuestionProps) {
  const [content, setContent] = useState(initialData?.content || '');
  const [items, setItems] = useState<MatchingItem[]>(
    initialData?.items || [
      { id: '1', left: '', right: '' },
      { id: '2', left: '', right: '' },
      { id: '3', left: '', right: '' }
    ]
  );
  const [points, setPoints] = useState(initialData?.points || 1);
  const [shuffleOptions, setShuffleOptions] = useState(initialData?.shuffleOptions || true);
  const [errors, setErrors] = useState({
    content: '',
    items: ''
  });

  const handleItemChange = (id: string, field: 'left' | 'right', value: string) => {
    setItems(
      items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }

  const addItem = () => {
    const newId = (items.length + 1).toString();
    setItems([...items, { id: newId, left: '', right: '' }]);
  }

  const removeItem = (id: string) => {
    if (items.length <= 2) {
      return; // Maintain at least 2 matching pairs
    }
    setItems(items.filter(item => item.id !== id));
  }

  const validateForm = () => {
    const newErrors = {
      content: '',
      items: ''
    }

    if (!content.trim()) {
      newErrors.content = 'Question content is required';
    }

    const emptyItems = items.some(item => !item.left.trim() || !item.right.trim());
    if (emptyItems) {
      newErrors.items = 'All matching items must have both left and right values';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    onSave({
      type: 'matching',
      content,
      items,
      points,
      shuffleOptions
    });
  }

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg border">
      <div className="flex justify-between items-centre">
        <h3 className="text-lg font-medium text-grey-900">
          {isEditing ? 'Edit Matching Question' : 'Add Matching Question'}
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
          placeholder="Enter your question here (e.g., Match the items on the left with their corresponding items on the right)"
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
            Matching Items <span className="text-red-500">*</span>
          </label>
          <div className="flex items-centre">
            <input
              type="checkbox"
              id="shuffle-options"
              checked={shuffleOptions}
              onChange={() => setShuffleOptions(!shuffleOptions)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-grey-300 rounded"
            />
            <label htmlFor="shuffle-options" className="ml-2 text-sm text-grey-600">
              Shuffle right-side options
            </label>
          </div>
        </div>

        {errors.items && (
          <p className="mt-1 text-sm text-red-600 mb-2">{errors.items}</p>
        )}

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="text-sm font-medium text-grey-700 text-centre">Left Items</div>
            <div className="text-sm font-medium text-grey-700 text-centre">Right Items</div>
          </div>

          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-2 gap-4 items-centre">
              <div>
                <input
                  type="text"
                  value={item.left}
                  onChange={(e) => handleItemChange(item.id, 'left', e.target.value)}
                  placeholder="Left item"
                  className="w-full px-3 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-centre space-x-2">
                <input
                  type="text"
                  value={item.right}
                  onChange={(e) => handleItemChange(item.id, 'right', e.target.value)}
                  placeholder="Right item"
                  className="w-full px-3 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-grey-400 hover:text-grey-600"
                  aria-label="Remove matching pair"
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
          onClick={addItem}
          className="mt-3 inline-flex items-centre px-3 py-1.5 border border-grey-300 shadow-sm text-sm font-medium rounded-md text-grey-700 bg-white hover:bg-grey-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Matching Pair
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
