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
        return <Trophy className="w-6 h-6 text-blue-500 dark:text-blue-400" />;
      case 'teams':
        return <Users className="w-6 h-6 text-green-500 dark:text-green-400" />;
      case 'matches':
        return <Calendar className="w-6 h-6 text-purple-500 dark:text-purple-400" />;
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-orange-500 dark:text-orange-400" />;
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-400">{title}</p>
          <p className="text-xl font-semibold text-gray-100 mt-0.5">{value}</p>
        </div>
        {getIcon()}
      </div>
    </div>
  );
} 