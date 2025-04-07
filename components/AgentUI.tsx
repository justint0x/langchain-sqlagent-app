import React, { useState } from 'react';

const AgentUI = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setQuery(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/sqlAgent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setResult(data.result);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    };

    return (
        <div>
            <h1 style={{ color: 'green' }}>SQL Agent Interface</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Enter your SQL query here"
                    rows={4}
                    cols={50}
                    style={{
                        border: '1px solid #D1D5DB',
                        borderRadius: '4px',
                        padding: '8px',
                    }}
                />
                <br />
                <button
                    type="submit"
                    style={{
                        backgroundColor: '#3B82F6',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        border: 'none',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2563EB')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3B82F6')}
                >
                    Execute Query
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {result && (
                <div>
                    <h2 style={{ fontWeight: 'bold' }}>Result:</h2>
                    <pre
                        style={{
                            backgroundColor: '#F3F4F6',
                            padding: '8px',
                            borderRadius: '4px',
                        }}
                    >
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default AgentUI;