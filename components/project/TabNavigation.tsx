"use client";

interface Tab {
    id: string;
    label: string;
    count?: number;
}

interface TabNavigationProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export default function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
    return (
        <div className="border-b border-gray-200 mb-8">
            <nav className="flex gap-8" aria-label="Tabs">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                relative py-4 px-1 text-sm font-medium transition-colors
                ${isActive
                                    ? 'text-gray-900 border-b-2 border-gray-900'
                                    : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
                                }
              `}
                        >
                            {tab.label}
                            {typeof tab.count !== 'undefined' && (
                                <span
                                    className={`ml-2 py-0.5 px-2 rounded-full text-xs ${isActive
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-gray-100 text-gray-600'
                                        }`}
                                >
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
