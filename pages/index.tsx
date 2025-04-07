import React from 'react';
import AgentUI from '../components/AgentUI';

const Home: React.FC = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <AgentUI />
        </div>
    );
};

export default Home;