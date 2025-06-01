'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';

interface FileUploadQuestionProps {
  initialData?: {
    content: string;
    points: number;
    allowedFileTypes: any[];
    maxFileSize: number;
  }
  onSave: (data: {
    type: string;
    content: string;
    allowedFileTypes: any[];
    maxFileSize: number;
    points: number;
  }) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function FileUploadQuestion({
  initialData,
  onSave,
  onCancel,
  isEditing = false
}: FileUploadQuestionProps) {
  const [content, setContent] = useState(initialData?.content || '');
  const [points, setPoints] = useState(initialData?.points || 1);
  const [allowedFileTypes, setAllowedFileTypes] = useState<string[]>(
    initialData?.allowedFileTypes || ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']
  );
  const [maxFileSize, setMaxFileSize] = useState(initialData?.maxFileSize || 5);
  const [customFileType, setCustomFileType] = useState('');
  const [errors, setErrors] = useState({
    content: '',
    allowedFileTypes: '',
  });

  const fileTypeOptions = [
    { value: 'pdf', label: 'PDF Documents (.pdf)' },
    { value: 'doc,docx', label: 'Word Documents (.doc, .docx)' },
    { value: 'jpg,jpeg,png', label: 'Images (.jpg, .jpeg, .png)' },
    { value: 'xls,xlsx', label: 'Excel Spreadsheets (.xls, .xlsx)' },
    { value: 'ppt,pptx', label: 'PowerPoint Presentations (.ppt, .pptx)' },
    { value: 'txt', label: 'Text Files (.txt)' },
    { value: 'zip', label: 'ZIP Archives (.zip)' },
  ];

  const handleFileTypeToggle = (typeValue: string) => {
    const types = typeValue.split(',');
    
    // Check if all types in the group are already selected
    const allSelected = types.every(type => allowedFileTypes.includes(type));
    
    if (allSelected) {
      // Remove all types in this group
      setAllowedFileTypes(allowedFileTypes.filter(type => !types.includes(type)));
    } else {
      // Add any types from this group that aren't already selected
      const newTypes = [...allowedFileTypes];
      types.forEach(type => {
        if (!newTypes.includes(type)) {
          newTypes.push(type);
        }
      });
      setAllowedFileTypes(newTypes);
    }
  }

  const addCustomFileType = () => {
    if (customFileType && !allowedFileTypes.includes(customFileType)) {
      setAllowedFileTypes([...allowedFileTypes, customFileType]);
      setCustomFileType('');
    }
  }

  const removeFileType = (type: string) => {
    setAllowedFileTypes(allowedFileTypes.filter(t => t !== type));
  }

  const validateForm = () => {
    const newErrors = {
      content: '',
      allowedFileTypes: '',
    }

    if (!content.trim()) {
      newErrors.content = 'Question content is required';
    }

    if (allowedFileTypes.length === 0) {
      newErrors.allowedFileTypes = 'At least one file type must be allowed';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    onSave({
      type: 'file-upload',
      content,
      allowedFileTypes,
      maxFileSize,
      points
    });
  }

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg border">
      <div className="flex justify-between items-centre">
        <h3 className="text-lg font-medium text-grey-900">
          {isEditing ? 'Edit File Upload Question' : 'Add File Upload Question'}
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
          placeholder="Enter your question or instructions for file upload"
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
        <label className="block text-sm font-medium text-grey-700 mb-1">
          Allowed File Types <span className="text-red-500">*</span>
        </label>
        {errors.allowedFileTypes && (
          <p className="mt-1 text-sm text-red-600 mb-2">{errors.allowedFileTypes}</p>
        )}
        
        <div className="space-y-2 mb-4">
          {fileTypeOptions.map((option) => (
            <div key={option.value} className="flex items-centre">
              <input
                type="checkbox"
                id={`filetype-${option.value}`}
                checked={option.value.split(',').some(type => allowedFileTypes.includes(type))}
                onChange={() => handleFileTypeToggle(option.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-grey-300 rounded"
              />
              <label htmlFor={`filetype-${option.value}`} className="ml-2 text-sm text-grey-700">
                {option.label}
              </label>
            </div>
          ))}
        </div>

        <div className="flex items-centre space-x-2 mb-4">
          <input
            type="text"
            value={customFileType}
            onChange={(e) => setCustomFileType(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
            placeholder="Add custom file extension (without dot)"
            className="flex-grow px-3 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            type="button"
            onClick={addCustomFileType}
            disabled={!customFileType}
            variant="outline"
          >
            Add
          </Button>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-grey-700 mb-2">Selected File Types:</p>
          <div className="flex flex-wrap gap-2">
            {allowedFileTypes.map((type) => (
              <div 
                key={type} 
                className="inline-flex items-centre px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                .{type}
                <button
                  type="button"
                  onClick={() => removeFileType(type)}
                  className="ml-1.5 text-blue-500 hover:text-blue-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="max-file-size" className="block text-sm font-medium text-grey-700 mb-1">
            Maximum File Size (MB)
          </label>
          <input
            id="max-file-size"
            type="number"
            min="1"
            max="50"
            value={maxFileSize}
            onChange={(e) => setMaxFileSize(parseInt(e.target.value) || 5)}
            className="w-32 px-3 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
