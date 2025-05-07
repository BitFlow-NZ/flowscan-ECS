import React, { useState, useCallback } from 'react';
import { Input, AutoComplete, message } from 'antd';
import { debounce } from 'lodash';
import { Item } from '../../src/type';
import { searchItem } from '@/services/ant-design-pro/api';

const { Search } = Input;

interface SearchItemProps {
  onSearchResults: (items: Item[]) => void;
}

const SearchItem: React.FC<SearchItemProps> = ({ onSearchResults }) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<{ value: string }[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);


  const handleSearchSuggestions = useCallback(
    debounce(async (value: string) => {
      if (value.length <= 2) {
        setOptions([]);
        setDropdownOpen(false);
        return;
      }

      try {
        const response = await searchItem(value);
        if (response.success && Array.isArray(response.data)) {
          const suggestionOptions = response.data.map((item: Item) => ({
            value: item.name,
          }));
          setOptions(suggestionOptions);
          setDropdownOpen(true); 
        } else {
          setOptions([]);
          setDropdownOpen(false);
        }
      } catch (error) {
        console.error('Suggestion error:', error);
      }
    }, 300),
    [],
  );

 
  const onSearch = async (value: string) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
       message.warning('Please input an item name to search');
      return;
    }

    setDropdownOpen(false); 

    setLoading(true);
    try {
      const response = await searchItem(trimmedValue);
      if (response.success && Array.isArray(response.data) && response.data.length > 0) {
        onSearchResults(response.data);
        console.log('SearchedItems:', response.data);
      } else {
        message.info('No items found.');
        onSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      message.error('An error occurred. Please try again.');
      onSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

 
  const onSelect = (value: string) => {
    onSearch(value); 
  };

  return (
    <AutoComplete
      options={options}
      onSearch={handleSearchSuggestions}
      onSelect={onSelect}
      open={dropdownOpen} 
      style={{ width: '100%' }}
    >
      <Search
        placeholder="Enter item name"
        allowClear
        enterButton
        loading={loading}
        onSearch={onSearch}
      />
    </AutoComplete>
  );
};

export default SearchItem;
