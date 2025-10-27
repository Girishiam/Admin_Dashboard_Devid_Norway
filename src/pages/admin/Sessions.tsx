import React, { useState } from 'react';
import { 
  PlusIcon, 
  TrashIcon, 
  XMarkIcon, 
  PlayIcon,
  MusicalNoteIcon
} from '@heroicons/react/24/outline';

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
  onSave: (sound: Omit<BackgroundSound, 'id'>) => void;
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
}

// Add Background Sound Modal
function AddBackgroundModal({ isOpen, onClose, onSave }: AddBackgroundModalProps) {
  const [soundFile, setSoundFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (soundFile) {
      onSave({ name: soundFile.name.replace(/\.[^/.]+$/, ''), url: URL.createObjectURL(soundFile) });
      setSoundFile(null);
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
              disabled={!soundFile}
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
function ManageMoodQuestionsModal({ isOpen, onClose, mood, onSave }: ManageMoodQuestionsModalProps) {
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
                    onClick={() => removeQuestion(question.id)}
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
                            onClick={() => removeOption(question.id, option.id)}
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
  const itemsPerPage = 5;

  const [sessions] = useState<Session[]>(
    Array.from({ length: 25 }, (_, i) => ({
      id: `${i + 1}`,
      userName: i === 0 ? 'Devon Lane' : i === 1 ? 'Foysal Rahman' : i === 2 ? 'Hari Danang' : i === 3 ? 'Floyd Miles' : 'Eleanor Pena',
      averageMood: i % 3 === 0 ? 'Tired' : 'Stressed',
      afterSession: i % 2 === 0 ? 'Average' : 'Excellent'
    }))
  );

  const [backgroundSounds, setBackgroundSounds] = useState<BackgroundSound[]>([
    { id: '1', name: 'Forest sound', url: '#' },
    { id: '2', name: 'Bird sound', url: '#' },
    { id: '3', name: 'Wave sound', url: '#' },
    { id: '4', name: 'Wave sound', url: '#' },
    { id: '5', name: 'Wave sound', url: '#' }
  ]);

  const [moods, setMoods] = useState<Mood[]>([
    { 
      id: '1', 
      name: 'Sadness', 
      questions: [
        {
          id: 'q1',
          question: "What's making you feel sad today?",
          options: [
            { id: 'o1', text: "Personal loss or grief" },
            { id: 'o2', text: "Feeling lonely or isolated" },
            { id: 'o3', text: "Disappointment or failure" },
            { id: 'o4', text: "Overwhelmed by responsibilities" },
            { id: 'o5', text: "Not sure, just feeling down" }
          ]
        },
        {
          id: 'q2',
          question: "How long have you been feeling this way?",
          options: [
            { id: 'o6', text: "Just today" },
            { id: 'o7', text: "A few days" },
            { id: 'o8', text: "A week or more" },
            { id: 'o9', text: "Several weeks" }
          ]
        }
      ]
    },
    { 
      id: '2', 
      name: 'Tired', 
      questions: [
        {
          id: 'q3',
          question: "What's making you feel tired today?",
          options: [
            { id: 'o10', text: "Didn't sleep well last night" },
            { id: 'o11', text: "Feeling mentally drained" },
            { id: 'o12', text: "Physically exhausted" },
            { id: 'o13', text: "Emotionally tired or stressed" },
            { id: 'o14', text: "Had a long or busy day" },
            { id: 'o15', text: "Not sure, just feeling low on energy" }
          ]
        }
      ]
    },
    { 
      id: '3', 
      name: 'Stressed', 
      questions: [
        {
          id: 'q4',
          question: "What's causing your stress?",
          options: [
            { id: 'o16', text: "Work or school pressure" },
            { id: 'o17', text: "Financial concerns" },
            { id: 'o18', text: "Relationship issues" },
            { id: 'o19', text: "Health worries" },
            { id: 'o20', text: "Too many responsibilities" },
            { id: 'o21', text: "Uncertain about the future" }
          ]
        },
        {
          id: 'q5',
          question: "How are you coping with stress?",
          options: [
            { id: 'o22', text: "Taking breaks when needed" },
            { id: 'o23', text: "Talking to someone" },
            { id: 'o24', text: "Exercise or physical activity" },
            { id: 'o25', text: "Not coping well" }
          ]
        }
      ]
    },
    { 
      id: '4', 
      name: 'Anxiety', 
      questions: [
        {
          id: 'q6',
          question: "What triggers your anxiety?",
          options: [
            { id: 'o26', text: "Upcoming events or deadlines" },
            { id: 'o27', text: "Social situations" },
            { id: 'o28', text: "Health concerns" },
            { id: 'o29', text: "Fear of the unknown" },
            { id: 'o30', text: "Past experiences" },
            { id: 'o31', text: "No specific trigger" }
          ]
        }
      ]
    },
    { 
      id: '5', 
      name: 'Calm', 
      questions: [
        {
          id: 'q7',
          question: "What helps you feel calm?",
          options: [
            { id: 'o32', text: "Meditation or breathing exercises" },
            { id: 'o33', text: "Spending time in nature" },
            { id: 'o34', text: "Listening to music" },
            { id: 'o35', text: "Being with loved ones" },
            { id: 'o36', text: "Having quiet time alone" },
            { id: 'o37', text: "Physical exercise" }
          ]
        }
      ]
    }
  ]);

  const [voices] = useState(['Male', 'Female']);

  const totalPages = Math.ceil(sessions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSessions = sessions.slice(startIndex, endIndex);

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

  const handleAddBackground = (sound: Omit<BackgroundSound, 'id'>) => {
    setBackgroundSounds([...backgroundSounds, { ...sound, id: String(Date.now()) }]);
  };

  const handleAddMood = (moodName: string) => {
    setMoods([...moods, { id: String(Date.now()), name: moodName, questions: [] }]);
  };

  const handleMoodClick = (mood: Mood) => {
    setSelectedMood(mood);
    setShowQuestionsModal(true);
  };

  const handleSaveMoodQuestions = (updatedMood: Mood) => {
    setMoods(moods.map(m => m.id === updatedMood.id ? updatedMood : m));
  };

  const handleDeleteMood = (moodId: string) => {
    setMoods(moods.filter(m => m.id !== moodId));
  };

  return (
    <div className="w-full">
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
                  {currentSessions.map((session, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900">{session.userName}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{session.averageMood}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{session.afterSession}</td>
                    </tr>
                  ))}
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
                      onClick={() => setBackgroundSounds(backgroundSounds.filter(s => s.id !== sound.id))}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>

                    <button 
                      className="w-14 h-14 rounded-full flex items-center justify-center text-white hover:opacity-90 transition-all"
                      style={{ backgroundColor: '#07657E' }}
                    >
                      <PlayIcon className="w-6 h-6" />
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
                  <div key={mood.id} className="group relative">
                    <button
                      onClick={() => handleMoodClick(mood)}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg text-sm font-medium hover:border-gray-400 transition-colors"
                    >
                      {mood.name}
                    </button>
                    <button
                      onClick={() => handleDeleteMood(mood.id)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
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
      <ManageMoodQuestionsModal
        isOpen={showQuestionsModal}
        onClose={() => setShowQuestionsModal(false)}
        mood={selectedMood}
        onSave={handleSaveMoodQuestions}
      />
    </div>
  );
}

export default Sessions;
