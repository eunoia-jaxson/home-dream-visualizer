import { useState } from 'react';

type SectionState = Record<string, boolean>;

export const useCollapsibleSections = <T extends SectionState>(
  initialState: T
) => {
  const [expandedSections, setExpandedSections] = useState<T>(initialState);

  const toggleSection = (section: keyof T) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const expandSection = (section: keyof T) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: true,
    }));
  };

  const collapseSection = (section: keyof T) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: false,
    }));
  };

  const expandAll = () => {
    const allExpanded = Object.keys(expandedSections).reduce(
      (acc, key) => ({
        ...acc,
        [key]: true,
      }),
      {} as T
    );
    setExpandedSections(allExpanded);
  };

  const collapseAll = () => {
    const allCollapsed = Object.keys(expandedSections).reduce(
      (acc, key) => ({
        ...acc,
        [key]: false,
      }),
      {} as T
    );
    setExpandedSections(allCollapsed);
  };

  return {
    expandedSections,
    toggleSection,
    expandSection,
    collapseSection,
    expandAll,
    collapseAll,
  };
};
