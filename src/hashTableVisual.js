import React, { useState } from 'react';
import { useCuckooHashing } from './cuckooHashing';
import 'tailwindcss/tailwind.css';

const HashTableVisualizer = () => {
  const size = 11;
  const { insert, remove, rehash, table1, table2 } = useCuckooHashing(size);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);

  const handleInsert = () => {
    const result = insert(Number(inputValue));
    setError(result.error);
    setInputValue('');
  };

  const handleRemove = () => {
    const result = remove(Number(inputValue));
    setError(result.error);
    setInputValue('');
  };

  const handleRehash = () => {
    const result = rehash();
    setError(result.error);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cuckoo Hashing Visualization (GROUP 7 )</h1>
      <div className="mb-4">
        <input 
          type="number" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          className="border p-2 mr-2"
        />
        <button onClick={handleInsert} className="bg-blue-500 text-white p-2 mr-2">Insert</button>
        <button onClick={handleRemove} className="bg-red-500 text-white p-2 mr-2">Remove</button>
        <button onClick={handleRehash} className="bg-green-500 text-white p-2">Rehash</button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex justify-around">
        <div>
          <h2 className="text-xl font-bold mb-2">Table 1</h2>
          {table1.map((value, index) => (
            <div key={index} className="border p-2">Slot {index}: {value}</div>
          ))}
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">Table 2</h2>
          {table2.map((value, index) => (
            <div key={index} className="border p-2">Slot {index}: {value}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HashTableVisualizer;
