/**
 * Content Search and Filtering Service
 * Provides advanced search and filtering capabilities for curriculum content
 */

import { 
  ContentSearchFilters, 
  ContentSearchResult,
  ContentMetadata,
  UKKeyStage,
  UKSubject,
  ContentType,
  ContentStatus,
  UKCurriculumRegion
} from './types';
import { searchCurriculumContent } from './api';

/**
 * Saved search interface
 */
export interface SavedSearch {
  id: string;
  name: string;
  filters: ContentSearchFilters;
  query?: string;
  createdAt: string;
  userId: string;
}

/**
 * Get saved searches from local storage
 */
export function getSavedSearches(userId?: string): SavedSearch[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const storageKey = userId ? `savedSearches_${userId}` : 'savedSearches';
  const savedSearchesJson = localStorage.getItem(storageKey);
  
  if (savedSearchesJson) {
    try {
      return JSON.parse(savedSearchesJson);
    } catch (error) {
      console.error('Error parsing saved searches:', error);
      return [];
    }
  }
  
  return [];
}

/**
 * Save a search to local storage
 */
export function saveSearch(search: Omit<SavedSearch, 'id' | 'createdAt'>, userId?: string): SavedSearch {
  if (typeof window === 'undefined') {
    throw new Error('Cannot save search in server-side context');
  }
  
  const storageKey = userId ? `savedSearches_${userId}` : 'savedSearches';
  const savedSearches = getSavedSearches(userId);
  
  const newSearch: SavedSearch = {
    ...search,
    id: `search_${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  
  savedSearches.push(newSearch);
  localStorage.setItem(storageKey, JSON.stringify(savedSearches));
  
  return newSearch;
}

/**
 * Delete a saved search from local storage
 */
export function deleteSavedSearch(searchId: string, userId?: string): boolean {
  if (typeof window === 'undefined') {
    throw new Error('Cannot delete search in server-side context');
  }
  
  const storageKey = userId ? `savedSearches_${userId}` : 'savedSearches';
  const savedSearches = getSavedSearches(userId);
  
  const filteredSearches = savedSearches.filter(search => search.id !== searchId);
  
  if (filteredSearches.length !== savedSearches.length) {
    localStorage.setItem(storageKey, JSON.stringify(filteredSearches));
    return true;
  }
  
  return false;
}

/**
 * Get available key stages
 */
export function getKeyStageOptions(): { value: UKKeyStage; label: string }[] {
  return [
    { value: 'EYFS', label: 'Early Years Foundation Stage' },
    { value: 'KS1', label: 'Key Stage 1' },
    { value: 'KS2', label: 'Key Stage 2' },
    { value: 'KS3', label: 'Key Stage 3' },
    { value: 'KS4', label: 'Key Stage 4' },
    { value: 'KS5', label: 'Key Stage 5' }
  ];
}

/**
 * Get available subjects
 */
export function getSubjectOptions(): { value: UKSubject; label: string }[] {
  return [
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'English', label: 'English' },
    { value: 'Science', label: 'Science' },
    { value: 'History', label: 'History' },
    { value: 'Geography', label: 'Geography' },
    { value: 'Art', label: 'Art and Design' },
    { value: 'Music', label: 'Music' },
    { value: 'Physical Education', label: 'Physical Education' },
    { value: 'Computing', label: 'Computing' },
    { value: 'Design and Technology', label: 'Design and Technology' },
    { value: 'Modern Foreign Languages', label: 'Modern Foreign Languages' },
    { value: 'Religious Education', label: 'Religious Education' },
    { value: 'PSHE', label: 'Personal, Social, Health and Economic Education' }
  ];
}

/**
 * Get available content types
 */
export function getContentTypeOptions(): { value: ContentType; label: string }[] {
  return [
    { value: ContentType.EXPLANATION, label: 'Explanation' },
    { value: ContentType.EXERCISE, label: 'Exercise' },
    { value: ContentType.ASSESSMENT, label: 'Assessment' },
    { value: ContentType.EXAMPLE, label: 'Example' },
    { value: ContentType.RESOURCE, label: 'Resource' },
    { value: ContentType.PROJECT, label: 'Project' },
    { value: ContentType.DISCUSSION, label: 'Discussion' }
  ];
}

/**
 * Get available content statuses
 */
export function getContentStatusOptions(): { value: ContentStatus; label: string }[] {
  return [
    { value: ContentStatus.DRAFT, label: 'Draft' },
    { value: ContentStatus.REVIEW, label: 'In Review' },
    { value: ContentStatus.APPROVED, label: 'Approved' },
    { value: ContentStatus.PUBLISHED, label: 'Published' },
    { value: ContentStatus.ARCHIVED, label: 'Archived' },
    { value: ContentStatus.REJECTED, label: 'Rejected' }
  ];
}

/**
 * Get available UK curriculum regions
 */
export function getUKCurriculumRegionOptions(): { value: UKCurriculumRegion; label: string }[] {
  return [
    { value: UKCurriculumRegion.ENGLAND, label: 'England' },
    { value: UKCurriculumRegion.WALES, label: 'Wales' },
    { value: UKCurriculumRegion.SCOTLAND, label: 'Scotland' },
    { value: UKCurriculumRegion.NORTHERN_IRELAND, label: 'Northern Ireland' }
  ];
}

/**
 * Get date range options
 */
export function getDateRangeOptions(): { value: string; label: string }[] {
  return [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'thismonth', label: 'This Month' },
    { value: 'lastmonth', label: 'Last Month' },
    { value: 'thisyear', label: 'This Year' },
    { value: 'lastyear', label: 'Last Year' }
  ];
}

/**
 * Convert date range to actual date range
 */
export function convertDateRangeToDateRange(dateRange: string): { from?: string; to?: string } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (dateRange) {
    case 'today':
      return {
        from: today.toISOString(),
        to: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1).toISOString()
      };
    case 'yesterday':
      return {
        from: new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        to: new Date(today.getTime() - 1).toISOString()
      };
    case 'last7days':
      return {
        from: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        to: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1).toISOString()
      };
    case 'last30days':
      return {
        from: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        to: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1).toISOString()
      };
    case 'thismonth':
      return {
        from: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
        to: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString()
      };
    case 'lastmonth':
      return {
        from: new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString(),
        to: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999).toISOString()
      };
    case 'thisyear':
      return {
        from: new Date(now.getFullYear(), 0, 1).toISOString(),
        to: new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999).toISOString()
      };
    case 'lastyear':
      return {
        from: new Date(now.getFullYear() - 1, 0, 1).toISOString(),
        to: new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999).toISOString()
      };
    case 'all':
    default:
      return {};
  }
}

/**
 * Search curriculum content with filters
 */
export async function searchContent(
  query: string,
  filters: ContentSearchFilters,
  page: number = 1,
  pageSize: number = 20
): Promise<ContentSearchResult> {
  // Convert date range if needed
  let apiFilters = { ...filters };
  
  if (filters.dateRange && filters.dateRange !== 'all') {
    const dateRange = convertDateRangeToDateRange(filters.dateRange);
    apiFilters.dateFrom = dateRange.from;
    apiFilters.dateTo = dateRange.to;
  }
  
  // Add query as a filter if provided
  if (query) {
    apiFilters.query = query;
  }
  
  return await searchCurriculumContent(apiFilters, page, pageSize);
}

/**
 * Get content icon by type
 */
export function getContentTypeIcon(contentType: ContentType): string {
  switch (contentType) {
    case ContentType.EXPLANATION:
      return 'BookOpen';
    case ContentType.EXERCISE:
      return 'FileText';
    case ContentType.ASSESSMENT:
      return 'FileSpreadsheet';
    case ContentType.EXAMPLE:
      return 'FileText';
    case ContentType.RESOURCE:
      return 'File';
    case ContentType.PROJECT:
      return 'Briefcase';
    case ContentType.DISCUSSION:
      return 'MessageSquare';
    default:
      return 'File';
  }
}

/**
 * Get status badge variant
 */
export function getStatusBadgeVariant(status: ContentStatus): string {
  switch (status) {
    case ContentStatus.PUBLISHED:
      return 'success';
    case ContentStatus.DRAFT:
      return 'secondary';
    case ContentStatus.REVIEW:
      return 'warning';
    case ContentStatus.APPROVED:
      return 'primary';
    case ContentStatus.ARCHIVED:
      return 'outline';
    case ContentStatus.REJECTED:
      return 'destructive';
    default:
      return 'outline';
  }
}
