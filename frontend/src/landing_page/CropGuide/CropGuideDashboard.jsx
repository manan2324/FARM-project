import React, { useState } from 'react';

// --- SVG Icon Components ---
const WaterDropIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path></svg>;
const FertilizerIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 8h14"/><path d="M5 12h14"/><path d="M11 16h2"/><path d="M11 20h2"/><path d="m3.5 15.5 1.7-5.1C5.5 9.4 6.2 8 7 8h10c.8 0 1.5.4 1.8 1.4l1.7 5.1c.3.8-.3 1.5-1.1 1.5H4.6c-.8 0-1.4-.7-1.1-1.5z"/></svg>;
const BugIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 20a8 8 0 0 0 8-8V8a8 8 0 0 0-8-8h-1a8 8 0 0 0-8 8v4a8 8 0 0 0 8 8z"></path><path d="M9 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path><path d="M15 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path></svg>;
const HarvestIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2v5"/><path d="M15 4H9"/><path d="M12 12v5"/><path d="M21 12h-6"/><path d="M9 12H3"/><path d="m14.5 16.5-2.5-3-2.5 3"/><path d="M12 22a2.5 2.5 0 0 0 2.5-2.5V17a2.5 2.5 0 0 0-5 0v2.5A2.5 2.5 0 0 0 12 22z"/></svg>;
const SunIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>;
const BellIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
const CheckCircleIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;

const TaskCard = ({ task }) => {
  const colors = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', iconBg: 'bg-blue-100' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-700', iconBg: 'bg-orange-100' },
    red: { bg: 'bg-red-50', text: 'text-red-700', iconBg: 'bg-red-100' },
    green: { bg: 'bg-green-50', text: 'text-green-700', iconBg: 'bg-green-100' },
  };
  const c = colors[task.color] || colors.blue;
  return <div className={`p-4 rounded-2xl border-2 border-slate-200 flex items-start gap-4 ${c.bg}`}><div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center ${c.iconBg}`}><task.Icon className={`w-6 h-6 ${c.text}`} /></div><div><p className={`font-bold ${c.text}`}>{task.title} - Day {task.day}</p><p className="text-sm text-slate-600">{task.details}</p></div></div>;
};

const CropGuideDashboard = ({ guidanceData }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const cropData = {
    name: `${guidanceData.cropName} (${guidanceData.plotName})`,
    sowingDate: guidanceData.sowingDate,
    expectedHarvest: "2026-04-10", // This would be calculated in a real app
    currentDay: 25,
    totalDays: 145,
  };

  const today = new Date(); // Using real date now

  const tasks = [
    { day: 25, type: 'irrigation', title: "First Irrigation", details: "Apply light irrigation (2-3 inches). Crucial for crown root initiation.", Icon: WaterDropIcon, color: "blue" },
    { day: 26, type: 'fertilizer', title: "Nitrogen Top Dressing", details: "Apply first split of Urea (50 kg/acre) after irrigation.", Icon: FertilizerIcon, color: "orange" },
    { day: 45, type: 'pesticide', title: "Weed Control", details: "Spray recommended herbicide for broadleaf weeds.", Icon: BugIcon, color: "red" },
  ];

  const todaysTasks = tasks.filter(task => task.day === cropData.currentDay);
  const upcomingTasks = tasks.filter(task => task.day > cropData.currentDay).slice(0, 3);
  const progressPercentage = (cropData.currentDay / cropData.totalDays) * 100;
  
  return (
    <div className="bg-slate-100 font-sans min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <header>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Crop Guidance</h1>
            <p className="mt-1 text-slate-500">Day-by-day management plan for {cropData.name}.</p>
          </header>
          <div className="bg-white rounded-2xl shadow-lg p-6">
             <div className="flex justify-between items-center mb-2"><span className="font-bold text-slate-700">Growth Stage</span><span className="text-sm font-semibold text-indigo-600">Day {cropData.currentDay} of {cropData.totalDays}</span></div>
             <div className="w-full bg-slate-200 rounded-full h-4"><div className="bg-indigo-600 h-4 rounded-full" style={{ width: `${progressPercentage}%` }}></div></div>
             <div className="flex justify-between text-xs text-slate-500 mt-1"><span>Sowed: {new Date(cropData.sowingDate).toLocaleDateString('en-GB')}</span><span>Expected Harvest: {new Date(cropData.expectedHarvest).toLocaleDateString('en-GB')}</span></div>
          </div>
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Today's Tasks ({today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })})</h2>
            <div className="space-y-4">
              {todaysTasks.length > 0 ? (todaysTasks.map(task => <TaskCard key={task.title} task={task} />)) : (<div className="p-6 text-center bg-green-50 rounded-2xl border-2 border-green-200"><CheckCircleIcon className="w-12 h-12 text-green-600 mx-auto"/><p className="mt-2 font-semibold text-green-800">No critical tasks today. Monitor crop health.</p></div>)}
            </div>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Upcoming Activities</h2>
            <div className="space-y-4">{upcomingTasks.map(task => <TaskCard key={task.title} task={task} />)}</div>
          </section>
        </div>
        <aside className="space-y-8">
           <div className="bg-white rounded-2xl shadow-lg p-6">
             <h2 className="text-xl font-bold text-slate-800 mb-4">Weather Forecast</h2>
             <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4"><div><p className="text-4xl font-bold text-slate-800">28°C</p><p className="text-slate-500">Clear Sky</p></div><SunIcon className="w-16 h-16 text-amber-500"/></div>
             <div className="flex justify-between text-center pt-4"><div><p className="font-semibold">Mon</p><p className="text-sm">29°</p></div><div><p className="font-semibold">Tue</p><p className="text-sm">30°</p></div><div><p className="font-semibold">Wed</p><p className="text-sm">31°</p></div><div><p className="font-semibold">Thu</p><p className="text-sm">30°</p></div></div>
           </div>
           <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><BellIcon className="w-6 h-6 text-indigo-600"/>Notifications</h2>
                <div className="flex justify-between items-center"><p className="text-slate-600">Send alerts to my phone</p><button onClick={() => setNotificationsEnabled(!notificationsEnabled)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationsEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`}/></button></div>
                 <p className="text-xs text-slate-400 mt-3">You will receive SMS and Push Notifications for all critical tasks.</p>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default CropGuideDashboard;