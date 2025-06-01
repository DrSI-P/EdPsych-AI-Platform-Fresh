/**
 * Visual Checklist Tool Component
 * 
 * This component provides a visual checklist to help users track multi-step tasks,
 * reducing working memory load by externalizing task tracking.
 */

import React, { useState, useEffect } from 'react';
import { Button, Card, Checkbox, Input, IconButton } from '@/components/ui';
import { useTranslation } from '@/components/i18n';
import { WorkingMemorySupportTool } from '@/lib/executive-function/working-memory-support';

interface VisualChecklistProps {
  tool: WorkingMemorySupportTool;
  onClose: () => void;
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
}

export default function VisualChecklist({
  tool,
  onClose,
  highContrast,
  largeText,
  reduceMotion
}: VisualChecklistProps) {
  const { t } = useTranslation('working-memory');
  
  // State
  const [items, setItems] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [newItemText, setNewItemText] = useState<string>('');
  const [listTitle, setListTitle] = useState<string>(t('tools.checklist.defaultTitle'));
  const [editingTitle, setEditingTitle] = useState<boolean>(false);
  const [savedLists, setSavedLists] = useState<{ id: string; title: string }[]>([]);
  const [currentListId, setCurrentListId] = useState<string>(`list_${Date.now()}`);
  
  // Load saved lists on mount
  useEffect(() => {
    const loadSavedLists = () => {
      try {
        const savedListsData = localStorage.getItem('working_memory_checklists');
        if (savedListsData) {
          const parsedData = JSON.parse(savedListsData);
          setSavedLists(parsedData.lists || []);
          
          // Load most recent list if available
          if (parsedData.currentListId && parsedData.lists.some((list: any) => list.id === parsedData.currentListId)) {
            setCurrentListId(parsedData.currentListId);
            loadList(parsedData.currentListId);
          }
        }
      } catch (error) {
        console.error('Error loading saved checklists:', error);
      }
    };
    
    loadSavedLists();
  }, []);
  
  // Save current list
  const saveCurrentList = () => {
    try {
      // Get existing data
      const savedListsData = localStorage.getItem('working_memory_checklists');
      const parsedData = savedListsData ? JSON.parse(savedListsData) : { lists: [] };
      
      // Update or add current list
      const existingListIndex = parsedData.lists.findIndex((list: any) => list.id === currentListId);
      
      if (existingListIndex >= 0) {
        parsedData.lists[existingListIndex] = { id: currentListId, title: listTitle };
      } else {
        parsedData.lists.push({ id: currentListId, title: listTitle });
        setSavedLists(parsedData.lists);
      }
      
      // Save current list ID
      parsedData.currentListId = currentListId;
      
      // Save items for current list
      localStorage.setItem(`working_memory_checklist_${currentListId}`, JSON.stringify(items));
      
      // Save lists metadata
      localStorage.setItem('working_memory_checklists', JSON.stringify(parsedData));
    } catch (error) {
      console.error('Error saving checklist:', error);
    }
  };
  
  // Load a specific list
  const loadList = (listId: string) => {
    try {
      const listData = localStorage.getItem(`working_memory_checklist_${listId}`);
      if (listData) {
        setItems(JSON.parse(listData));
        
        // Update current list ID
        setCurrentListId(listId);
        
        // Update title
        const list = savedLists.find(list => list.id === listId);
        if (list) {
          setListTitle(list.title);
        }
        
        // Update saved lists metadata
        const savedListsData = localStorage.getItem('working_memory_checklists');
        if (savedListsData) {
          const parsedData = JSON.parse(savedListsData);
          parsedData.currentListId = listId;
          localStorage.setItem('working_memory_checklists', JSON.stringify(parsedData));
        }
      }
    } catch (error) {
      console.error('Error loading checklist:', error);
    }
  };
  
  // Create a new list
  const createNewList = () => {
    const newListId = `list_${Date.now()}`;
    const newListTitle = t('tools.checklist.newList');
    
    // Update state
    setCurrentListId(newListId);
    setListTitle(newListTitle);
    setItems([]);
    
    // Update saved lists
    const updatedLists = [...savedLists, { id: newListId, title: newListTitle }];
    setSavedLists(updatedLists);
    
    // Save to localStorage
    try {
      const savedListsData = localStorage.getItem('working_memory_checklists');
      const parsedData = savedListsData ? JSON.parse(savedListsData) : { lists: [] };
      
      parsedData.lists = updatedLists;
      parsedData.currentListId = newListId;
      
      localStorage.setItem('working_memory_checklists', JSON.stringify(parsedData));
      localStorage.setItem(`working_memory_checklist_${newListId}`, JSON.stringify([]));
    } catch (error) {
      console.error('Error creating new checklist:', error);
    }
  };
  
  // Delete a list
  const deleteList = (listId: string) => {
    // Remove from saved lists
    const updatedLists = savedLists.filter(list => list.id !== listId);
    setSavedLists(updatedLists);
    
    // Remove from localStorage
    try {
      localStorage.removeItem(`working_memory_checklist_${listId}`);
      
      const savedListsData = localStorage.getItem('working_memory_checklists');
      if (savedListsData) {
        const parsedData = JSON.parse(savedListsData);
        parsedData.lists = updatedLists;
        
        // Update current list ID if needed
        if (parsedData.currentListId === listId) {
          if (updatedLists.length > 0) {
            parsedData.currentListId = updatedLists[0].id;
            setCurrentListId(updatedLists[0].id);
            loadList(updatedLists[0].id);
          } else {
            delete parsedData.currentListId;
            createNewList();
          }
        }
        
        localStorage.setItem('working_memory_checklists', JSON.stringify(parsedData));
      }
    } catch (error) {
      console.error('Error deleting checklist:', error);
    }
  };
  
  // Add a new item
  const addItem = () => {
    if (newItemText.trim()) {
      const newItem = {
        id: `item_${Date.now()}`,
        text: newItemText.trim(),
        completed: false
      };
      
      const updatedItems = [...items, newItem];
      setItems(updatedItems);
      setNewItemText('');
      
      // Save to localStorage
      try {
        localStorage.setItem(`working_memory_checklist_${currentListId}`, JSON.stringify(updatedItems));
      } catch (error) {
        console.error('Error saving checklist item:', error);
      }
    }
  };
  
  // Toggle item completion
  const toggleItem = (id: string) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    
    setItems(updatedItems);
    
    // Save to localStorage
    try {
      localStorage.setItem(`working_memory_checklist_${currentListId}`, JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error updating checklist item:', error);
    }
  };
  
  // Delete an item
  const deleteItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    
    // Save to localStorage
    try {
      localStorage.setItem(`working_memory_checklist_${currentListId}`, JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error deleting checklist item:', error);
    }
  };
  
  // Update list title
  const updateTitle = (newTitle: string) => {
    setListTitle(newTitle);
    setEditingTitle(false);
    
    // Update saved lists
    const updatedLists = savedLists.map(list => 
      list.id === currentListId ? { ...list, title: newTitle } : list
    );
    setSavedLists(updatedLists);
    
    // Save to localStorage
    try {
      const savedListsData = localStorage.getItem('working_memory_checklists');
      if (savedListsData) {
        const parsedData = JSON.parse(savedListsData);
        parsedData.lists = updatedLists;
        localStorage.setItem('working_memory_checklists', JSON.stringify(parsedData));
      }
    } catch (error) {
      console.error('Error updating checklist title:', error);
    }
  };
  
  // Handle key press in new item input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addItem();
    }
  };
  
  // Handle key press in title input
  const handleTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      updateTitle(listTitle);
    }
  };
  
  return (
    <div className={`visual-checklist ${largeText ? 'text-lg' : ''}`}>
      <Card className={`p-6 ${highContrast ? 'bg-yellow-50 border-black' : ''}`}>
        <div className="flex justify-between items-center mb-4">
          {editingTitle ? (
            <Input
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
              onBlur={() => updateTitle(listTitle)}
              onKeyPress={handleTitleKeyPress}
              autoFocus
              className={`text-xl font-semibold ${highContrast ? 'bg-white border-black' : ''}`}
            />
          ) : (
            <h3 
              className="text-xl font-semibold cursor-pointer" 
              onClick={() => setEditingTitle(true)}
              title={t('tools.checklist.clickToEdit')}
            >
              {listTitle}
            </h3>
          )}
          
          <div className="flex items-center">
            <Button 
              onClick={saveCurrentList}
              variant="outline"
              size="sm"
              className="mr-2"
            >
              {t('save')}
            </Button>
            <Button 
              onClick={onClose}
              variant="secondary"
              size="sm"
            >
              {t('close')}
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Input
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('tools.checklist.addItemPlaceholder')}
              className={`flex-grow ${highContrast ? 'bg-white border-black' : ''}`}
            />
            <Button 
              onClick={addItem}
              variant="primary"
              className="ml-2"
              disabled={!newItemText.trim()}
            >
              {t('add')}
            </Button>
          </div>
          
          <div className="checklist-items space-y-2">
            {items.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                {t('tools.checklist.emptyList')}
              </p>
            ) : (
              items.map(item => (
                <div 
                  key={item.id} 
                  className={`flex items-center p-2 rounded ${
                    item.completed 
                      ? highContrast 
                        ? 'bg-yellow-200' 
                        : 'bg-green-50' 
                      : highContrast 
                        ? 'bg-white' 
                        : 'bg-gray-50'
                  }`}
                >
                  <Checkbox
                    checked={item.completed}
                    onChange={() => toggleItem(item.id)}
                    id={item.id}
                    className={highContrast ? 'border-black' : ''}
                  />
                  <label 
                    htmlFor={item.id} 
                    className={`ml-2 flex-grow ${
                      item.completed 
                        ? 'line-through text-gray-500' 
                        : ''
                    }`}
                  >
                    {item.text}
                  </label>
                  <IconButton
                    onClick={() => deleteItem(item.id)}
                    aria-label={t('delete')}
                    variant="ghost"
                    size="sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </IconButton>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="saved-lists">
          <h4 className="text-md font-medium mb-2">{t('tools.checklist.savedLists')}</h4>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {savedLists.map(list => (
              <div 
                key={list.id} 
                className={`flex items-center px-3 py-1 rounded-full text-sm ${
                  list.id === currentListId 
                    ? highContrast 
                      ? 'bg-yellow-300 text-black' 
                      : 'bg-blue-500 text-white' 
                    : highContrast 
                      ? 'bg-gray-200 text-black' 
                      : 'bg-gray-100 text-gray-800'
                }`}
              >
                <span 
                  className="cursor-pointer" 
                  onClick={() => loadList(list.id)}
                >
                  {list.title}
                </span>
                {savedLists.length > 1 && (
                  <button
                    onClick={() => deleteList(list.id)}
                    className="ml-2 text-xs"
                    aria-label={t('delete')}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            
            <Button 
              onClick={createNewList}
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              + {t('tools.checklist.newList')}
            </Button>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>{t('tools.checklist.helpText')}</p>
        </div>
      </Card>
    </div>
  );
}
