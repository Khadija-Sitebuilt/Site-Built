import { CheckCircle, AlertCircle, Clock } from "lucide-react";

interface ActivityItemProps {
  activity: {
    id: string;
    type: "success" | "warning" | "info" | "error";
    message: string;
    timestamp: string;
  };
}

const activityStyles = {
  success: {
    icon: CheckCircle,
    iconColor: "text-green-500",
  },
  warning: {
    icon: Clock,
    iconColor: "text-[#d08700]",
  },
  info: {
    icon: AlertCircle,
    iconColor: "text-blue-500",
  },
  error: {
    icon: AlertCircle,
    iconColor: "text-red-500",
  },
};

export default function ActivityItem({ activity }: ActivityItemProps) {
  const style = activityStyles[activity.type];
  const Icon = style.icon;

  return (
    <div className="flex items-center gap-3 p-4 hover:bg-gray-50 rounded-[0.625rem] transition-colors bg-white border-[1.25px] border-black/10">
      {/* Icon */}
      <Icon className={`size-4 ${style.iconColor}`} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 tracking-tighter">
          {activity.message}
        </p>
        <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
      </div>
    </div>
  );
}
