import { Calendar, User, Send, Loader2, Search, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function SearchStep({ message, setMessage, loading, onSearch, allEmployees }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!message || !allEmployees || allEmployees.length === 0) {
      setFilteredEmployees([]);
      return;
    }

    const words = message.split(/\s+/);
    const searchTerms = words.filter(word => word.length > 2);

    if (searchTerms.length === 0) {
      setFilteredEmployees([]);
      return;
    }

    const matches = allEmployees.filter(employee => {
      const employeeNameLower = employee.name.toLowerCase();
      return searchTerms.some(term => 
        employeeNameLower.includes(term.toLowerCase())
      );
    });

    setFilteredEmployees(matches);
    setShowSuggestions(matches.length > 0 && !selectedEmployee);
  }, [message, allEmployees, selectedEmployee]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    setSelectedEmployee(null);
  };

  const replaceMatchedTerm = (original, term, replacement) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi'); 
    return original.replace(regex, replacement);
  };

  const handleEmployeeSelect = (employee) => {
    const words = message.split(/\s+/);
    const searchTerms = words.filter(w => w.length > 2);

    const matchedTerm = searchTerms.find(term =>
      employee.name.toLowerCase().includes(term.toLowerCase())
    );

    let newMessage = message;

    if (matchedTerm) {
      newMessage = replaceMatchedTerm(message, matchedTerm, employee.name);
    } else {
      newMessage = `${message.trim()} ${employee.name}`;
    }

    // Update message with full name
    setMessage(newMessage.trim());
    setSelectedEmployee(employee);
    setShowSuggestions(false);
  };

  const handleRemoveSelection = () => {
    setSelectedEmployee(null);
  };

  const handleSearch = () => {
    if (selectedEmployee) {
      onSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Schedule a Meeting</h1>
          <p className="text-gray-600">Find the perfect time to connect</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6 relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your meeting request
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-4 text-gray-400 w-5 h-5 pointer-events-none z-10" />
              <textarea
                ref={inputRef}
                value={message}
                onChange={handleMessageChange}
                onFocus={() => filteredEmployees.length > 0 && setShowSuggestions(true)}
                placeholder="e.g., Hello, I'm John and I have an issue I'd like to discuss. I would like to know the schedule of Justin"
                rows="4"
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-900 resize-none"
              />
            </div>

            {showSuggestions && filteredEmployees.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-20 w-full mt-2 bg-white border-2 border-blue-200 rounded-xl shadow-xl max-h-60 overflow-y-auto"
              >
                <div className="p-2">
                  <div className="text-xs font-semibold text-gray-500 px-3 py-2">
                    Detected Employees
                  </div>
                  {filteredEmployees.map((employee, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleEmployeeSelect(employee)}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-3 group"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 group-hover:text-blue-600">
                          {employee.name}
                        </div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Employee Badge */}
            {selectedEmployee && (
              <div className="mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {selectedEmployee.name}
                  </div>
                  <div className="text-xs text-gray-600">{selectedEmployee.email}</div>
                </div>
                <button
                  onClick={handleRemoveSelection}
                  className="ml-2 p-1 hover:bg-red-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleSearch}
            disabled={loading || !selectedEmployee}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Checking Availability...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Check Availability
              </>
            )}
          </button>

          {/* Tip when no employee detected */}
          {!selectedEmployee && message.trim().length > 10 && filteredEmployees.length === 0 && (
            <div className="mt-3 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
              Tip: Include an employee's name in your message to see suggestions
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Powered by Google Calendar • Secure & Private</p>
        </div>
      </div>
    </div>
  );
}