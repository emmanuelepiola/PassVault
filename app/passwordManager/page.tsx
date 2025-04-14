'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, LogOut, User, Copy, Check, Eye, EyeOff } from 'lucide-react';

interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  site: string;
  isExpanded: boolean;
  isEditing: boolean;
  isSaved: boolean;
  customParams?: {
    length?: string;
    numSpecialChars?: string;
    preferredChars?: string;
    passphrase?: string;
  };
}

export default function PasswordsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedFields, setCopiedFields] = useState<{ [key: string]: boolean }>({});
  const [passwords, setPasswords] = useState<PasswordEntry[]>([
    { id: '1', title: 'Amazon', username: '', password: '', site: '', isExpanded: false, isEditing: false, isSaved: true },
    { id: '2', title: 'Netflix', username: '', password: '', site: '', isExpanded: false, isEditing: false, isSaved: true },
    { id: '3', title: 'Apple', username: '', password: '', site: '', isExpanded: false, isEditing: false, isSaved: true },
    { id: '4', title: 'Ebay', username: '', password: '', site: '', isExpanded: false, isEditing: false, isSaved: true },
  ]);
  const [visiblePasswords, setVisiblePasswords] = useState<{ [key: string]: boolean }>({});

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setPasswords(prev => prev.map(p => {
          if (p.isExpanded) {
            // Find the last saved state of this password entry
            const savedEntry = passwords.find(saved => saved.id === p.id && saved.isSaved);
            // If there's no saved state (new entry) or there is a saved state
            return savedEntry ? { 
              ...savedEntry, 
              isExpanded: false, 
              isEditing: false 
            } : {
              ...p,
              isExpanded: false,
              isEditing: false,
              isSaved: true // Mark as saved to hide the Generate button
            };
          }
          return p;
        }));
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [passwords]);

  const toggleExpand = (id: string) => {
    setPasswords(prev =>
      prev.map(p =>
        p.id === id ? { ...p, isExpanded: !p.isExpanded } : { ...p, isExpanded: false }
      )
    );
  };

  const handleCreate = () => {
    const newEntry: PasswordEntry = {
      id: Date.now().toString(),
      title: 'Tag',
      username: '',
      password: '',
      site: '',
      isExpanded: true,
      isEditing: true,
      isSaved: false,
      customParams: {
        length: '',
        numSpecialChars: '',
        preferredChars: '',
        passphrase: ''
      }
    };
    setPasswords(prev => [newEntry, ...prev]);
  };

  const handleSave = (id: string, entry: PasswordEntry) => {
    setPasswords(prev =>
      prev.map(p => (p.id === id ? { ...entry, isEditing: false, isSaved: true } : p))
    );
  };

  const handleDelete = (id: string) => {
    setPasswords(prev => prev.filter(p => p.id !== id));
  };

  const validateCustomParams = (customParams?: PasswordEntry['customParams']) => {
    if (!customParams) return null;

    // If any custom parameter is set, validate all of them
    const hasAnyParam = customParams.length || customParams.numSpecialChars || customParams.preferredChars;
    
    if (hasAnyParam) {
      // Validate length
      if (!customParams.length || isNaN(parseInt(customParams.length))) {
        alert("Please specify a valid password length.");
        return null;
      }

      const length = parseInt(customParams.length);
      if (length < 20) {
        if (!confirm("A password length under 20 characters is not recommended for security. Would you like to proceed anyway?")) {
          return null;
        }
      }

      // Validate number of special characters
      if (!customParams.numSpecialChars || isNaN(parseInt(customParams.numSpecialChars))) {
        alert("Please specify the number of special characters.");
        return null;
      }

      const numSC = parseInt(customParams.numSpecialChars);
      if (numSC < 2) {
        alert("For better security, please set the number of special characters to at least 2.");
        return null;
      }

      // Make sure number of special characters doesn't exceed password length
      if (numSC > length) {
        alert(`The number of special characters (${numSC}) cannot exceed the password length (${length}).`);
        return null;
      }

      // Validate preferred special characters
      if (!customParams.preferredChars) {
        alert("Please specify your preferred special characters.");
        return null;
      }
      if (customParams.preferredChars.length < 2) {
        alert("Please provide at least 2 preferred special characters for better variety.");
        return null;
      }
    }

    return true;
  };

  const generateRandomPassword = (
    length: number = Math.floor(Math.random() * 11) + 20, // Random length between 20-30
    numSpecialChars: number = 2,
    preferredChars: string = "!@#$%^&*()_+-=[]{}|;:,.<>?",
    minUppercase: number = 2
  ) => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = preferredChars || "!@#$%^&*()_+-=[]{}|;:,.<>?";

    // Calculate minimum required length based on requirements
    const minRequiredLength = minUppercase + numSpecialChars + 2; // 2 is for required numbers
    if (length < minRequiredLength) {
      alert(`The password length must be at least ${minRequiredLength} to accommodate all required characters (${minUppercase} uppercase, ${numSpecialChars} special characters, and 2 numbers).`);
      return null;
    }

    // Ensure we have required uppercase and special characters
    let password = '';
    for (let i = 0; i < minUppercase; i++) {
      password += uppercase[Math.floor(Math.random() * uppercase.length)];
    }
    for (let i = 0; i < numSpecialChars; i++) {
      password += special[Math.floor(Math.random() * special.length)];
    }
    // Add at least 2 numbers
    for (let i = 0; i < 2; i++) {
      password += numbers[Math.floor(Math.random() * numbers.length)];
    }

    // Fill the rest with random characters to match exact length
    const remainingLength = length - password.length;
    const allChars = lowercase + uppercase + numbers + special;
    for (let i = 0; i < remainingLength; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  const generatePassphrasePassword = (
    passphrase: string, 
    preferredChars: string = "!@#$%^&*()_+-=[]{}|;:,.<>?",
    numSpecialChars: string = "2"
  ): string | null => {
    const words = passphrase.trim().split(/\s+/);
    if (words.length > 20) {
      alert("The passphrase contains more than 20 words. Please use a shorter phrase.");
      return null;
    }

    // Validate number of special characters
    const numSC = parseInt(numSpecialChars) || 0;
    if (numSC === 0) {
      alert("For better security, please set the number of special characters to at least 2.");
      return null;
    }

    // Validate preferred special characters
    if (preferredChars && preferredChars.length === 1) {
      alert("Please provide at least 2 preferred special characters for better variety.");
      return null;
    }

    // Get initials and randomly make them upper or lower case
    let password = words.map(word => {
      const initial = word.charAt(0);
      return Math.random() > 0.5 ? initial.toUpperCase() : initial.toLowerCase();
    }).join('');

    // Add 2 random numbers
    const numbers = '0123456789';
    for (let i = 0; i < 2; i++) {
      const pos = Math.floor(Math.random() * (password.length + 1));
      password = password.slice(0, pos) + numbers[Math.floor(Math.random() * numbers.length)] + password.slice(pos);
    }

    // Add special characters based on custom parameters
    const special = preferredChars || "!@#$%^&*()_+-=[]{}|;:,.<>?";
    const actualNumSC = Math.max(numSC, 2); // Ensure at least 2 special characters
    for (let i = 0; i < actualNumSC; i++) {
      const pos = Math.floor(Math.random() * (password.length + 1));
      password = password.slice(0, pos) + special[Math.floor(Math.random() * special.length)] + password.slice(pos);
    }

    return password;
  };

  const handleGenerate = (id: string) => {
    const entry = passwords.find(p => p.id === id);
    if (!entry) return;

    let newPassword = '';

    // Check if there's a passphrase
    if (entry.customParams?.passphrase) {
      const passphraseResult = generatePassphrasePassword(
        entry.customParams.passphrase,
        entry.customParams?.preferredChars,
        entry.customParams?.numSpecialChars
      );
      if (!passphraseResult) return;
      newPassword = passphraseResult;
    } else {
      // Validate custom parameters if any are set
      if (!validateCustomParams(entry.customParams)) return;

      // Use custom parameters or defaults
      const length = entry.customParams?.length ? parseInt(entry.customParams.length) : Math.floor(Math.random() * 11) + 20;
      const numSpecialChars = entry.customParams?.numSpecialChars ? parseInt(entry.customParams.numSpecialChars) : 2;
      const preferredChars = entry.customParams?.preferredChars;

      // If any custom parameter is set, all must be set
      if ((entry.customParams?.length || entry.customParams?.numSpecialChars || entry.customParams?.preferredChars) && 
          (!entry.customParams?.length || !entry.customParams?.numSpecialChars || !entry.customParams?.preferredChars)) {
        alert("If you set any custom parameter, you must set all of them (Length, Number of Special Characters, and Preferred Special Characters).");
        return;
      }

      const generatedPassword = generateRandomPassword(length, numSpecialChars, preferredChars);
      if (!generatedPassword) return; // Generation failed due to validation
      newPassword = generatedPassword;
    }

    // Update the password in the state
    setPasswords(prev =>
      prev.map(p =>
        p.id === id ? { ...p, password: newPassword } : p
      )
    );

    // Automatically show the generated password
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: true
    }));
  };

  const handleCopy = async (text: string, fieldId: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedFields(prev => ({ ...prev, [fieldId]: true }));
    setTimeout(() => {
      setCopiedFields(prev => ({ ...prev, [fieldId]: false }));
    }, 2000);
  };

  const handleModify = (id: string) => {
    setPasswords(prev =>
      prev.map(p => (p.id === id ? { ...p, isEditing: true } : p))
    );
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredPasswords = passwords.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen overflow-hidden bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-black/10 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <div className="w-16 h-16 flex-shrink-0">
              <svg
                className="w-full h-full"
                viewBox="0 0 180 180"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M180 90C180 139.706 139.706 180 90 180C40.2944 180 0 139.706 0 90C0 40.2944 40.2944 0 90 0C139.706 0 180 40.2944 180 90Z" fill="#54A9DA" />
                <path d="M117 63.5C117 77.5833 105.807 89 92 89C78.1929 89 67 77.5833 67 63.5C67 49.4167 78.1929 38 92 38C105.807 38 117 49.4167 117 63.5Z" fill="white" />
                <path d="M90.5 63L123 132H58L90.5 63Z" fill="white" />
              </svg>
          </div>

            <div className="flex-1 flex justify-center items-center gap-12 px-4">
              <div className="w-full max-w-xl relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search password"
                  className="w-full py-2 px-11 bg-gray-100 rounded-[10px] text-sm border border-black/5 focus:outline-none focus:ring-0 focus:bg-gray-50 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={handleCreate}
                className="px-6 py-2 bg-[#54A9DA]/50 text-gray-900 rounded-[50px] text-sm hover:bg-[#4898c9]/50 transition-colors whitespace-nowrap font-medium flex-shrink-0 border border-black/5"
          >
            Create new password
          </button>
            </div>

            <button className="text-gray-600 hover:text-gray-800 transition-colors p-2 flex-shrink-0 ml-4">
            <LogOut size={24} />
          </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4" ref={containerRef}>
        <div className="mt-24 border border-black/10 rounded-lg">
          <div className="h-[calc(100vh-160px)] overflow-y-auto overflow-x-hidden space-y-3 p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {filteredPasswords.map((entry) => (
            <div
              key={entry.id}
                className="bg-[#54A9DA]/30 rounded-lg overflow-hidden transition-all duration-200"
            >
              <div
                  className="px-6 py-3 cursor-pointer"
                onClick={() => toggleExpand(entry.id)}
              >
                {!entry.isExpanded ? (
                    <h3 className="text-black font-medium text-lg">{entry.title}</h3>
                ) : (
                  <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={entry.title}
                        className="text-black font-medium bg-transparent border-none w-full focus:outline-none focus:ring-0 placeholder-black/70 text-lg"
                      onChange={(e) =>
                        setPasswords(prev =>
                          prev.map(p =>
                            p.id === entry.id ? { ...p, title: e.target.value } : p
                          )
                        )
                      }
                        readOnly={!entry.isEditing}
                      />
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-black mb-1 text-base">User Name</label>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 relative">
                              <input
                                type="text"
                                value={entry.username}
                                className="w-full p-2 pr-10 bg-white rounded border border-black/5 focus:outline-none focus:ring-0"
                                onChange={(e) =>
                                  setPasswords(prev =>
                                    prev.map(p =>
                                      p.id === entry.id ? { ...p, username: e.target.value } : p
                                    )
                                  )
                                }
                                readOnly={!entry.isEditing}
                              />
                              <button
                                onClick={() => handleCopy(entry.username, `username-${entry.id}`)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                {copiedFields[`username-${entry.id}`] ? (
                                  <Check size={16} className="text-green-500" />
                                ) : (
                                  <Copy size={16} className="text-gray-500" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-black mb-1 text-base">Site</label>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 relative">
                              <input
                                type="text"
                                value={entry.site}
                                className="w-full p-2 pr-10 bg-white rounded border border-black/5 focus:outline-none focus:ring-0"
                                onChange={(e) =>
                                  setPasswords(prev =>
                                    prev.map(p =>
                                      p.id === entry.id ? { ...p, site: e.target.value } : p
                                    )
                                  )
                                }
                                readOnly={!entry.isEditing}
                              />
                              <button
                                onClick={() => handleCopy(entry.site, `site-${entry.id}`)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                {copiedFields[`site-${entry.id}`] ? (
                                  <Check size={16} className="text-green-500" />
                                ) : (
                                  <Copy size={16} className="text-gray-500" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-black mb-1 text-base">Password</label>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 relative">
                            <input
                              type={visiblePasswords[entry.id] ? "text" : "password"}
                              value={entry.password}
                              className="w-full p-2 pr-20 bg-white rounded border border-black/5 focus:outline-none focus:ring-0"
                              onChange={(e) =>
                                setPasswords(prev =>
                                  prev.map(p =>
                                    p.id === entry.id ? { ...p, password: e.target.value } : p
                                  )
                                )
                              }
                              readOnly={!entry.isEditing}
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                              <button
                                onClick={() => handleCopy(entry.password, `password-${entry.id}`)}
                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                {copiedFields[`password-${entry.id}`] ? (
                                  <Check size={16} className="text-green-500" />
                                ) : (
                                  <Copy size={16} className="text-gray-500" />
                                )}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePasswordVisibility(entry.id);
                                }}
                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                {visiblePasswords[entry.id] ? (
                                  <EyeOff size={16} className="text-gray-500" />
                                ) : (
                                  <Eye size={16} className="text-gray-500" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {entry.isEditing && (
                        <div>
                          <label className="block text-black mb-1 text-base">Custom parameters</label>
                          <div className="grid grid-cols-4 gap-2">
                            <input
                              type="text"
                              placeholder="Length"
                              className="p-2 bg-white rounded border border-black/5 focus:outline-none focus:ring-0"
                              value={entry.customParams?.length || ''}
                              onChange={(e) =>
                                setPasswords(prev =>
                                  prev.map(p =>
                                    p.id === entry.id
                                      ? {
                                          ...p,
                                          customParams: {
                                            ...p.customParams,
                                            length: e.target.value,
                                          },
                                        }
                                      : p
                                  )
                                )
                              }
                              readOnly={!entry.isEditing}
                            />
                            <input
                              type="text"
                              placeholder="Number of SC"
                              className="p-2 bg-white rounded border border-black/5 focus:outline-none focus:ring-0"
                              value={entry.customParams?.numSpecialChars || ''}
                              onChange={(e) =>
                                setPasswords(prev =>
                                  prev.map(p =>
                                    p.id === entry.id
                                      ? {
                                          ...p,
                                          customParams: {
                                            ...p.customParams,
                                            numSpecialChars: e.target.value,
                                          },
                                        }
                                      : p
                                  )
                                )
                              }
                              readOnly={!entry.isEditing}
                            />
                            <input
                              type="text"
                              placeholder="Preferred SC"
                              className="p-2 bg-white rounded border border-black/5 focus:outline-none focus:ring-0"
                              value={entry.customParams?.preferredChars || ''}
                              onChange={(e) =>
                                setPasswords(prev =>
                                  prev.map(p =>
                                    p.id === entry.id
                                      ? {
                                          ...p,
                                          customParams: {
                                            ...p.customParams,
                                            preferredChars: e.target.value,
                                          },
                                        }
                                      : p
                                  )
                                )
                              }
                              readOnly={!entry.isEditing}
                            />
                            <input
                              type="text"
                              placeholder="Passphrase"
                              className="p-2 bg-white rounded border border-black/5 focus:outline-none focus:ring-0"
                              value={entry.customParams?.passphrase || ''}
                              onChange={(e) =>
                                setPasswords(prev =>
                                  prev.map(p =>
                                    p.id === entry.id
                                      ? {
                                          ...p,
                                          customParams: {
                                            ...p.customParams,
                                            passphrase: e.target.value,
                                          },
                                        }
                                      : p
                                  )
                                )
                              }
                              readOnly={!entry.isEditing}
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex justify-center gap-4 pt-4">
                        {entry.isEditing ? (
                          <button
                            onClick={() => handleSave(entry.id, { ...entry, isEditing: false })}
                            className="px-6 py-2 bg-[#54A9DA]/40 text-gray-900 rounded-md hover:bg-[#4898c9]/40 transition-colors font-medium border border-black/5"
                          >
                            Save
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleModify(entry.id)}
                              className="px-6 py-2 bg-[#54A9DA]/40 text-gray-900 rounded-md hover:bg-[#4898c9]/40 transition-colors font-medium border border-black/5"
                            >
                              Modify
                            </button>
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="px-6 py-2 bg-[#54A9DA]/40 text-gray-900 rounded-md hover:bg-[#4898c9]/40 transition-colors font-medium border border-black/5"
                            >
                              Delete
                            </button>
                          </>
                        )}
                        {(entry.isEditing || !entry.isSaved) && (
                          <button
                            onClick={() => handleGenerate(entry.id)}
                            className="px-6 py-2 bg-[#54A9DA]/40 text-gray-900 rounded-md hover:bg-[#4898c9]/40 transition-colors font-medium border border-black/5"
                          >
                            Generate
                          </button>
                        )}
                      </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}
