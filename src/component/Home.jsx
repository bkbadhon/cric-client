import React, { useEffect, useState } from 'react';
import axios from "axios";
import img from '../../public/cb_logo.svg'
import { RxAvatar } from "react-icons/rx";

const Home = () => {
    const [score, setScore] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [matchTypeFilter, setMatchTypeFilter] = useState('all'); // State to filter match types

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const res = await axios.get('http://localhost:5000/live-scores');
                setScore(res.data.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchScores();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const filteredScores = score.filter(item => matchTypeFilter === 'all' || item.matchType === matchTypeFilter);

    return (
        <div className='w-10/12 mx-auto my-4'>
            <div className='flex mb-4 justify-between'>

                <div>
                    <h2 className='text-xl font-semibold'>BDCrickinfo</h2>
                </div>

                <div className='space-x-5'>
                <button className='px-4 py-2 bg-blue-500 text-white rounded' onClick={() => setMatchTypeFilter('all')}>All</button>
                <button className='px-4 py-2 bg-blue-500 text-white rounded' onClick={() => setMatchTypeFilter('test')}>Test</button>
                <button className='px-4 py-2 bg-blue-500 text-white rounded' onClick={() => setMatchTypeFilter('odi')}>ODI</button>
                <button className='px-4 py-2 bg-blue-500 text-white rounded' onClick={() => setMatchTypeFilter('t20')}>T20</button>
                </div>
                <div>
                    <button><RxAvatar className='text-2xl'/></button>
                </div>
            </div>

            {/* Match Cards */}
            <div className='grid my-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                {filteredScores.length === 0 ? ( // Check if filtered scores are empty
                    <p>No live scores available.</p>
                ) : (
                    filteredScores.map(item => (
                        <div className='bg-gray-200 shadow-xl rounded-xl p-4' key={item.id}>
                            <div className='flex justify-between'>
                                <h2 className='text-xs font-semibold'>{item.name}</h2>
                                <h2 className='bg-[#e90b37] text-white text-xs h-6 text-center pt-1 rounded-full capitalize px-2'>
                                    {item.matchType}
                                </h2>
                            </div>
                            <div className='flex justify-between items-start'>
                                <div className='flex flex-col items-start space-y-2'>
                                    {item.teamInfo.map(team => (
                                        <div key={team.shortname} className='flex my-2 items-center'>
                                            <img className='w-9 h-6' src={team.img} alt={team.shortname || team.name} />
                                            <h2 className='font-bold text-2xl ml-2'>{team.shortname}</h2>
                                        </div>
                                    ))}
                                </div>
                                {item.score && item.score.length > 0 && (
                                    <div className='flex flex-col items-end'>
                                        {item.teamInfo.map(team => {
                                            const teamScores = item.score
                                                .filter(score => score.inning.includes(team.name))
                                                .map(score => `${score.r}/${score.w}(${score.o})`)
                                                .join(', ');
                                            return (
                                                <div key={team.shortname} className='flex mb-3 my-2 justify-between w-full'>
                                                    <span className='font-semibold text-base'>{teamScores}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                            <div>
                                <p>{item.status}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Home;
