import React from 'react';

interface Props {
    context: string;
    musicExample: string;
}

export const HistoricalContext: React.FC<Props> = ({ context, musicExample }) => {
    return (
        <div className="historical-context">
            <h3>Historical Context</h3>
            <p>{context}</p>
            <h4>Music Example</h4>
            <p>{musicExample}</p>
        </div>
    );
};