import { useState } from 'react';

type FormData = Record<string, string>;

export const useFormData = <T extends FormData>(initialData: T) => {
  const [formData, setFormData] = useState<T>(initialData);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialData);
  };

  const updateMultipleFields = (updates: Partial<T>) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  return {
    formData,
    handleInputChange,
    resetForm,
    updateMultipleFields,
    setFormData,
  };
};
