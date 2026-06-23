import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './firebase/AuthContext';

import HomePage from './landing_page/Home/HomePage.jsx';
import LanguagePage from './landing_page/LanguagePage.jsx';
import Login from './landing_page/Login.jsx';
import UserdetailsPage from "./landing_page/UserdetailsPage.jsx";
import HelpAndSupportPage from './landing_page/HelpAndSupportPage.jsx';

import ChatbotPage from './landing_page/Chatbot/ChatbotPage.jsx';
import MarketPage from './landing_page/Market/MarketPage.jsx';
import FeedbackPage from './landing_page/Feedback/FeedbackPage.jsx';
import CropGuidancePage from './landing_page/CropGuide/CropGuidancePage.jsx';

import FarmHomePage from "./landing_page/Farm/FarmHomePage.jsx";
import AddFarmPage from "./landing_page/Farm/AddFarmPage.jsx";
import EditFarmPage from './landing_page/Farm/EditFarmPage.jsx';

import SoilTestPage from './landing_page/SoilTest/SoilTestPage.jsx';
import CropPage from './landing_page/SoilTest/CropPage.jsx';
import FertilizerPage from './landing_page/SoilTest/FertilizerPage.jsx';

import DiseasePage from './landing_page/DiseaseTest/DiseasePage.jsx';
import DiseaseResultPage from './landing_page/DiseaseTest/DiseaseResultPage.jsx';

import Navbar from './landing_page/Navbar.jsx';
import Footer from './landing_page/Footer.jsx';
import PageNotFound from './landing_page/PageNotFound.jsx';

import ScrollToTop from "./ScrollToTop.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ScrollToTop />
                <Navbar />
                <Routes>
                    {/* Initial Routes */}
                    <Route path="/language" element={<LanguagePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/userinfo" element={<UserdetailsPage />} />

                    {/* farm related routes */}
                    <Route path="/" element={
                        <ProtectedRoute>
                            <FarmHomePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/farm/:id" element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/farm/:id/edit" element={
                        <ProtectedRoute>
                            <EditFarmPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/add-farm" element={
                        <ProtectedRoute>
                            <AddFarmPage />
                        </ProtectedRoute>
                    } />

                    {/* Soil testing routes */}
                    <Route path="/farm/:id/soil-testing" element={
                        <ProtectedRoute>
                            <SoilTestPage />
                        </ProtectedRoute>
                    }>
                    </Route>
                    <Route path="/farm/:id/soil-testing/crop" element={<CropPage />} />
                    <Route path="/farm/:id/soil-testing/fertilizer" element={<FertilizerPage />} />

                    {/* Disease testing routes */}
                    <Route path="/farm/:id/disease-testing" element={
                        <ProtectedRoute>
                            <DiseasePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/farm/:id/disease-testing/result" element={
                        <ProtectedRoute>
                            <DiseaseResultPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/chatbot" element={
                        <ProtectedRoute>
                            <ChatbotPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/market" element={
                        <ProtectedRoute>
                            <MarketPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/feedback" element={
                        <ProtectedRoute>
                            <FeedbackPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/crop-guidance" element={
                        <ProtectedRoute>
                            <CropGuidancePage />
                        </ProtectedRoute>
                    } />

                    <Route path="/help" element={
                        <ProtectedRoute>
                            <HelpAndSupportPage />
                        </ProtectedRoute>
                    } />

                    <Route path="*" element={<PageNotFound />} />
                </Routes>
                <Footer />
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App