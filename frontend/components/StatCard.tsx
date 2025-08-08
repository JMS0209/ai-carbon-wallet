import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon }) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="text-lg font-semibold text-base-content">{title}</h3>
      <div className="text-3xl font-bold text-primary mb-2">{value}</div>
      <p className="text-sm text-base-content/70 text-center">{subtitle}</p>
    </div>
  );
};
