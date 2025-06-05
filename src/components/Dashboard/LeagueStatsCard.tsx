import { Trophy, Users, Calendar, CheckCircle } from 'lucide-react';

interface LeagueStatsCardProps {
  title: string;
  value: number;
  type: 'active' | 'teams' | 'matches' | 'completed';
}

export function LeagueStatsCard({ title, value, type }: LeagueStatsCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'active':
        return <Trophy className="w-6 h-6 text-blue-600" />;
      case 'teams':
        return <Users className="w-6 h-6 text-green-600" />;
      case 'matches':
        return <Calendar className="w-6 h-6 text-purple-600" />;
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-orange-600" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'active':
        return 'bg-blue-50 dark:bg-blue-900/20';
      case 'teams':
        return 'bg-green-50 dark:bg-green-900/20';
      case 'matches':
        return 'bg-purple-50 dark:bg-purple-900/20';
      case 'completed':
        return 'bg-orange-50 dark:bg-orange-900/20';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'active':
        return 'text-blue-900 dark:text-blue-100';
      case 'teams':
        return 'text-green-900 dark:text-green-100';
      case 'matches':
        return 'text-purple-900 dark:text-purple-100';
      case 'completed':
        return 'text-orange-900 dark:text-orange-100';
    }
  };

  return (
    <div className={`${getBgColor()} rounded-lg p-4 border border-gray-200 dark:border-gray-700/50`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-300">{title}</p>
          <p className={`text-xl font-semibold ${getTextColor()} mt-0.5`}>{value}</p>
        </div>
        {getIcon()}
      </div>
    </div>
  );
} 