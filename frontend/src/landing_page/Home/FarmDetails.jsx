import React from 'react'

// --- SVG Icon Components ---
const ArrowLeftIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const LocationIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const RulerIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0L15.3 9.3"></path><path d="m14.5 12.5 2-2"></path><path d="m11.5 9.5 2-2"></path><path d="m8.5 6.5 2-2"></path><path d="m17.5 15.5 2-2"></path></svg>;
const SoilIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22a2 2 0 0 0 2-2V2c0-.5-.2-1-.5-1.4A2.5 2.5 0 0 0 12 0a2.5 2.5 0 0 0-1.5.6c-.3.4-.5.9-.5 1.4v18a2 2 0 0 0 2 2z"></path><path d="M21 22a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-1"></path><path d="M3 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h1"></path></svg>;
const SproutIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7 20h10" /><path d="M10 20c0-4.42-2.69-8-6-8" /><path d="M14 20c0-4.42 2.69-8 6-8" /><path d="M12 18a4 4 0 0 0 4-4H8a4 4 0 0 0 4 4z" /><path d="M12 2v2" /></svg>;
const EditIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const TrashIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;

// --- Reusable UI Components ---
const InfoItem = ({ Icon, label, value }) => (
    <div className="flex items-start">
        <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-slate-500" />
        </div>
        <div className="ml-4">
            <p className="font-bold text-slate-800">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
        </div>
    </div>
);

const PlotCard = ({ plot }) => (
    <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
        <div className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <SproutIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4 flex-grow">
                <p className="font-bold text-slate-900">{plot.plotName}</p>
                <p className="text-sm text-slate-600">{plot.cropType}</p>
            </div>
            <div className="text-right">
                <p className="font-bold text-slate-900">{plot.plotSize}</p>
                <p className="text-sm text-slate-600">acres</p>
            </div>
        </div>
    </div>
);

const onBack = () => {
    window.history.back();
}

const FarmDetails = ({ farmData }) => {
    return (
        <div className="bg-slate-100 font-sans p-4 sm:p-6 md:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <header className="relative flex items-center justify-between mb-6">
                    <button onClick={onBack} className="text-slate-500 hover:text-slate-900 transition-colors">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight text-center absolute left-1/2 -translate-x-1/2">
                        {farmData.farmName}
                    </h1>
                </header>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Farm Overview */}
                    <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6 space-y-6">
                        <h2 className="text-xl font-bold text-indigo-700">Farm Overview</h2>
                        <InfoItem Icon={LocationIcon} label="Location" value={`${farmData.village}, ${farmData.district}`} />
                        <InfoItem Icon={RulerIcon} label="Total Size" value={`${farmData.farmSize} acres`} />
                        <InfoItem Icon={SoilIcon} label="Soil Type" value={farmData.soilType} />
                    </div>

                    {/* Right Column: Plots */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-indigo-700 mb-6">Crop Plots ({farmData.plots.length})</h2>
                        <div className="space-y-4">
                            {farmData.plots.map((plot) => (
                                <PlotCard key={plot.id} plot={plot} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FarmDetails;
