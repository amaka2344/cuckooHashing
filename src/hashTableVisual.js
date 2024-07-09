import React, { useState } from 'react';
import { useCuckooHashing } from './cuckooHashing';
import 'tailwindcss/tailwind.css';

const HashTableVisualizer = () => {
  // Define the size of the hash tables
  const size = 11;
  // Destructure the functions and tables from the useCuckooHashing hook
  const { insert, remove, rehash, table1, table2 } = useCuckooHashing(size);
  // State to hold the current input value
  const [inputValue, setInputValue] = useState('');
  // State to hold any error messages
  const [error, setError] = useState(null);

  // Function to play audio
  const playAudio = (audioId) => {
    const audio = document.getElementById(audioId);
    if (audio) {
      audio.play();
    }
  };

  // Handle the insert button click
  const handleInsert = () => {
    // Call the insert function from the hook
    const result = insert(Number(inputValue));
    // Set the error message if any
    setError(result.error);
    // Clear the input value
    setInputValue('');
    playAudio('cuckoo-audio'); // Play insert audio

  };

  // Handle the remove button click
  const handleRemove = () => {
    // Call the remove function from the hook
    const result = remove(Number(inputValue));
    // Set the error message if any
    setError(result.error);
    // Clear the input value
    setInputValue('');
    playAudio('cuckoo-audio'); // Play remove audio

  };

  // Handle the rehash button click
  const handleRehash = () => {
    // Call the rehash function from the hook
    const result = rehash();
    // Set the error message if any
    setError(result.error);
    playAudio('cuckoo-audio'); // Play rehash audio

  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cuckoo Hashing Visualization (GROUP 7 )</h1>
      <div className="mb-4">
        {/* Input field for the user to enter a number */}
        <input 
          type="number" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          className="border p-2 mr-2"
        />
        {/* Buttons for inserting, removing, and rehashing */}
        <button onClick={handleInsert} className="bg-blue-500 text-white p-2 mr-2">Insert</button>
        <button onClick={handleRemove} className="bg-red-500 text-white p-2 mr-2">Remove</button>
        <button onClick={handleRehash} className="bg-green-500 text-white p-2">Rehash</button>
      </div>
      {/* Display error message if any */}
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex justify-around">
        <div>
          <h2 className="text-2xl text-white font-bold mb-2">Table 1</h2>
          {/* Display the contents of table1 */}
          {table1.map((value, index) => (
            <div key={index} className="border p-6 font-medium bg-gray-400">Slot {index}: {value}</div>
          ))}
        </div>
        <div>
          <h2 className="text-2xl text-white font-bold mb-2">Table 2</h2>
          {/* Display the contents of table2 */}
          {table2.map((value, index) => (
            <div key={index} className="border p-6 font-medium bg-gray-400">Slot {index}: {value}</div>
          ))}
        </div>
      </div>
      <audio id="cuckoo-audio" src="/assets/cuckoo.mp3"></audio>
    </div>
  );
};

export default HashTableVisualizer;
