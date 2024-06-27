import { useState } from 'react';

// Custom hook for implementing Cuckoo Hashing
export const useCuckooHashing = (initialSize) => {
  // Initialize the size of the hash tables
  const [size, setSize] = useState(initialSize);
  // Initialize the two hash tables with null values
  const [table1, setTable1] = useState(new Array(initialSize).fill(null));
  const [table2, setTable2] = useState(new Array(initialSize).fill(null));

  // Hash function for the first table
  const hash1 = (key) => key % size;
  // Hash function for the second table
  const hash2 = (key) => Math.floor(key / size) % size;

  // Function to insert a key into the hash tables
  const insert = (key) => {
    let currentKey = key; // The key to be inserted
    let position1 = hash1(currentKey); // Position in the first table
    let position2; // Position in the second table
    let displaced; // Displaced key during insertion

    // Try to insert the key, handling collisions by displacing existing keys
    for (let i = 0; i < size; i++) {
      // If the slot in the first table is empty, insert the key
      if (table1[position1] === null) {
        let newTable1 = [...table1];
        newTable1[position1] = currentKey;
        setTable1(newTable1);
        return { table1: newTable1, table2, error: null };
      }

      // Displace the key in the first table and calculate its position in the second table
      [displaced, table1[position1]] = [table1[position1], currentKey];
      currentKey = displaced;
      position2 = hash2(currentKey);

      // If the slot in the second table is empty, insert the displaced key
      if (table2[position2] === null) {
        let newTable2 = [...table2];
        newTable2[position2] = currentKey;
        setTable2(newTable2);
        return { table1, table2: newTable2, error: null };
      }

      // Displace the key in the second table and calculate its new position in the first table
      [displaced, table2[position2]] = [table2[position2], currentKey];
      currentKey = displaced;
      position1 = hash1(currentKey);
    }

    // If a cycle is detected, return an error message
    return { table1, table2, error: 'Cycle detected! Rehash needed.' };
  };

  // Function to remove a key from the hash tables
  const remove = (key) => {
    const pos1 = hash1(key); // Position in the first table
    if (table1[pos1] === key) {
      let newTable1 = [...table1];
      newTable1[pos1] = null;
      setTable1(newTable1);
      return { table1: newTable1, table2, error: null };
    }

    const pos2 = hash2(key); // Position in the second table
    if (table2[pos2] === key) {
      let newTable2 = [...table2];
      newTable2[pos2] = null;
      setTable2(newTable2);
      return { table1, table2: newTable2, error: null };
    }

    // If the key is not found, return an error message
    return { table1, table2, error: 'Key not found.' };
  };

  // Function to rehash the tables when a cycle is detected
  const rehash = () => {
    const newSize = size * 2; // Double the size of the tables
    const newTable1 = new Array(newSize).fill(null);
    const newTable2 = new Array(newSize).fill(null);

    // Function to reinsert keys into the new tables
    const reinsert = (key) => {
      if (key === null) return;
      let currentKey = key;
      let pos1 = hash1(currentKey);
      let pos2 = hash2(currentKey);

      for (let i = 0; i < newSize; i++) {
        if (newTable1[pos1] === null) {
          newTable1[pos1] = currentKey;
          return;
        }
        [currentKey, newTable1[pos1]] = [newTable1[pos1], currentKey];
        pos2 = hash2(currentKey);

        if (newTable2[pos2] === null) {
          newTable2[pos2] = currentKey;
          return;
        }
        [currentKey, newTable2[pos2]] = [newTable2[pos2], currentKey];
        pos1 = hash1(currentKey);
      }
    };

    // Reinsert all keys from the old tables into the new tables
    table1.forEach(reinsert);
    table2.forEach(reinsert);

    // Update the tables and size state
    setTable1(newTable1);
    setTable2(newTable2);
    setSize(newSize);

    return { table1: newTable1, table2: newTable2, error: null };
  };

  // Function to check if a key exists in the hash tables
  const lookup = (key) => {
    if (table1[hash1(key)] === key) return true;
    if (table2[hash2(key)] === key) return true;
    return false;
  };

  // Return the functions and tables from the hook
  return { insert, remove, rehash, lookup, table1, table2 };
};