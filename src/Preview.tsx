import { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { useNavigate } from 'react-router-dom';
import WhiteLogo from 'WhiteLogo.png'; // Assuming WhiteLogo is a valid image file

const PreviewPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
  
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000); // Simulating loading time, replace with actual loading logic
  
        return () => clearTimeout(timer);
    }, []);
  
    useEffect(() => {
        if (!isLoading) {
            navigate('/report'); // Assuming '/report' is the correct route for the Report page
        }
    }, [isLoading, navigate]);
  
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <img src={WhiteLogo} alt="Company Logo" style={{ width: '200px', height: 'auto' }} />
            <Progress style={{ marginTop: 20 }} />
        </div>
    );
};

export default PreviewPage;
