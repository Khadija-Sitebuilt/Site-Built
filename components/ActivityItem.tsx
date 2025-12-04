import { CheckCircle, AlertCircle, Info, XCircle } from "lucide-react";

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
        bgColor: "bg-green-50",
    },
    warning: {
        icon: AlertCircle,
        iconColor: "text-amber-500",
        bgColor: "bg-amber-50",
    },
    info: {
        icon: Info,
        iconColor: "text-blue-500",
        bgColor: "bg-blue-50",
    },
    error: {
        icon: XCircle,
        iconColor: "text-red-500",
        bgColor: "bg-red-50",
    },
};

export default function ActivityItem({ activity }: ActivityItemProps) {
    const style = activityStyles[activity.type];
    const Icon = style.icon;

    return (
        <div className="flex items-start gap-3 p-4 hover:bg-gray-50 rounded-lg transition-colors">
            {/* Icon */}
            <div className={`p-2 rounded-lg ${style.bgColor}`}>
                <Icon className={`w-5 h-5 ${style.iconColor}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
            </div>
        </div>
    );
}
