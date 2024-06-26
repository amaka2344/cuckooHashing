import { useState } from 'react';

export const useCuckooHashing = (initialSize) => {
  const [size, setSize] = useState(initialSize);
  const [table1, setTable1] = useState(new Array(initialSize).fill(null));
  const [table2, setTable2] = useState(new Array(initialSize).fill(null));

  const hash1 = (key) => key % size;
  const hash2 = (key) => Math.floor(key / size) % size;

  const insert = (key) => {
    let currentKey = key;
    let position1 = hash1(currentKey);
    let position2;
    let displaced;

    for (let i = 0; i < size; i++) {
      if (table1[position1] === null) {
        let newTable1 = [...table1];
        newTable1[position1] = currentKey;
        setTable1(newTable1);
        return { table1: newTable1, table2, error: null };
      }

      [displaced, table1[position1]] = [table1[position1], currentKey];
      currentKey = displaced;
      position2 = hash2(currentKey);

      if (table2[position2] === null) {
        let newTable2 = [...table2];
        newTable2[position2] = currentKey;
        setTable2(newTable2);
        return { table1, table2: newTable2, error: null };
      }

      [displaced, table2[position2]] = [table2[position2], currentKey];
      currentKey = displaced;
      position1 = hash1(currentKey);
    }

    return { table1, table2, error: 'Cycle detected! Rehash needed.' };
  };

  const remove = (key) => {
    const pos1 = hash1(key);
    if (table1[pos1] === key) {
      let newTable1 = [...table1];
      newTable1[pos1] = null;
      setTable1(newTable1);
      return { table1: newTable1, table2, error: null };
    }

    const pos2 = hash2(key);
    if (table2[pos2] === key) {
      let newTable2 = [...table2];
      newTable2[pos2] = null;
      setTable2(newTable2);
      return { table1, table2: newTable2, error: null };
    }

    return { table1, table2, error: 'Key not found.' };
  };

  const rehash = () => {
    const newSize = size * 2;
    const newTable1 = new Array(newSize).fill(null);
    const newTable2 = new Array(newSize).fill(null);

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

    table1.forEach(reinsert);
    table2.forEach(reinsert);

    setTable1(newTable1);
    setTable2(newTable2);
    setSize(newSize);

    return { table1: newTable1, table2: newTable2, error: null };
  };

  const lookup = (key) => {
    if (table1[hash1(key)] === key) return true;
    if (table2[hash2(key)] === key) return true;
    return false;
  };

  return { insert, remove, rehash, lookup, table1, table2 };
};
