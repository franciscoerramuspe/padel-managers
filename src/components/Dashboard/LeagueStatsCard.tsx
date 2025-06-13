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
        return <Trophy className="w-7 h-7 text-blue-500" />;
      case 'teams':
        return <Users className="w-7 h-7 text-emerald-500" />;
      case 'matches':
        return <Calendar className="w-7 h-7 text-violet-500" />;
      case 'completed':
        return <CheckCircle className="w-7 h-7 text-orange-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'active':
        return 'bg-blue-500/10 dark:bg-blue-500/20';
      case 'teams':
        return 'bg-emerald-500/10 dark:bg-emerald-500/20';
      case 'matches':
        return 'bg-violet-500/10 dark:bg-violet-500/20';
      case 'completed':
        return 'bg-orange-500/10 dark:bg-orange-500/20';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'active':
        return 'text-blue-700 dark:text-blue-300';
      case 'teams':
        return 'text-emerald-700 dark:text-emerald-300';
      case 'matches':
        return 'text-violet-700 dark:text-violet-300';
      case 'completed':
        return 'text-orange-700 dark:text-orange-300';
    }
  };

  return (
    <div className={`${getBgColor()} rounded-xl p-5 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm transition-all duration-200 hover:scale-[1.02]`}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-xs font-bold tracking-wider uppercase text-gray-700 dark:text-gray-300">{title}</p>
          <p className={`text-3xl font-bold ${getTextColor()} mt-0.5 font-mono`}>{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${getBgColor()}`}>
          {getIcon()}
        </div>
      </div>
    </div>
  );
} 