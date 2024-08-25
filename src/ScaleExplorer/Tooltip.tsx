import React, { useState } from 'react';

interface TooltipProps {
    content: string;
    children: React.ReactElement;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="relative inline-block">
            {React.cloneElement(children, {
                onMouseEnter: () => setIsVisible(true),
                onMouseLeave: () => setIsVisible(false),
            })}
            {isVisible && (
                <div className="absolute z-10 p-2 bg-gray-800 text-white text-sm rounded shadow-lg max-w-xs">
                    {content}
                </div>
            )}
        </div>
    );
};