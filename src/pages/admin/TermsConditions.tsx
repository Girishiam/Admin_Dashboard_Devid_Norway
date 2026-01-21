import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bars3Icon, 
  PencilIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { BASE_URL } from '../../api_integration';

function TermsConditions() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const editorRef = useRef<HTMLDivElement>(null);

  const initialContent = `
    <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #1f2937;">Acceptance of Terms</h2>
    <p style="margin-bottom: 1.5rem; color: #1f2937; line-height: 1.6; font-size: 0.875rem;">By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use this service.</p>

    <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #1f2937;">Use License</h2>
    <p style="margin-bottom: 0.75rem; color: #1f2937; line-height: 1.6; font-size: 0.875rem;">Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
    <ul style="list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1.5rem;">
      <li style="margin-bottom: 0.5rem; color: #1f2937; font-size: 0.875rem;">Modify or copy the materials</li>
      <li style="margin-bottom: 0.5rem; color: #1f2937; font-size: 0.875rem;">Use the materials for any commercial purpose</li>
      <li style="margin-bottom: 0.5rem; color: #1f2937; font-size: 0.875rem;">Attempt to decompile or reverse engineer any software</li>
      <li style="margin-bottom: 0.5rem; color: #1f2937; font-size: 0.875rem;">Remove any copyright or proprietary notations</li>
      <li style="margin-bottom: 0.5rem; color: #1f2937; font-size: 0.875rem;">Transfer the materials to another person</li>
    </ul>

    <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #1f2937;">User Account</h2>
    <p style="margin-bottom: 0.75rem; color: #1f2937; line-height: 1.6; font-size: 0.875rem;">If you create an account on our website, you are responsible for:</p>
    <ul style="list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1.5rem;">
      <li style="margin-bottom: 0.5rem; color: #1f2937; font-size: 0.875rem;">Maintaining the confidentiality of your account and password</li>
      <li style="margin-bottom: 0.5rem; color: #1f2937; font-size: 0.875rem;">Restricting access to your computer and devices</li>
      <li style="margin-bottom: 0.5rem; color: #1f2937; font-size: 0.875rem;">All activities that occur under your account</li>
    </ul>

    <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #1f2937;">Disclaimer</h2>
    <p style="margin-bottom: 1.5rem; color: #1f2937; line-height: 1.6; font-size: 0.875rem;">The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.</p>

    <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #1f2937;">Limitations</h2>
    <p style="margin-bottom: 1.5rem; color: #1f2937; line-height: 1.6; font-size: 0.875rem;">In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.</p>

    <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #1f2937;">Accuracy of Materials</h2>
    <p style="margin-bottom: 1.5rem; color: #1f2937; line-height: 1.6; font-size: 0.875rem;">The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on our website are accurate, complete, or current. We may make changes to the materials at any time without notice.</p>

    <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #1f2937;">Links</h2>
    <p style="margin-bottom: 1.5rem; color: #1f2937; line-height: 1.6; font-size: 0.875rem;">We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us. Use of any such linked website is at the user's own risk.</p>

    <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #1f2937;">Modifications</h2>
    <p style="margin-bottom: 1.5rem; color: #1f2937; line-height: 1.6; font-size: 0.875rem;">We may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then-current version of these terms of service.</p>

    <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #1f2937;">Governing Law</h2>
    <p style="margin-bottom: 1.5rem; color: #1f2937; line-height: 1.6; font-size: 0.875rem;">These terms and conditions are governed by and construed in accordance with the laws of your jurisdiction, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
  `;

  // Helper to detect if content is plain text (no HTML tags)
  const isPlainText = (text: string) => {
    return !/<[a-z][\s\S]*>/i.test(text);
  };

  const formatContent = (text: string) => {
    if (!text) return '';
    
    return text.split('\n\n').map(block => {
      const lines = block.split('\n');
      
      // Check if it's a list (starts with - or •)
      if (lines.some(line => line.trim().startsWith('-') || line.trim().startsWith('•'))) {
        return `<ul style="list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1.5rem;">
          ${lines.map(line => {
            const cleanLine = line.replace(/^[-•] /, '').trim();
            return cleanLine ? `<li style="margin-bottom: 0.5rem; color: #1f2937; font-size: 0.875rem;">${cleanLine}</li>` : '';
          }).join('')}
        </ul>`;
      }
      
      // Check if it's a header (short, no period at end, or title cased)
      const isHeader = block.length < 80 && !block.trim().endsWith('.');
      
      if (isHeader) {
        return `<h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #1f2937;">${block}</h2>`;
      }
      
      // Paragraph
      return `<p style="margin-bottom: 1.5rem; color: #1f2937; line-height: 1.6; font-size: 0.875rem;">${block}</p>`;
    }).join('');
  };

  const fetchTerms = async () => {
    try {
      const response = await fetch(`${BASE_URL}admin/terms`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        let loadedContent = data.content || initialContent;
        // Auto-format if it looks like plain text
        if (loadedContent && isPlainText(loadedContent)) {
          console.log('Detected plain text, auto-formatting...');
          loadedContent = formatContent(loadedContent);
        }
        setContent(loadedContent);
        
        if (data.updated_at) {
          const date = new Date(data.updated_at);
          setLastUpdated(date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching terms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const applyFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const loadTemplate = () => {
    if (confirm('This will replace your current content with the default template. Are you sure?')) {
      if (editorRef.current) {
        editorRef.current.innerHTML = initialContent;
      }
    }
  };

  const handleAutoFormat = () => {
    if (editorRef.current) {
      const currentText = editorRef.current.innerText; // Get plain text
      editorRef.current.innerHTML = formatContent(currentText);
    }
  };

  const handleSave = async () => {
    setIsEditing(false);
    const newContent = editorRef.current?.innerHTML;
    
    if (!newContent) return;

    try {
      const response = await fetch(`${BASE_URL}admin/terms/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: newContent })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Saved content:', data);
        if (data.updated_at) {
          const date = new Date(data.updated_at);
          setLastUpdated(date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }));
        }
        alert('Terms & Conditions updated successfully!');
        setContent(newContent);
      } else {
        console.error('Failed to update terms');
        alert('Failed to update Terms & Conditions.');
      }
    } catch (error) {
      console.error('Error saving terms:', error);
      alert('Error saving Terms & Conditions.');
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#f3f4f6]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#07657E]"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen relative" style={{ backgroundColor: '#f3f4f6' }}>
      {/* Edit Button - Top Right */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-white text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm border border-gray-200"
        >
          <PencilIcon className="w-4 h-4" />
          <span>{isEditing ? 'Done Editing' : 'Edit'}</span>
        </button>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Clickable Logo */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center gap-3 mb-6 mx-auto hover:opacity-80 transition-opacity"
          >
            <img 
              src="/main-logo.png" 
              alt="Logo" 
              className="w-16 h-16 object-contain"
            />
          </button>
          
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Terms & Conditions
          </h1>
          <p className="text-sm text-gray-600">Last updated: {lastUpdated}</p>
        </div>

        {/* Formatting Toolbar (shown only in edit mode) */}
        {isEditing && (
          <div className="mb-4 p-3 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex gap-2 flex-wrap items-center">
              <button
                onClick={() => applyFormatting('bold')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Bold"
              >
                <span className="font-bold text-gray-700">B</span>
              </button>
              <button
                onClick={() => applyFormatting('italic')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Italic"
              >
                <span className="italic text-gray-700">I</span>
              </button>
              <button
                onClick={() => applyFormatting('underline')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Underline"
              >
                <span className="text-gray-700 font-bold underline">U</span>
              </button>
              <button
                onClick={() => applyFormatting('insertUnorderedList')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Bullet List"
              >
                <Bars3Icon className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => applyFormatting('insertOrderedList')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Numbered List"
              >
                <span className="text-gray-700 font-bold">1.</span>
              </button>
              
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={handleAutoFormat}
                  className="px-4 py-2 border border-blue-200 text-blue-700 bg-blue-50 rounded-lg font-semibold text-sm hover:bg-blue-100 transition-all flex items-center gap-2"
                  title="Auto-Format Content"
                >
                  <span className="w-4 h-4 flex items-center justify-center font-bold">✨</span>
                  <span className="hidden sm:inline">Auto Format</span>
                </button>
                <button
                  onClick={loadTemplate}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-all flex items-center gap-2"
                  title="Load Default Template"
                >
                  <ArrowPathIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Reset Default</span>
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-all"
                  style={{ backgroundColor: '#07657E' }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
          <div
            ref={editorRef}
            contentEditable={isEditing}
            suppressContentEditableWarning
            dangerouslySetInnerHTML={{ __html: content || initialContent }}
            className={`outline-none ${isEditing ? 'border-2 border-dashed border-gray-400 p-4 rounded-lg' : ''} prose max-w-none`}
            style={{ minHeight: '600px' }}
          />
        </div>
      </div>
    </div>
  );
}

export default TermsConditions;
