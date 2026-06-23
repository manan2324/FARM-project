import React, { useState } from 'react';

const SproutIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7 20h10"/><path d="M10 20c0-4.42-2.69-8-6-8"/><path d="M14 20c0-4.42 2.69-8 6-8"/><path d="M12 18a4 4 0 0 0 4-4H8a4 4 0 0 0 4 4z"/><path d="M12 2v2"/></svg>;

const CropDetailsPage = ({ onStartGuidance }) => {
    const [selectedPlot, setSelectedPlot] = useState('');
    const [selectedCrop, setSelectedCrop] = useState('');
    const [sowingDate, setSowingDate] = useState('');

    // Mock data for user's farm plots and available crops
    const farmPlots = [
        { id: 'plot_a', name: 'North Field (7.5 acres)' },
        { id: 'plot_b', name: 'South Field (5.0 acres)' },
        { id: 'plot_c', name: 'West Ridge (10.0 acres)' }, 
    ];
    const availableCrops = ["Wheat", "Rice", "Cotton", "Sugarcane", "Tomato"];

    const handleSubmit = (e) => {
        e.preventDefault();
        const guidanceData = {
            plotName: farmPlots.find(p => p.id === selectedPlot)?.name || 'Unknown Plot',
            cropName: selectedCrop,
            sowingDate,
        };
        onStartGuidance(guidanceData);
    };

    const isFormValid = selectedPlot && selectedCrop && sowingDate;

    return (
        <div className="bg-slate-100 font-sans flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
                <header className="text-center mb-8">
                    <SproutIcon className="w-16 h-16 mx-auto text-indigo-600" />
                    <h1 className="mt-4 text-3xl font-extrabold text-slate-800 tracking-tight">Start New Crop Cycle</h1>
                    <p className="mt-2 text-slate-500">Enter the details below to begin receiving guidance.</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="farm-plot" className="block text-sm font-bold text-slate-700 mb-1.5">Select Farm Plot</label>
                        <select id="farm-plot" value={selectedPlot} onChange={e => setSelectedPlot(e.target.value)} required className="block w-full rounded-xl border-2 border-slate-300 py-3 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="" disabled>Choose a plot...</option>
                            {farmPlots.map(plot => <option key={plot.id} value={plot.id}>{plot.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="crop-type" className="block text-sm font-bold text-slate-700 mb-1.5">Select Crop</label>
                        <select id="crop-type" value={selectedCrop} onChange={e => setSelectedCrop(e.target.value)} required className="block w-full rounded-xl border-2 border-slate-300 py-3 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="" disabled>Choose a crop...</option>
                            {availableCrops.map(crop => <option key={crop} value={crop}>{crop}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="sowing-date" className="block text-sm font-bold text-slate-700 mb-1.5">Sowing Date</label>
                        <input type="date" id="sowing-date" value={sowingDate} onChange={e => setSowingDate(e.target.value)} required className="block w-full rounded-xl border-2 border-slate-300 py-3 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                    </div>
                    <div className="pt-2">
                        <button type="submit" disabled={!isFormValid} className="w-full flex justify-center py-3.5 px-4 border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed">
                            Start Guidance
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CropDetailsPage;