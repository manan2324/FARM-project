import React, { useState } from 'react';
import CropGuideDashboard from './CropGuideDashboard';
import CropDetailsPage from './CropDetailsPage';

const CropGuidancePage = () => {
    const [guidanceData, setGuidanceData] = useState(null);

    if (guidanceData) {
        return <CropGuideDashboard guidanceData={guidanceData} />
    } else {
        return <CropDetailsPage onStartGuidance={setGuidanceData} />
    }
}

export default CropGuidancePage;