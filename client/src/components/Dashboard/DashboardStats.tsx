import Link from 'next/link';

interface Stat {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  hover: string;
  iconBg: string;
  href: string;
}

interface DashboardStatsProps {
  stats: Stat[];
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Link
            key={index}
            href={stat.href}
            className={`${stat.color} ${stat.hover} group p-6 rounded-xl transition-all duration-200`}
          >
            <div className="flex items-center">
              <div className={`${stat.iconBg} p-3 rounded-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/80 group-hover:text-white/90">
                  {stat.title}
                </p>
                <p className="text-2xl font-semibold text-white mt-1">
                  {stat.value}
                </p>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  );
}; 