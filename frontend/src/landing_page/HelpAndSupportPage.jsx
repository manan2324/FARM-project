import React, { useState } from 'react';

// --- SVG Icon Components ---
const SearchIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const ChevronDownIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="6 9 12 15 18 9"></polyline></svg>;
const MailIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const MessageSquareIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const BookOpenIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;

// --- Mock Data ---
const faqs = [
    { q: "How do I add a new farm?", a: "To add a new farm, navigate to the 'My Farms' page from the main dashboard and click the 'Add New Farm' button. You will be prompted to enter details such as the farm name, size, location, and soil type." },
    { q: "How does the crop disease detection work?", a: "Our disease detection feature uses advanced machine learning models. Simply upload a clear photo of the affected crop leaf, and our system will analyze it to identify potential diseases and provide recommended solutions." },
    { q: "Can I edit the details of an existing plot?", a: "Yes. Go to the 'Farm Details' page for the specific farm, and you will see an 'Edit' option. From there, you can modify plot names, sizes, and crop types." },
    { q: "Where does the market price data come from?", a: "We source our market price information from government APIs and trusted agricultural market data providers to give you the most accurate and up-to-date pricing information." },
];

// --- FAQ Item Component with Accordion Logic ---
const FaqItem = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b-2 border-slate-100">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-4 px-2"
            >
                <span className="font-bold text-slate-800">{faq.q}</span>
                <ChevronDownIcon className={`w-6 h-6 text-indigo-500 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="p-2 pb-4 text-slate-600">
                    {faq.a}
                </div>
            </div>
        </div>
    );
};


// --- Main Help and Support Page Component ---
const HelpAndSupportPage = () => {
    return (
        <div className="bg-slate-100 font-sans min-h-screen">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <header className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-tight">Help & Support</h1>
                    <p className="mt-4 text-lg text-slate-600">How can we help you today?</p>
                </header>

                {/* Search Bar */}
                <div className="relative mb-12">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                    <input
                        type="search"
                        placeholder="Search for topics, questions, or keywords"
                        className="w-full pl-14 pr-4 py-4 text-md text-slate-900 bg-white rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                    />
                </div>

                {/* FAQ Section */}
                <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-12">
                    <h2 className="text-2xl font-bold text-indigo-700 mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-2">
                        {faqs.map((faq, index) => <FaqItem key={index} faq={faq} />)}
                    </div>
                </section>

                {/* Contact & Guides Section */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">Still Need Help?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Contact Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-start gap-4 hover:-translate-y-1 transition-transform">
                             <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <MailIcon className="w-6 h-6 text-blue-600"/>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Email Support</h3>
                                <p className="text-slate-600 text-sm mt-1">Get a detailed response from our support team.</p>
                                <a href="mailto:support@farm.app" className="text-sm font-bold text-indigo-600 hover:underline mt-2 inline-block">support@farm.app</a>
                            </div>
                        </div>
                        {/* Live Chat Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-start gap-4 hover:-translate-y-1 transition-transform">
                             <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <MessageSquareIcon className="w-6 h-6 text-green-600"/>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Live Chat</h3>
                                <p className="text-slate-600 text-sm mt-1">Chat with a member of our team for immediate help.</p>
                                 <a href="#" className="text-sm font-bold text-indigo-600 hover:underline mt-2 inline-block">Start a Chat</a>
                            </div>
                        </div>
                         {/* Guides Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-start gap-4 hover:-translate-y-1 transition-transform md:col-span-2">
                             <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <BookOpenIcon className="w-6 h-6 text-purple-600"/>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Helpful Guides</h3>
                                <p className="text-slate-600 text-sm mt-1">Explore our detailed guides and tutorials to get the most out of our platform.</p>
                                <a href="#" className="text-sm font-bold text-indigo-600 hover:underline mt-2 inline-block">Browse Guides</a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HelpAndSupportPage;