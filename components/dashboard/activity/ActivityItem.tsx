import cn from "@/lib/utils";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  CircleX,
  MessageCircleMore,
  ArrowUpRight,
} from "lucide-react";

interface ActivityItemProps {
  activity: {
    id: string;
    alert: "success" | "warning" | "info" | "error";
    status: "approved" | "pending review" | "new assignment" | "upload error";
    message: string;
    projectName?: string;
    timestamp: string;
  };
  section: string | undefined;
  className?: string;
}

const activityIcons = {
  success: {
    icon: CheckCircle,
    iconColor: "text-green-500",
  },
  warning: {
    projects: { icon: Clock, iconColor: "text-[#d08700]" },
    activity: {
      icon: CircleX,
      iconColor: "text-red-500",
    },
  },
  info: {
    projects: {
      icon: AlertCircle,
      iconColor: "text-blue-500",
    },
    activity: {
      icon: MessageCircleMore,
      iconColor: "text-gray-700",
    },
  },
  error: {
    projects: {
      icon: AlertCircle,
      iconColor: "text-red-500",
    },
    activity: {
      icon: Clock,
      iconColor: "text-blue-600",
    },
  },
};

export default function ActivityItem({
  activity,
  section,
  className,
}: ActivityItemProps) {
  const status = section
    ? activityIcons[activity.alert][
        section as keyof (typeof activityIcons)[typeof activity.alert]
      ]
    : activityIcons.success;
  const Icon = status.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 hover:bg-gray-50 rounded-[0.625rem] transition-colors bg-white border-[1.25px] border-black/10",
        className,
      )}
    >
      {/* Icon */}
      <div>
        <Icon className={`size-4 ${status.iconColor}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-gray-900 tracking-tighter">
              {activity.message}
            </p>
            {activity.projectName && (
              <p className="text-sm font-roboto text-[#6b7280] leading-5.25">
                {activity.projectName}
              </p>
            )}
          </div>
          {/* condition should be changed to the correct condition when value is true */}
          {activity.projectName && (
            <span
              className={`font-roboto text-xs text-[#008236] bg-[#dcfce7] rounded-lg px-2 py-0.5 self-start `}
            >
              Approved
            </span>
          )}
        </div>
        <div className="flex justify-between">
          <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
          {/* condition should be changed to the correct condtion when the status value is true */}
          {activity.projectName && (
            <button className="text-sm text-[#2563eb] ">
              Respond <ArrowUpRight size={16} className="inline" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
