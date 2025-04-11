import React from 'react';
import { Shield, ShieldAlert, ShieldQuestion } from 'lucide-react';

const VerificationBadge = ({ status }) => {
  const getBadgeContent = () => {
    switch (status) {
      case 'verified':
        return {
          icon: <Shield className="text-green-500" size={16} />,
          text: 'Verified',
          className: 'bg-green-100 text-green-800'
        };
      case 'rejected':
        return {
          icon: <ShieldAlert className="text-red-500" size={16} />,
          text: 'Rejected',
          className: 'bg-red-100 text-red-800'
        };
      default:
        return {
          icon: <ShieldQuestion className="text-gray-500" size={16} />,
          text: 'Pending',
          className: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const { icon, text, className } = getBadgeContent();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {icon}
      <span className="ml-1">{text}</span>
    </span>
  );
};

export default VerificationBadge;