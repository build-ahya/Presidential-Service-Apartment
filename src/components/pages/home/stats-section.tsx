'use client';
import { cn } from '@/lib/utils';
import { Building2, Users, Award, TrendingUp } from 'lucide-react';

const stats = [
  {
    icon: Building2,
    value: '1,000+',
    label: 'Properties Delivered',
    description:
      'Turning visions into reality by helping families and investors secure their dream homes and assets.',
  },
  {
    icon: Users,
    value: '98%',
    label: 'Client Satisfaction Rate',
    description:
      'We listen, we care, we deliver. Trusted by thousands for quality service and support.',
  },
  {
    icon: Award,
    value: 'Top 10',
    label: 'Property Brand in Nigeria',
    description:
      'Recognized for excellence in architecture and brand experience.',
  },
  {
    icon: TrendingUp,
    value: '15+',
    label: 'Years of Excellence',
    description:
      'Delivering sustainable growth and vibrant communities for generations to come.',
  },
];

export default function StatsSection() {
  return (
    <section className="py-24 px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-4">
            Our Impact
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 max-w-3xl">
            Empowering Dreams Through Excellence in Real Estate
          </h2>
          <div className="space-y-4 text-gray-600 max-w-3xl">
            <p className="leading-relaxed">
              Discover how we redefine modern living with trusted, customer-first real estate services.
              Our commitment lies in delivering sustainable growth, long-term value, and vibrant
              communities for generations to come.
            </p>
            <p className="leading-relaxed">
              We focus on integrity, innovation and impact—connecting people, property, and peace of mind.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={cn(
                  'group p-8 rounded-2xl bg-gray-50 hover:bg-primary transition-colors duration-300',
                  index === 1 && 'bg-primary hover:bg-primary/90',
                )}
              >
                <div className="mb-6">
                  <div className={cn(
                    'inline-flex items-center justify-center w-14 h-14 rounded-full bg-white group-hover:bg-white/10 transition-colors',
                    index === 1 && 'bg-transparent bg-white/20',
                  )}>
                    <Icon className={cn("h-7 w-7 text-black group-hover:text-white transition-colors", 
                      index === 1 && 'text-white',
                    )} />
                  </div>
                </div>
                <h3 className={cn(
                  'text-4xl font-bold text-gray-900 group-hover:text-white mb-2 transition-colors',
                  index === 1 && 'text-white',
                )}>
                  {stat.value}
                </h3>
                <p className={cn(
                  'text-lg font-semibold text-gray-900 group-hover:text-white mb-3 transition-colors',
                  index === 1 && 'text-white',
                )}>
                  {stat.label}
                </p>
                <p className={cn(
                  'text-sm text-gray-600 group-hover:text-gray-300 leading-relaxed transition-colors',
                  index === 1 && 'text-white',
                )}>
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
