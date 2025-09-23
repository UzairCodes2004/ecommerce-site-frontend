// src/components/admin/DashboardCard.tsx
import React, { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  color,
  onClick,
}) => {
  return (
    <div
      className={`rounded-lg shadow-md p-4 flex items-center space-x-4 cursor-pointer hover:shadow-xl transition ${color}`}
      onClick={onClick} 
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyPress={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                onClick();
              }
            }
          : undefined
      }
    >
      <div className="text-3xl">{icon}</div>
      <div>
        <h4 className="text-gray-600 text-sm">{title}</h4>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
