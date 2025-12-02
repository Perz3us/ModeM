'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface Option {
  id: number | string;
  name: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: number | string;
  onChange: (value: number | string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className = '',
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const selectedOption = options.find((opt) => opt.id === value);
    if (selectedOption) {
      setSearch(selectedOption.name);
    } else {
      setSearch('');
    }
  }, [value, options]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Reset search to selected value on close if no new selection was made
        const selectedOption = options.find((opt) => opt.id === value);
        if (selectedOption) {
          setSearch(selectedOption.name);
        } else {
          setSearch('');
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [options, value]);

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (option: Option) => {
    onChange(option.id);
    setSearch(option.name);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className="input"
          placeholder={placeholder}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          style={{ 
            paddingRight: '2.5rem',
            cursor: 'pointer' // Make it feel like a select
          }}
        />
        <div
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-gray-400"
        >
          <ChevronDown size={16} />
        </div>
      </div>

      {isOpen && (
        <div
          className="absolute z-50 w-full mt-1 overflow-hidden rounded-md shadow-lg"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => handleSelect(option)}
                style={{
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  background: value === option.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  color: value === option.id ? 'var(--primary)' : 'var(--foreground)',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    value === option.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent';
                }}
              >
                {option.name}
              </div>
            ))
          ) : (
            <div style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>
              No subjects found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
