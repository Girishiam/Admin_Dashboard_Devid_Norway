import React, { useState } from 'react';
import { 
  PlusIcon, 
  TrashIcon, 
  XMarkIcon, 
  PlayIcon,
  PauseIcon,
  MusicalNoteIcon
} from '@heroicons/react/24/outline';
import { BASE_URL, MEDIA_BASE_URL } from '../../api_integration';
import { AlertModal } from '../../components/ui/AlertModal';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';

interface Session {
  id: string;
  userName: string;
  averageMood: string;
  afterSession: string;
}

interface BackgroundSound {
  id: string;
  name: string;
  url: string;
}

interface MoodOption {
  id: string;
  text: string;
}

interface MoodQuestion {
  id: string;
  question: string;
  options: MoodOption[];
}

interface Mood {
  id: string;
  name: string;
  questions: MoodQuestion[];
}

interface AddBackgroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, file: File) => Promise<void>;
}

interface AddMoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (moodName: string) => void;
}

interface ManageMoodQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mood: Mood | null;
  onSave: (mood: Mood) => void;
  onDeleteQuestion: (questionId: string) => void;
  onDeleteOption: (optionId: string) => void;
}

// Add Background Sound Modal
function AddBackgroundModal({ isOpen, onClose, onSave }: AddBackgroundModalProps) {
  const [soundFile, setSoundFile] = useState<File | null>(null);
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (soundFile && name.trim()) {
      await onSave(name, soundFile);
      setSoundFile(null);
      setName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add Background</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter background name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-[#006699] transition-all text-sm"
              required
            />
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center mb-6">
            <label className="cursor-pointer flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <MusicalNoteIcon className="w-8 h-8 text-gray-400" />
              </div>
              <span className="text-sm text-gray-500">
                {soundFile ? soundFile.name : 'Add new music'}
              </span>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSoundFile(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-all text-sm flex items-center justify-center gap-2"
              style={{ backgroundColor: '#006699' }}
              disabled={!soundFile || !name.trim()}
            >
              <PlusIcon className="w-4 h-4" />
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Simple Add Mood Modal
function AddMoodModal({ isOpen, onClose, onSave }: AddMoodModalProps) {
  const [moodName, setMoodName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (moodName.trim()) {
      onSave(moodName);
      setMoodName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add New Mood</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Mood Name</label>
            <input
              type="text"
              value={moodName}
              onChange={(e) => setMoodName(e.target.value)}
              placeholder="Enter mood name (e.g., Happy, Anxious)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-[#006699] transition-all text-sm"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-all text-sm"
              style={{ backgroundColor: '#006699' }}
            >
              Add Mood
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Manage Mood Questions Modal - CENTERED & SMALLER
// Manage Mood Questions Modal - FIXED TOP CUT-OFF
// Manage Mood Questions Modal - PROPERLY CENTERED WITHOUT TOP CUT-OFF
function ManageMoodQuestionsModal({ isOpen, onClose, mood, onSave, onDeleteQuestion, onDeleteOption }: ManageMoodQuestionsModalProps) {
  const [questions, setQuestions] = useState<MoodQuestion[]>(mood?.questions || []);

  React.useEffect(() => {
    if (mood) {
      setQuestions(mood.questions);
    }
  }, [mood]);

  if (!isOpen || !mood) return null;

  const addQuestion = () => {
    setQuestions([...questions, { 
      id: String(Date.now()), 
      question: '', 
      options: [{ id: String(Date.now() + Math.random()), text: '' }] 
    }]);
  };

  const updateQuestion = (questionId: string, text: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, question: text } : q
    ));
  };

  const removeQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const addOption = (questionId: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, options: [...q.options, { id: String(Date.now() + Math.random()), text: '' }] }
        : q
    ));
  };

  const updateOption = (questionId: string, optionId: string, text: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, options: q.options.map(o => o.id === optionId ? { ...o, text } : o) }
        : q
    ));
  };

  const removeOption = (questionId: string, optionId: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, options: q.options.filter(o => o.id !== optionId) }
        : q
    ));
  };

  const handleSave = () => {
    onSave({ ...mood, questions });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col" style={{ maxHeight: '85vh' }}>
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">Manage Questions - {mood.name}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {questions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No questions yet. Click "Add Question" to get started.</p>
            </div>
          ) : (
            questions.map((question, qIndex) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Question {qIndex + 1}
                    </label>
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-[#006699] text-sm"
                      placeholder="Enter your question"
                    />
                  </div>
                  <button
                    onClick={() => onDeleteQuestion(question.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors mt-7"
                  >
                    <TrashIcon className="w-5 h-5 text-red-600" />
                  </button>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900">Options</label>
                  <div className="space-y-2">
                    {question.options.map((option, oIndex) => (
                      <div key={option.id} className="flex items-center gap-2 ml-6">
                        <input type="radio" disabled className="flex-shrink-0" />
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => updateOption(question.id, option.id, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-[#006699] text-sm"
                          placeholder={`Option ${oIndex + 1}`}
                        />
                        {question.options.length > 1 && (
                          <button
                            onClick={() => {
                              if (option.id.length > 10) {
                                removeOption(question.id, option.id);
                              } else {
                                onDeleteOption(option.id);
                              }
                            }}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
                          >
                            <XMarkIcon className="w-4 h-4 text-red-600" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => addOption(question.id)}
                    className="text-sm font-medium hover:underline ml-6"
                    style={{ color: '#006699' }}
                  >
                    + Add option
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Add Question Button */}
          <button
            onClick={addQuestion}
            className="w-full px-4 py-3 text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
            style={{ backgroundColor: '#006699' }}
          >
            <PlusIcon className="w-5 h-5" />
            Add Question
          </button>
        </div>

        {/* Fixed Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-all text-sm"
            style={{ backgroundColor: '#006699' }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}



// Main Sessions Component - SLIGHTLY SMALLER
function Sessions() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  
  const [sessions, setSessions] = useState<Session[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Alert Modal State
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('error');

  const showNotification = (message: string, type: 'success' | 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  // Delete Confirmation State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteType, setDeleteType] = useState<'background' | 'mood' | 'question' | 'option' | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const confirmDelete = (type: 'background' | 'mood' | 'question' | 'option', id: string) => {
    setDeleteType(type);
    setItemToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (deleteType === 'background') {
      handleDeleteBackground();
    } else if (deleteType === 'mood') {
      handleDeleteMood();
    } else if (deleteType === 'question') {
      handleDeleteMoodQuestion();
    } else if (deleteType === 'option') {
      handleDeleteOption();
    }
  };

  const fetchSessions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}admin/sessions?page=${currentPage}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
         if (data.sessions) {
           const mappedSessions = data.sessions.map((session: any, index: number) => ({
             id: String(index), // API doesn't seem to return ID, using index for now
             userName: session.username,
             averageMood: session.average_mood,
             afterSession: session.session_mood
           }));
           setSessions(mappedSessions);
         }
         if (data.pagination) {
           setTotalPages(data.pagination.total_pages);
         }
      } else {
        console.error('Failed to fetch sessions');
        setError('Failed to fetch sessions');
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError('Error connecting to server');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSessions();
  }, [currentPage]);

  const [backgroundSounds, setBackgroundSounds] = useState<BackgroundSound[]>([]);

  const fetchBackgrounds = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}admin/backgrounds`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        const mappedSounds = data.map((bg: any) => {
          let audioPath = bg.audio_file;
          if (audioPath.startsWith('http')) {
             return {
               id: String(bg.id),
               name: bg.name,
               url: audioPath
             };
          }
          
          // Ensure path starts with /
          if (!audioPath.startsWith('/')) {
             audioPath = '/' + audioPath;
          }

          // Ensure /media prefix if not present (assuming API returns relative path from media root)
          if (!audioPath.startsWith('/media')) {
             audioPath = '/media' + audioPath;
          }

          return {
            id: String(bg.id),
            name: bg.name,
            url: `${MEDIA_BASE_URL}${audioPath}`
          };
        });
        setBackgroundSounds(mappedSounds);
      }
    } catch (error) {
      console.error('Error fetching backgrounds:', error);
    }
  };

  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const handlePlay = (sound: BackgroundSound) => {
    if (playingId === sound.id) {
      // Toggle pause if same sound
      if (currentAudio) {
        if (currentAudio.paused) {
          currentAudio.play();
        } else {
          currentAudio.pause();
          setPlayingId(null);
        }
      }
    } else {
      // Stop previous
      if (currentAudio) {
        currentAudio.pause();
      }
      // Play new
      const newAudio = new Audio(sound.url);
      newAudio.onended = () => setPlayingId(null);
      newAudio.play().catch(e => {
        console.error("Playback failed", e);
        showNotification("Failed to play audio", "error");
      });
      setCurrentAudio(newAudio);
      setPlayingId(sound.id);
    }
  };

  React.useEffect(() => {
    fetchBackgrounds();
    return () => {
      // Cleanup audio on unmount
      if (currentAudio) {
        currentAudio.pause();
      }
    };
  }, []);

  const [moods, setMoods] = useState<Mood[]>([]);

  const fetchMoods = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}admin/mood-questions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      const moodsData = data.moods || (Array.isArray(data) ? data : []);
      
      if (response.ok) {
        const mappedMoods = moodsData.map((m: any) => ({
          id: String(m.mood_id || m.id),
          name: m.mood_name || m.name,
          questions: Array.isArray(m.questions) ? m.questions.map((q: any) => ({
            id: String(q.id),
            question: q.question,
            options: Array.isArray(q.options) ? q.options.map((opt: any) => ({
              id: String(opt.id),
              text: opt.option_text
            })) : []
          })) : []
        }));
        setMoods(mappedMoods);
      }
    } catch (error) {
      console.error('Error fetching moods:', error);
    }
  };

  // Sync selectedMood with moods update (so modal shows latest questions)
  React.useEffect(() => {
    if (selectedMood) {
      const updated = moods.find(m => m.id === selectedMood.id);
      if (updated) setSelectedMood(updated);
    }
  }, [moods]);

  React.useEffect(() => {
    fetchMoods();
  }, []);

  const [voices] = useState(['Male', 'Female']);

  // Removed client-side slicing
  const currentSessions = sessions;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const handleAddBackground = async (name: string, file: File) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', name);
      formData.append('audio_file', file);

      const response = await fetch(`${BASE_URL}admin/backgrounds/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        fetchBackgrounds(); // Refresh list
        showNotification('Background added successfully', 'success');
      } else {
        if (response.status === 413) {
           showNotification('File is too large using 5mb less', 'error');
           // console.error('Failed to add background: 413 Payload Too Large');
        } else {
           console.error('Failed to add background:', response.statusText);
           showNotification('Failed to add background', 'error');
        }
      }
    } catch (error) {
      console.error('Error adding background:', error);
      showNotification('Error connecting to server', 'error');
    }
  };

  const handleDeleteBackground = async () => {
    if (!itemToDelete) return;
    const id = itemToDelete;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}admin/backgrounds/${id}/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setPlayingId(null);
        if (currentAudio) {
           currentAudio.pause();
        }
        fetchBackgrounds();
        showNotification('Background deleted successfully', 'success');
      } else {
        console.error('Failed to delete background');
        showNotification('Failed to delete background', 'error');
      }
    } catch (error) {
      console.error('Error deleting background:', error);
      showNotification('Error connecting to server', 'error');
    }
  };

  const handleAddMood = async (moodName: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}admin/moods/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: moodName })
      });

      if (response.ok) {
        fetchMoods();
        showNotification('Mood added successfully', 'success');
      } else {
        showNotification('Failed to add mood', 'error');
      }
    } catch (error) {
      console.error('Error adding mood:', error);
      showNotification('Error connecting to server', 'error');
    }
  };

  const handleDeleteMood = async () => {
    if (!itemToDelete) return;
    const id = itemToDelete;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}admin/moods/${id}/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchMoods();
        showNotification('Mood deleted successfully', 'success');
      } else {
        showNotification('Failed to delete mood', 'error');
      }
    } catch (error) {
      showNotification('Error deleting mood', 'error');
    }
  };

  const handleDeleteMoodQuestion = async () => {
    if (!itemToDelete) return;
    const id = itemToDelete;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}admin/mood-questions/${id}/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchMoods();
        showNotification('Question deleted successfully', 'success');
      } else {
        showNotification('Failed to delete question', 'error');
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      showNotification('Error deleting question', 'error');
    }
  };

  const handleDeleteOption = async () => {
    if (!itemToDelete) return;
    const id = itemToDelete;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}admin/question-options/${id}/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchMoods();
        showNotification('Option deleted successfully', 'success');
      } else {
        showNotification('Failed to delete option', 'error');
      }
    } catch (error) {
      console.error('Error deleting option:', error);
      showNotification('Error deleting option', 'error');
    }
  };

  const handleMoodClick = (mood: Mood) => {
    setSelectedMood(mood);
    setShowQuestionsModal(true);
  };

  const handleAddOptions = async (questionId: string, options: string[]) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}admin/mood-questions/${questionId}/options/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ options })
      });

      if (!response.ok) {
        throw new Error('Failed to add options');
      }
    } catch (error) {
      console.error('Error adding options:', error);
      throw error; // Re-throw to handle in the batch save
    }
  };

  const handleAddNewQuestions = async (moodId: string, questions: { question: string, options: string[] }[]) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}admin/mood-questions/add-with-options`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          mood_id: moodId,
          questions 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add new questions');
      }
    } catch (error) {
      console.error('Error adding new questions:', error);
      throw error;
    }
  };

  const handleSaveMoodQuestions = async (updatedMood: Mood) => {
    try {
      const promises: Promise<any>[] = [];
      const newQuestionsPayload: { question: string, options: string[] }[] = [];

      updatedMood.questions.forEach((q) => {
        // Check if question exists (has short ID - assuming server IDs are < 10 chars, temp IDs are timestamps)
        const isExistingQuestion = q.id.length < 10; 
        
        if (isExistingQuestion) {
          // Logic for existing questions: Add newly added options
          const newOptions = q.options
            .filter(o => o.id.length > 10)
            .map(o => o.text)
            .filter(text => text.trim() !== '');

          if (newOptions.length > 0) {
            promises.push(handleAddOptions(q.id, newOptions));
          }
        } else {
          // Logic for new questions
          if (q.question.trim() !== '') {
             newQuestionsPayload.push({
               question: q.question,
               options: q.options.map(o => o.text).filter(t => t.trim() !== '')
             });
          }
        }
      });

      // Add call for new questions if any
      if (newQuestionsPayload.length > 0) {
        promises.push(handleAddNewQuestions(updatedMood.id, newQuestionsPayload));
      }

      await Promise.all(promises);
      showNotification('Changes saved successfully', 'success');
      fetchMoods(); // Refresh to get real IDs
    } catch (error) {
      console.error('Error saving changes:', error);
      showNotification('Failed to save some changes', 'error');
    }
  };

  return (
    <div className="w-full">
      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        message={alertMessage}
        type={alertType}
      />
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title={`Delete ${deleteType === 'background' ? 'Background' : deleteType === 'mood' ? 'Mood' : deleteType === 'question' ? 'Question' : 'Option'}`}
        message={`Are you sure you want to delete this ${deleteType === 'background' ? 'background sound' : deleteType === 'mood' ? 'mood' : deleteType === 'question' ? 'question' : 'option'}? This action cannot be undone.`}
      />
      <div className="bg-white rounded-xl md:rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 md:p-6 border-b border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Session Details</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 sm:p-5 md:p-6">
          {/* Left Section - Sessions Table */}
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#07657E' }}>
                    <th className="px-4 py-3 text-left text-sm font-bold text-white whitespace-nowrap">User name</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-white whitespace-nowrap">Average mood</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-white whitespace-nowrap">After session</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-red-500">
                        {error} <br/>
                        <button onClick={fetchSessions} className="mt-2 text-blue-600 underline text-sm">Retry</button>
                      </td>
                    </tr>
                  ) : currentSessions.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                        No sessions found
                      </td>
                    </tr>
                  ) : (
                    currentSessions.map((session, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-900">{session.userName}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{session.averageMood}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{session.afterSession}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-white text-gray-700 rounded-lg font-semibold text-xs hover:bg-gray-100 transition-all disabled:opacity-50 border border-gray-200"
              >
                &lt; Prev
              </button>
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && setCurrentPage(page)}
                  disabled={page === '...'}
                  className={`min-w-[32px] px-2 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                    page === currentPage ? 'text-white shadow-md' 
                    : page === '...' ? 'bg-transparent text-gray-400 cursor-default' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                  style={page === currentPage ? { backgroundColor: '#006699', borderColor: '#006699' } : {}}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 bg-white text-gray-700 rounded-lg font-semibold text-xs hover:bg-gray-100 transition-all disabled:opacity-50 border border-gray-200"
              >
                Next &gt;
              </button>
            </div>
          </div>

          {/* Right Section - Controls */}
          <div className="space-y-6">
            {/* Background Sounds */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-2 bg-white rounded-lg text-sm font-semibold text-gray-900" style={{ border: '0.68px solid #07657E' }}>
                  Total Background
                </span>
                <button
                  onClick={() => setShowBackgroundModal(true)}
                  className="px-4 py-2 text-white rounded-lg font-semibold text-xs hover:opacity-90 transition-all flex items-center gap-2"
                  style={{ backgroundColor: '#006699' }}
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Background
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {backgroundSounds.map((sound) => (
                  <div 
                    key={sound.id} 
                    className="group relative flex flex-col items-center justify-center gap-3 p-5 rounded-lg hover:shadow-md transition-all"
                    style={{ 
                      border: '0.68px solid #07657E',
                      minHeight: '140px',
                      width: '100%'
                    }}
                  >
                    <button
                      onClick={() => confirmDelete('background', sound.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>

                    <button 
                      onClick={() => handlePlay(sound)}
                      className="w-14 h-14 rounded-full flex items-center justify-center text-white hover:opacity-90 transition-all"
                      style={{ backgroundColor: '#07657E' }}
                    >
                      {playingId === sound.id ? (
                        <PauseIcon className="w-6 h-6" />
                      ) : (
                        <PlayIcon className="w-6 h-6" />
                      )}
                    </button>
                    <span className="text-xs text-gray-900 text-center font-medium" style={{ color: '#07657E' }}>
                      {sound.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Moods */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-900">
                  Total Mood
                </span>
                <button
                  onClick={() => setShowMoodModal(true)}
                  className="px-4 py-2 text-white rounded-lg font-semibold text-xs hover:opacity-90 transition-all flex items-center gap-2"
                  style={{ backgroundColor: '#006699' }}
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Mood
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {moods.map((mood) => (
              <div key={mood.id} className="relative group">
                <button
                  onClick={() => handleMoodClick(mood)}
                  className="px-6 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:border-[#006699] hover:text-[#006699] transition-all bg-white"
                >
                  {mood.name}
                </button>
                <button
                  onClick={() => confirmDelete('mood', mood.id)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </div>
            ))}
              </div>
            </div>

            {/* Voice */}
            <div>
              <span className="inline-block px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-900 mb-4">
                Total Voice
              </span>
              <div className="flex gap-2">
                {voices.map((voice, index) => (
                  <span key={index} className="px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg text-sm font-medium hover:border-gray-400 transition-colors">
                    {voice}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddBackgroundModal
        isOpen={showBackgroundModal}
        onClose={() => setShowBackgroundModal(false)}
        onSave={handleAddBackground}
      />
      <AddMoodModal
        isOpen={showMoodModal}
        onClose={() => setShowMoodModal(false)}
        onSave={handleAddMood}
      />
      {showQuestionsModal && selectedMood && (
        <ManageMoodQuestionsModal
          isOpen={showQuestionsModal}
          onClose={() => setShowQuestionsModal(false)}
          mood={selectedMood}
          onSave={handleSaveMoodQuestions}
          onDeleteQuestion={(id) => confirmDelete('question', id)}
          onDeleteOption={(id) => confirmDelete('option', id)}
        />
      )}
      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        message={alertMessage}
        type={alertType}
      />
    </div>
  );
}

export default Sessions;
