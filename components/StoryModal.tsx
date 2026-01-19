import React, { useState } from 'react';
import { Story, ModalMode } from '../types';
import { Icons } from './Icons';

interface StoryModalProps {
  mode: ModalMode;
  selectedStory: Story | null;
  onClose: () => void;
  onSubmit: (content: string) => void;
}

const StoryModal: React.FC<StoryModalProps> = ({ mode, selectedStory, onClose, onSubmit }) => {
  const [content, setContent] = useState('');

  if (mode === 'CLOSED') return null;

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content);
      setContent('');
    }
  };

  const isRead = mode === 'READ';
  const displayContent = isRead ? selectedStory?.content : content;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm transition-all duration-300">
      <div 
        className="bg-[#FAFAF8] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center border-b border-stone-200">
          <h2 className="text-stone-600 font-serif font-bold text-lg flex items-center gap-2">
            {isRead ? (
              <><Icons.Read size={18} className="text-stone-400" /> 누군가의 기억</>
            ) : (
              <><Icons.Write size={18} className="text-stone-400" /> 기억 남기기</>
            )}
          </h2>
          <button 
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors p-1 rounded-full hover:bg-stone-100"
          >
            <Icons.Close size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isRead ? (
            <div className="space-y-4">
              <p className="font-serif text-stone-700 leading-relaxed text-lg whitespace-pre-wrap">
                "{displayContent}"
              </p>
              <div className="text-right text-xs text-stone-400 font-mono mt-6">
                {selectedStory && new Date(selectedStory.createdAt).toLocaleDateString()}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-stone-500 text-sm mb-2">
                이곳에 담긴 당신의 이야기를 들려주세요.<br/>
                <span className="text-xs text-stone-400">* 당신의 이야기는 익명으로 기록됩니다.</span>
              </p>
              <textarea
                autoFocus
                className="w-full h-40 p-4 bg-white border border-stone-200 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-stone-400 text-stone-700 font-serif placeholder:font-sans placeholder:text-stone-300"
                placeholder="마음속에 담아두었던 말을 적어보세요..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <button
                onClick={handleSubmit}
                disabled={!content.trim()}
                className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
                  content.trim() 
                    ? 'bg-stone-700 text-white hover:bg-stone-800 shadow-md' 
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                기록하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryModal;
