// Documentation utilities for EdPsych-AI-Education-Platform
import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

/**
 * Component for rendering interactive documentation
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Documentation component
 */
export const InteractiveDocumentation = ({ 
  content, 
  title, 
  showTableOfContents = true,
  allowSearch = true,
  allowFeedback = true
}) => {
  const [activeSection, setActiveSection] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(null);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [sections, setSections] = useState([]);
  const [filteredContent, setFilteredContent] = useState(content);

  // Parse content and extract sections
  useEffect(() => {
    if (!content) return;

    // Extract headings for table of contents
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const extractedSections = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2];
      const id = text.toLowerCase().replace(/[^\w]+/g, '-');
      
      extractedSections.push({
        id,
        text,
        level,
      });
    }

    setSections(extractedSections);
    setFilteredContent(content);
  }, [content]);

  // Handle search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredContent(content);
      return;
    }

    const query = searchQuery.toLowerCase();
    
    // Split content into sections and filter
    const contentSections = content.split(/^#{1,3}\s+.+$/m);
    const headings = content.match(/^#{1,3}\s+.+$/gm) || [];
    
    let filteredSections = '';
    
    headings.forEach((heading, index) => {
      const sectionContent = contentSections[index + 1] || '';
      
      if (
        heading.toLowerCase().includes(query) ||
        sectionContent.toLowerCase().includes(query)
      ) {
        filteredSections += `${heading}\n${sectionContent}\n`;
      }
    });
    
    setFilteredContent(filteredSections || 'No results found for your search query.');
  }, [searchQuery, content]);

  // Handle section navigation
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behaviour: 'smooth' });
      setActiveSection(id);
    }
  };

  // Handle feedback submission
  const submitFeedback = () => {
    // In a real implementation, this would send feedback to a server
    console.log('Feedback submitted:', { rating: feedbackRating, comment: feedbackComment });
    
    // Reset form
    setFeedbackRating(null);
    setFeedbackComment('');
    setShowFeedbackForm(false);
    
    // Show thank you message
    alert('Thank you for your feedback!');
  };

  // Render markdown content with sanitization
  const renderMarkdown = (markdownContent) => {
    if (!markdownContent) return '';
    
    // Process markdown with section IDs for headings
    const processedMarkdown = markdownContent.replace(
      /^(#{1,3})\s+(.+)$/gm,
      (match, hashes, text) => {
        const id = text.toLowerCase().replace(/[^\w]+/g, '-');
        return `${hashes} <a id="${id}" class="anchor-heading">${text}</a>`;
      }
    );
    
    // Convert markdown to HTML
    const html = marked(processedMarkdown);
    
    // Sanitize HTML to prevent XSS
    const sanitizedHtml = DOMPurify.sanitize(html);
    
    return sanitizedHtml;
  };

  return (
    <div className="documentation-container">
      <div className="documentation-header">
        <h1>{title}</h1>
        
        {allowSearch && (
          <div className="documentation-search">
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search documentation"
            />
            {searchQuery && (
              <button 
                className="clear-search" 
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="documentation-content">
        {showTableOfContents && sections.length > 0 && (
          <div className="documentation-toc">
            <h2>Table of Contents</h2>
            <ul>
              {sections.map((section) => (
                <li 
                  key={section.id}
                  className={`toc-level-${section.level} ${activeSection === section.id ? 'active' : ''}`}
                >
                  <a
                    href={`#${section.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(section.id);
                    }}
                  >
                    {section.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="documentation-main">
          <div 
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(filteredContent) }}
          />
          
          {allowFeedback && (
            <div className="documentation-feedback">
              <button 
                onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                className="feedback-toggle"
              >
                {showFeedbackForm ? 'Hide Feedback Form' : 'Was this helpful?'}
              </button>
              
              {showFeedbackForm && (
                <div className="feedback-form">
                  <div className="rating-buttons">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        className={`rating-button ${feedbackRating === rating ? 'selected' : ''}`}
                        onClick={() => setFeedbackRating(rating)}
                        aria-label={`Rate ${rating} stars`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                  
                  <textarea
                    placeholder="Do you have any additional feedback? (optional)"
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    rows={4}
                  />
                  
                  <button 
                    onClick={submitFeedback}
                    className="submit-feedback"
                    disabled={!feedbackRating}
                  >
                    Submit Feedback
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Component for rendering video documentation
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Video documentation component
 */
export const VideoDocumentation = ({
  videoSrc,
  title,
  description,
  chapters = [],
  transcriptSrc,
  relatedDocs = []
}) => {
  const [activeChapter, setActiveChapter] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [videoElement, setVideoElement] = useState(null);

  // Load transcript if available
  useEffect(() => {
    if (transcriptSrc && showTranscript) {
      fetch(transcriptSrc)
        .then(response => response.text())
        .then(text => {
          setTranscript(text);
        })
        .catch(error => {
          console.error('Failed to load transcript:', error);
          setTranscript('Transcript could not be loaded.');
        });
    }
  }, [transcriptSrc, showTranscript]);

  // Handle chapter navigation
  const navigateToChapter = (index) => {
    if (!videoElement || !chapters[index]) return;
    
    const startTime = chapters[index].startTime;
    videoElement.currentTime = startTime;
    videoElement.play();
    setActiveChapter(index);
  };

  return (
    <div className="video-documentation">
      <h1>{title}</h1>
      
      <div className="video-container">
        <video
          src={videoSrc}
          controls
          ref={setVideoElement}
          onTimeUpdate={(e) => {
            // Update active chapter based on current time
            const currentTime = e.target.currentTime;
            for (let i = chapters.length - 1; i >= 0; i--) {
              if (currentTime >= chapters[i].startTime) {
                setActiveChapter(i);
                break;
              }
            }
          }}
        />
      </div>
      
      <div className="video-description">
        <p>{description}</p>
      </div>
      
      {chapters.length > 0 && (
        <div className="video-chapters">
          <h2>Chapters</h2>
          <ul>
            {chapters.map((chapter, index) => (
              <li
                key={index}
                className={activeChapter === index ? 'active' : ''}
                onClick={() => navigateToChapter(index)}
              >
                <span className="chapter-time">
                  {Math.floor(chapter.startTime / 60)}:
                  {String(Math.floor(chapter.startTime % 60)).padStart(2, '0')}
                </span>
                <span className="chapter-title">{chapter.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {transcriptSrc && (
        <div className="video-transcript">
          <button 
            onClick={() => setShowTranscript(!showTranscript)}
            className="transcript-toggle"
          >
            {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
          </button>
          
          {showTranscript && (
            <div className="transcript-content">
              {transcript ? (
                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(transcript) }} />
              ) : (
                <p>Loading transcript...</p>
              )}
            </div>
          )}
        </div>
      )}
      
      {relatedDocs.length > 0 && (
        <div className="related-documentation">
          <h2>Related Documentation</h2>
          <ul>
            {relatedDocs.map((doc, index) => (
              <li key={index}>
                <a href={doc.url}>{doc.title}</a>
                {doc.description && <p>{doc.description}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

/**
 * Component for rendering interactive tutorials
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Tutorial component
 */
export const InteractiveTutorial = ({
  title,
  steps = [],
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [userInput, setUserInput] = useState({});

  // Mark step as completed
  const completeStep = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
  };

  // Navigate to next step
  const nextStep = () => {
    completeStep();
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Tutorial completed
      if (onComplete) {
        onComplete(userInput);
      }
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle user input
  const handleInputChange = (key, value) => {
    setUserInput({
      ...userInput,
      [key]: value
    });
  };

  // Check if current step is completed
  const isCurrentStepCompleted = () => {
    return completedSteps.includes(currentStep);
  };

  // Check if current step can proceed
  const canProceed = () => {
    const step = steps[currentStep];
    
    if (step.required && step.inputKey) {
      return userInput[step.inputKey] && userInput[step.inputKey].trim() !== '';
    }
    
    return true;
  };

  return (
    <div className="interactive-tutorial">
      <h1>{title}</h1>
      
      <div className="tutorial-progress">
        <div 
          className="progress-bar"
          style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
        />
        <div className="step-indicators">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`step-indicator ${
                index === currentStep
                  ? 'active'
                  : completedSteps.includes(index)
                  ? 'completed'
                  : ''
              }`}
              onClick={() => {
                // Only allow navigation to completed steps or the current step
                if (index <= Math.max(...completedSteps, currentStep)) {
                  setCurrentStep(index);
                }
              }}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
      
      <div className="tutorial-content">
        <h2>{steps[currentStep].title}</h2>
        
        <div className="step-content">
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(steps[currentStep].content) }} />
          
          {steps[currentStep].image && (
            <img
              src={steps[currentStep].image}
              alt={steps[currentStep].imageAlt || steps[currentStep].title}
              className="step-image"
            />
          )}
          
          {steps[currentStep].video && (
            <video
              src={steps[currentStep].video}
              controls
              className="step-video"
            />
          )}
          
          {steps[currentStep].inputType && (
            <div className="step-input">
              <label htmlFor={`input-${currentStep}`}>
                {steps[currentStep].inputLabel || 'Your input:'}
                {steps[currentStep].required && <span className="required">*</span>}
              </label>
              
              {steps[currentStep].inputType === 'text' && (
                <input
                  type="text"
                  id={`input-${currentStep}`}
                  value={userInput[steps[currentStep].inputKey] || ''}
                  onChange={(e) => handleInputChange(steps[currentStep].inputKey, e.target.value)}
                  placeholder={steps[currentStep].inputPlaceholder || ''}
                  required={steps[currentStep].required}
                />
              )}
              
              {steps[currentStep].inputType === 'textarea' && (
                <textarea
                  id={`input-${currentStep}`}
                  value={userInput[steps[currentStep].inputKey] || ''}
                  onChange={(e) => handleInputChange(steps[currentStep].inputKey, e.target.value)}
                  placeholder={steps[currentStep].inputPlaceholder || ''}
                  required={steps[currentStep].required}
                  rows={5}
                />
              )}
              
              {steps[currentStep].inputType === 'select' && (
                <select
                  id={`input-${currentStep}`}
                  value={userInput[steps[currentStep].inputKey] || ''}
                  onChange={(e) => handleInputChange(steps[currentStep].inputKey, e.target.value)}
                  required={steps[currentStep].required}
                >
                  <option value="">Select an option</option>
                  {steps[currentStep].options?.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
              
              {steps[currentStep].inputType === 'checkbox' && (
                <div className="checkbox-group">
                  {steps[currentStep].options?.map((option, index) => (
                    <label key={index} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={userInput[steps[currentStep].inputKey]?.includes(option.value) || false}
                        onChange={(e) => {
                          const currentValues = userInput[steps[currentStep].inputKey] || [];
                          if (e.target.checked) {
                            handleInputChange(steps[currentStep].inputKey, [...currentValues, option.value]);
                          } else {
                            handleInputChange(
                              steps[currentStep].inputKey,
                              currentValues.filter((value) => value !== option.value)
                            );
                          }
                        }}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="tutorial-navigation">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="prev-button"
          >
            Previous
          </button>
          
          <button
            onClick={nextStep}
            disabled={!canProceed()}
            className="next-button"
          >
            {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Component for rendering API documentation
 * @param {Object} props - Component props
 * @returns {JSX.Element} - API documentation component
 */
export const ApiDocumentation = ({
  title,
  description,
  baseUrl,
  endpoints = [],
  authentication,
  examples = []
}) => {
  const [activeEndpoint, setActiveEndpoint] = useState(null);
  const [activeExample, setActiveExample] = useState(null);
  const [testResponse, setTestResponse] = useState(null);
  const [testParams, setTestParams] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Format JSON for display
  const formatJson = (json) => {
    try {
      return JSON.stringify(json, null, 2);
    } catch (error) {
      return String(json);
    }
  };

  // Handle API test
  const testEndpoint = async () => {
    if (!activeEndpoint) return;
    
    setIsLoading(true);
    setTestResponse(null);
    
    try {
      // In a real implementation, this would make an actual API call
      // For demo purposes, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTestResponse({
        status: 200,
        statusText: 'OK',
        data: {
          success: true,
          message: 'API call successful',
          params: testParams
        }
      });
    } catch (error) {
      setTestResponse({
        status: 500,
        statusText: 'Error',
        data: {
          success: false,
          message: error.message
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="api-documentation">
      <h1>{title}</h1>
      
      <div className="api-description">
        <p>{description}</p>
        <div className="api-base-url">
          <strong>Base URL:</strong> <code>{baseUrl}</code>
        </div>
      </div>
      
      {authentication && (
        <div className="api-authentication">
          <h2>Authentication</h2>
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(authentication) }} />
        </div>
      )}
      
      <div className="api-content">
        <div className="api-sidebar">
          <h2>Endpoints</h2>
          <ul>
            {endpoints.map((endpoint, index) => (
              <li
                key={index}
                className={activeEndpoint === index ? 'active' : ''}
                onClick={() => {
                  setActiveEndpoint(index);
                  setTestParams({});
                  setTestResponse(null);
                }}
              >
                <span className={`method ${endpoint.method.toLowerCase()}`}>
                  {endpoint.method}
                </span>
                <span className="path">{endpoint.path}</span>
              </li>
            ))}
          </ul>
          
          {examples.length > 0 && (
            <>
              <h2>Examples</h2>
              <ul>
                {examples.map((example, index) => (
                  <li
                    key={index}
                    className={activeExample === index ? 'active' : ''}
                    onClick={() => setActiveExample(index)}
                  >
                    {example.title}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        
        <div className="api-main">
          {activeEndpoint !== null && endpoints[activeEndpoint] && (
            <div className="endpoint-details">
              <h2>
                <span className={`method ${endpoints[activeEndpoint].method.toLowerCase()}`}>
                  {endpoints[activeEndpoint].method}
                </span>
                {endpoints[activeEndpoint].path}
              </h2>
              
              <div className="endpoint-description">
                <p>{endpoints[activeEndpoint].description}</p>
              </div>
              
              {endpoints[activeEndpoint].parameters && (
                <div className="endpoint-parameters">
                  <h3>Parameters</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Required</th>
                        <th>Description</th>
                        <th>Test</th>
                      </tr>
                    </thead>
                    <tbody>
                      {endpoints[activeEndpoint].parameters.map((param, index) => (
                        <tr key={index}>
                          <td><code>{param.name}</code></td>
                          <td>{param.type}</td>
                          <td>{param.required ? 'Yes' : 'No'}</td>
                          <td>{param.description}</td>
                          <td>
                            <input
                              type="text"
                              placeholder="Test value"
                              value={testParams[param.name] || ''}
                              onChange={(e) => {
                                setTestParams({
                                  ...testParams,
                                  [param.name]: e.target.value
                                });
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {endpoints[activeEndpoint].responses && (
                <div className="endpoint-responses">
                  <h3>Responses</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {endpoints[activeEndpoint].responses.map((response, index) => (
                        <tr key={index}>
                          <td><code>{response.code}</code></td>
                          <td>{response.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              <div className="endpoint-test">
                <h3>Test Endpoint</h3>
                <button
                  onClick={testEndpoint}
                  disabled={isLoading}
                  className="test-button"
                >
                  {isLoading ? 'Loading...' : 'Send Request'}
                </button>
                
                {testResponse && (
                  <div className="test-response">
                    <h4>Response</h4>
                    <div className="response-status">
                      Status: <code>{testResponse.status} {testResponse.statusText}</code>
                    </div>
                    <pre className="response-data">
                      {formatJson(testResponse.data)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeExample !== null && examples[activeExample] && (
            <div className="example-details">
              <h2>{examples[activeExample].title}</h2>
              
              <div className="example-description">
                <p>{examples[activeExample].description}</p>
              </div>
              
              <div className="example-code">
                <h3>Request</h3>
                <pre className="code-block">
                  {formatJson(examples[activeExample].request)}
                </pre>
                
                <h3>Response</h3>
                <pre className="code-block">
                  {formatJson(examples[activeExample].response)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Utility for rendering markdown content
 * @param {string} markdown - Markdown content
 * @returns {string} - HTML content
 */
export const renderMarkdown = (markdown) => {
  if (!markdown) return '';
  
  // Process markdown with section IDs for headings
  const processedMarkdown = markdown.replace(
    /^(#{1,3})\s+(.+)$/gm,
    (match, hashes, text) => {
      const id = text.toLowerCase().replace(/[^\w]+/g, '-');
      return `${hashes} <a id="${id}" class="anchor-heading">${text}</a>`;
    }
  );
  
  // Convert markdown to HTML
  const html = marked(processedMarkdown);
  
  // Sanitize HTML to prevent XSS
  const sanitizedHtml = DOMPurify.sanitize(html);
  
  return sanitizedHtml;
};

/**
 * Utility for generating documentation from code comments
 * @param {string} sourceCode - Source code with JSDoc comments
 * @returns {Object} - Extracted documentation
 */
export const extractDocumentation = (sourceCode) => {
  // This is a simplified implementation
  // In a real application, use a proper JSDoc parser
  
  const docBlocks = [];
  const commentRegex = /\/\*\*\s*([\s\S]*?)\s*\*\//g;
  
  let match;
  while ((match = commentRegex.exec(sourceCode)) !== null) {
    const commentBlock = match[1];
    
    // Extract description
    const descriptionMatch = commentBlock.match(/@description\s+(.*?)(?=@|\*\/|$)/s);
    const description = descriptionMatch ? descriptionMatch[1].trim() : '';
    
    // Extract params
    const paramRegex = /@param\s+{([^}]+)}\s+(\w+)\s+-\s+(.*?)(?=@|\*\/|$)/gs;
    const params = [];
    
    let paramMatch;
    while ((paramMatch = paramRegex.exec(commentBlock)) !== null) {
      params.push({
        type: paramMatch[1].trim(),
        name: paramMatch[2].trim(),
        description: paramMatch[3].trim()
      });
    }
    
    // Extract return value
    const returnMatch = commentBlock.match(/@returns\s+{([^}]+)}\s+-\s+(.*?)(?=@|\*\/|$)/s);
    const returns = returnMatch ? {
      type: returnMatch[1].trim(),
      description: returnMatch[2].trim()
    } : null;
    
    docBlocks.push({
      description,
      params,
      returns
    });
  }
  
  return docBlocks;
};

/**
 * Utility for generating documentation from TypeScript types
 * @param {string} typeDefinitions - TypeScript type definitions
 * @returns {Object} - Extracted type documentation
 */
export const extractTypeDocumentation = (typeDefinitions) => {
  // This is a simplified implementation
  // In a real application, use a proper TypeScript parser
  
  const typeBlocks = [];
  const interfaceRegex = /interface\s+(\w+)\s*{([^}]*)}/gs;
  
  let match;
  while ((match = interfaceRegex.exec(typeDefinitions)) !== null) {
    const interfaceName = match[1];
    const interfaceBody = match[2];
    
    // Extract properties
    const propertyRegex = /(\w+)(\??):\s*([^;]+);(?:\s*\/\/\s*(.*))?/g;
    const properties = [];
    
    let propertyMatch;
    while ((propertyMatch = propertyRegex.exec(interfaceBody)) !== null) {
      properties.push({
        name: propertyMatch[1].trim(),
        optional: propertyMatch[2] === '?',
        type: propertyMatch[3].trim(),
        description: propertyMatch[4] ? propertyMatch[4].trim() : ''
      });
    }
    
    typeBlocks.push({
      name: interfaceName,
      properties
    });
  }
  
  return typeBlocks;
};
