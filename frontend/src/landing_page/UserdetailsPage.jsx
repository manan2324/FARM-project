import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { makeAuthenticatedRequest } from '../firebase/api';

const UserdetailsPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        fullname: '',
        gender: '',
        day: '',
        month: '',
        year: '',
        totalFarmSize: ''
    });

    const handleInputChange = (field) => (event) => {
        setFormData({
            ...formData,
            [field]: event.target.value,
        });
    };

    const validateForm = () => {
        if (!formData.fullname?.trim()) {
            throw new Error('Full name is required');
        }
        if (!formData.gender) {
            throw new Error('Please select your gender');
        }
        if (!formData.day || !formData.month || !formData.year) {
            throw new Error('Please select your complete birth date');
        }
        if (!formData.totalFarmSize || parseFloat(formData.totalFarmSize) <= 0) {
            throw new Error('Please enter a valid farm size');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');

            // Validate the form
            validateForm();

            // Prepare user data
            const userData = {
                fullname: formData.fullname.trim(),
                gender: formData.gender,
                birthDate: {
                    day: parseInt(formData.day),
                    month: formData.month,
                    year: parseInt(formData.year)
                },
                totalFarmSize: parseFloat(formData.totalFarmSize)
            };

            // Submit to backend
            const response = await makeAuthenticatedRequest('http://localhost:5000/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            // Redirect to home page on success
            navigate('/');
        } catch (error) {
            console.error('Error submitting user details:', error);
            setError('Failed to save user details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // --- Dynamic date options ---
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 80 }, (_, i) => currentYear - i - 18);
    const months = [
        { value: '01', label: 'January' }, { value: '02', label: 'February' },
        { value: '03', label: 'March' }, { value: '04', label: 'April' },
        { value: '05', label: 'May' }, { value: '06', label: 'June' },
        { value: '07', label: 'July' }, { value: '08', label: 'August' },
        { value: '09', label: 'September' }, { value: '10', label: 'October' },
        { value: '11', label: 'November' }, { value: '12', label: 'December' }
    ];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
        <div className="bg-slate-100 font-sans flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
                <header className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Your Information</h1>
                    <p className="mt-2 text-slate-500">Please fill out your details to personalize your experience.</p>
                </header>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            id="fullname"
                            value={formData.fullname}
                            onChange={handleInputChange('fullname')}
                            placeholder="Enter your full name"
                            required
                            className="block w-full rounded-xl border-2 border-slate-300 py-3 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <label htmlFor="gender" className="block text-sm font-bold text-slate-700 mb-1">Gender</label>
                        <select
                            id="gender"
                            value={formData.gender}
                            onChange={handleInputChange('gender')}
                            required
                            className="block w-full rounded-xl border-2 border-slate-300 py-3 px-4 text-slate-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="" disabled>Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Birthdate */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Birthdate</label>
                        <div className="grid grid-cols-3 gap-4">
                            <select name="day" value={formData.day} onChange={handleInputChange('day')} required className="block w-full rounded-xl border-2 border-slate-300 py-3 px-4 text-slate-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="" disabled>Day</option>
                                {days.map(day => <option key={day} value={day}>{day}</option>)}
                            </select>
                            <select name="month" value={formData.month} onChange={handleInputChange('month')} required className="block w-full rounded-xl border-2 border-slate-300 py-3 px-4 text-slate-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="" disabled>Month</option>
                                {months.map(month => <option key={month.value} value={month.value}>{month.label}</option>)}
                            </select>
                            <select name="year" value={formData.year} onChange={handleInputChange('year')} required className="block w-full rounded-xl border-2 border-slate-300 py-3 px-4 text-slate-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="" disabled>Year</option>
                                {years.map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Total Farm Size */}
                    <div>
                        <label htmlFor="totalFarmSize" className="block text-sm font-bold text-slate-700 mb-1">Total Farm Size (in acres)</label>
                        <input
                            type="number"
                            id="totalFarmSize"
                            value={formData.totalFarmSize}
                            onChange={handleInputChange('totalFarmSize')}
                            placeholder="e.g., 12.5"
                            required
                            className="block w-full rounded-xl border-2 border-slate-300 py-3 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : 'Continue'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserdetailsPage;