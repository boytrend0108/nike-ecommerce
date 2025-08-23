import React from 'react';

interface RenderListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export default function RenderList<T>({
  items,
  renderItem,
  className = '',
  containerClassName = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
}: RenderListProps<T>) {
  return (
    <div className={`${containerClassName} ${className}`}>
      {items.map((item, index) => (
        <div key={index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}
