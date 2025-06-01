// @ts-check
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MultilingualSupport from '../../components/ui/MultilingualSupport';

// Mock the translation service
vi.mock('@/lib/translation-service', () => ({
  translateContent: vi.fn().mockImplementation((content, targetLang) => {
    const translations = {
      en: { title: 'Welcome', description: 'This is the welcome page.' },
      fr: { title: 'Bienvenue', description: 'Ceci est la page d\'accueil.' },
      es: { title: 'Bienvenido', description: 'Esta es la página de bienvenida.' },
      de: { title: 'Willkommen', description: 'Dies ist die Willkommensseite.' },
      zh: { title: '欢迎', description: '这是欢迎页面。' },
    };
    return Promise.resolve(translations[targetLang] || translations.en);
  }),
  detectLanguage: vi.fn().mockResolvedValue('en'),
  getSupportedLanguages: vi.fn().mockResolvedValue([
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    { code: 'es', name: 'Spanish' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
  ])
}));

describe('MultilingualSupport Component', () => {
  const mockContent = {
    title: 'Welcome',
    description: 'This is the welcome page.'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders multilingual support component correctly', async () => {
    render(<MultilingualSupport content={mockContent} />);
    
    // Check that the component renders with the content in default language
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
    expect(screen.getByText(/This is the welcome page/i)).toBeInTheDocument();
    
    // Check that language selector is present
    expect(screen.getByLabelText(/Select Language/i)).toBeInTheDocument();
  });

  it('loads supported languages on mount', async () => {
    // Import directly instead of using require
    const translationService = await import('@/lib/translation-service');
    
    render(<MultilingualSupport content={mockContent} />);
    
    // Check that supported languages were requested
    expect(translationService.getSupportedLanguages).toHaveBeenCalled();
    
    // Check that language options are displayed
    await waitFor(() => {
      expect(screen.getByRole('option', { name: /English/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /French/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /Spanish/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /German/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /Chinese/i })).toBeInTheDocument();
    });
  });

  it('changes language when selector is changed', async () => {
    // Import directly instead of using require
    const translationService = await import('@/lib/translation-service');
    
    render(<MultilingualSupport content={mockContent} />);
    
    // Find language selector
    const languageSelector = screen.getByLabelText(/Select Language/i);
    
    // Change to French
    fireEvent.change(languageSelector, { target: { value: 'fr' } });
    
    // Check that translation was requested
    expect(translationService.translateContent).toHaveBeenCalledWith(mockContent, 'fr');
    
    // Check that content is updated with French translation
    await waitFor(() => {
      expect(screen.getByText(/Bienvenue/i)).toBeInTheDocument();
      expect(screen.getByText(/Ceci est la page d'accueil/i)).toBeInTheDocument();
    });
  });

  it('detects user language automatically', async () => {
    // Import directly instead of using require
    const translationService = await import('@/lib/translation-service');
    translationService.detectLanguage.mockResolvedValue('es');
    
    render(<MultilingualSupport content={mockContent} autoDetectLanguage={true} />);
    
    // Check that language detection was called
    expect(translationService.detectLanguage).toHaveBeenCalled();
    
    // Check that content is translated to detected language (Spanish)
    await waitFor(() => {
      expect(screen.getByText(/Bienvenido/i)).toBeInTheDocument();
      expect(screen.getByText(/Esta es la página de bienvenida/i)).toBeInTheDocument();
    });
    
    // Check that language selector shows Spanish as selected
    const languageSelector = screen.getByLabelText(/Select Language/i);
    expect(languageSelector.value).toBe('es');
  });

  it('handles translation errors gracefully', async () => {
    // Import directly instead of using require
    const translationService = await import('@/lib/translation-service');
    translationService.translateContent.mockRejectedValue(new Error('Translation failed'));
    
    render(<MultilingualSupport content={mockContent} />);
    
    // Find language selector
    const languageSelector = screen.getByLabelText(/Select Language/i);
    
    // Change to German
    fireEvent.change(languageSelector, { target: { value: 'de' } });
    
    // Check that error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Translation failed/i)).toBeInTheDocument();
    });
    
    // Check that original content is still displayed
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
    expect(screen.getByText(/This is the welcome page/i)).toBeInTheDocument();
  });

  it('saves language preference', async () => {
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    
    render(<MultilingualSupport content={mockContent} savePreference={true} />);
    
    // Find language selector
    const languageSelector = screen.getByLabelText(/Select Language/i);
    
    // Change to Chinese
    fireEvent.change(languageSelector, { target: { value: 'zh' } });
    
    // Check that preference was saved to localStorage
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'preferredLanguage',
      'zh'
    );
  });

  it('loads saved language preference', async () => {
    // Mock localStorage with saved preference
    const localStorageMock = {
      getItem: vi.fn().mockReturnValue('fr'),
      setItem: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    
    // Import directly instead of using require
    const translationService = await import('@/lib/translation-service');
    
    render(<MultilingualSupport content={mockContent} savePreference={true} />);
    
    // Check that translation was requested with saved preference
    await waitFor(() => {
      expect(translationService.translateContent).toHaveBeenCalledWith(mockContent, 'fr');
    });
    
    // Check that content is translated to French
    await waitFor(() => {
      expect(screen.getByText(/Bienvenue/i)).toBeInTheDocument();
    });
    
    // Check that language selector shows French as selected
    const languageSelector = screen.getByLabelText(/Select Language/i);
    expect(languageSelector.value).toBe('fr');
  });

  it('provides text-to-speech in selected language', async () => {
    // Mock SpeechSynthesis
    const mockUtterance = {
      lang: '',
      text: '',
      rate: 1,
      pitch: 1,
      volume: 1,
    };
    
    const mockSpeechSynthesis = {
      speak: vi.fn(),
      getVoices: vi.fn().mockReturnValue([
        { lang: 'en-US', name: 'English Voice' },
        { lang: 'fr-FR', name: 'French Voice' },
      ]),
    };
    
    global.SpeechSynthesisUtterance = vi.fn().mockImplementation((text) => {
      mockUtterance.text = text;
      return mockUtterance;
    });
    
    Object.defineProperty(window, 'speechSynthesis', { value: mockSpeechSynthesis });
    
    render(<MultilingualSupport content={mockContent} textToSpeech={true} />);
    
    // Find and click text-to-speech button
    const ttsButton = screen.getByRole('button', { name: /Listen/i });
    fireEvent.click(ttsButton);
    
    // Check that speech synthesis was called with correct language
    expect(mockUtterance.lang).toMatch(/en/i);
    expect(mockUtterance.text).toContain('Welcome');
    expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    
    // Change to French
    const languageSelector = screen.getByLabelText(/Select Language/i);
    fireEvent.change(languageSelector, { target: { value: 'fr' } });
    
    // Wait for translation
    await waitFor(() => {
      expect(screen.getByText(/Bienvenue/i)).toBeInTheDocument();
    });
    
    // Click text-to-speech button again
    fireEvent.click(ttsButton);
    
    // Check that speech synthesis was called with French
    expect(mockUtterance.lang).toMatch(/fr/i);
    expect(mockUtterance.text).toContain('Bienvenue');
    expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(2);
  });

  it('handles nested content objects correctly', async () => {
    const nestedContent = {
      header: {
        title: 'Welcome',
        subtitle: 'Learn more about our platform'
      },
      body: {
        paragraph1: 'This is the first paragraph.',
        paragraph2: 'This is the second paragraph.'
      },
      footer: {
        copyright: '© 2025 EdPsych Connect'
      }
    };
    
    // Import directly instead of using require
    const translationService = await import('@/lib/translation-service');
    translationService.translateContent.mockImplementation((content, targetLang) => {
      if (targetLang === 'fr') {
        return Promise.resolve({
          header: {
            title: 'Bienvenue',
            subtitle: 'En savoir plus sur notre plateforme'
          },
          body: {
            paragraph1: 'Ceci est le premier paragraphe.',
            paragraph2: 'Ceci est le deuxième paragraphe.'
          },
          footer: {
            copyright: '© 2025 EdPsych Connect'
          }
        });
      }
      return Promise.resolve(content);
    });
    
    render(<MultilingualSupport content={nestedContent} />);
    
    // Check that nested content is displayed
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
    expect(screen.getByText(/Learn more about our platform/i)).toBeInTheDocument();
    expect(screen.getByText(/This is the first paragraph/i)).toBeInTheDocument();
    
    // Change to French
    const languageSelector = screen.getByLabelText(/Select Language/i);
    fireEvent.change(languageSelector, { target: { value: 'fr' } });
    
    // Check that nested content is translated
    await waitFor(() => {
      expect(screen.getByText(/Bienvenue/i)).toBeInTheDocument();
      expect(screen.getByText(/En savoir plus sur notre plateforme/i)).toBeInTheDocument();
      expect(screen.getByText(/Ceci est le premier paragraphe/i)).toBeInTheDocument();
    });
  });
});
