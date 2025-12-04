import React from "react";

const BusinessFill: React.FC<{ className?: string }> = ({ className = "w-24 h-24" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="currentColor"
      className={className}
    >
      <path d="M26,31v3.5H22V31c-8-.4-15.1-2.9-20-6.6V42a2,2,0,0,0,2,2H44a2,2,0,0,0,2-2V24.4C41.1,28.1,34,30.6,26,31ZM44,12H33V6a2,2,0,0,0-2-2H17a2,2,0,0,0-2,2v6H4a2,2,0,0,0-2,2v5c4.3,4.7,12.6,8,22,8s17.7-3.3,22-8V14A2,2,0,0,0,44,12ZM29,12H19V8H29Z"/>
   </svg>    
  );
};

const BusinessOutline: React.FC<{ className?: string; strokeWidth?: number }> = ({
  className = "w-24 h-24",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 48 48"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={0}
      className={className}
    >
      <path d="M44,12H33V6a2,2,0,0,0-2-2H17a2,2,0,0,0-2,2v6H4a2,2,0,0,0-2,2V42a2,2,0,0,0,2,2H44a2,2,0,0,0,2-2V14A2,2,0,0,0,44,12ZM19,8H29v4H19Zm23,8v6.4a37.8,37.8,0,0,1-18,4.7A37.8,37.8,0,0,1,6,22.4V16ZM6,40V26.9A39.9,39.9,0,0,0,22,31v3.5h4V31a39.9,39.9,0,0,0,16-4.1V40Z"/>
  </svg>
  );
};

export { BusinessFill, BusinessOutline };