"use client"
import React, { useEffect, useState } from 'react'

export default function ScrollBarCustom() {
    const [scrollPercentage, setScrollPercentage] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight <= 0) {
                setScrollPercentage(0);
                return;
            }
            const currentScroll = window.scrollY;
            const percentage = (currentScroll / scrollHeight) * 100;
            setScrollPercentage(Math.min(percentage, 100));
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Run once initially to set the percentage
        handleScroll();
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className='h-full fixed z-999 top-0 right-0 w-1 bg-gray-400/10 backdrop-blur-xl'>
            <div 
                className="bg-[#2D2D2D] dark:bg-[#E5E5E5]"
                style={{
                    width: '100%',
                    height: `${scrollPercentage}%`
                }}
            ></div>
        </div>
    )
}
