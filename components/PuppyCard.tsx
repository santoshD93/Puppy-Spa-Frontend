"use client";

import { FC } from "react";
import { cn } from "@/utils/cn";

interface Puppy {
  id: string;
  puppyName: string;
  ownerName: string;
  serviceType: string;
  isServiced: boolean;
  arrivalTime: string;
  position: number;
}

interface PuppyCardProps {
  puppy: Puppy;
  onMarkServiced: () => void;
}

const PuppyCard: FC<PuppyCardProps> = ({ puppy, onMarkServiced }) => {
  const arrivalTime = new Date(puppy.arrivalTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={cn(
        "flex justify-between items-center gap-4 border p-4 rounded-lg shadow-sm transition hover:shadow-md",
        puppy.isServiced ? "bg-green-50 border-green-300" : "bg-white"
      )}
    >
      <div className="flex flex-col text-sm text-gray-700">
        <div className="text-base font-semibold text-gray-900">
          {puppy.puppyName}
        </div>
        <div>Owner: {puppy.ownerName}</div>
        <div>Service: {puppy.serviceType}</div>
        <div>Arrival: {arrivalTime}</div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <span
          className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            puppy.isServiced
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          )}
        >
          {puppy.isServiced ? "Serviced" : "Waiting"}
        </span>

        <button
          onClick={onMarkServiced}
          className={cn(
            "text-xs px-3 py-1 rounded shadow-sm font-medium transition",
            puppy.isServiced
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
          )}
        >
          {puppy.isServiced ? "Undo" : "Mark Serviced"}
        </button>
      </div>
    </div>
  );
};

export default PuppyCard;
