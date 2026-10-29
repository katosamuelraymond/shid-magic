'use client';

import React, { createContext, useContext, useState } from 'react';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  isFilterDrawerOpen: boolean;
  setIsFilterDrawerOpen: (open: boolean) => void;
}

const SearchContext = createContext<SearchContextType>({
  searchQuery: '',
  setSearchQuery: () => {},
  selectedCategory: 'All',
  setSelectedCategory: () => {},
  isFilterDrawerOpen: false,
  setIsFilterDrawerOpen: () => {},
});

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        isFilterDrawerOpen,
        setIsFilterDrawerOpen,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useMarketplaceSearch() {
  return useContext(SearchContext);
}
