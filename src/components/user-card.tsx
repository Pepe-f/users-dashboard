'use client';

import { Mail, Phone, MapPin, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useDashboardStore } from '@/store/dashboardStore';
import { fullName, getInitials, roleColors, genderIcon, cn } from '@/lib/utils';
import type { User } from '@/types/user';

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  const setSelectedUserId = useDashboardStore((s) => s.setSelectedUserId);

  return (
    <TooltipProvider delayDuration={300}>
      <Card
        role="button"
        tabIndex={0}
        onClick={() => setSelectedUserId(user.id)}
        onKeyDown={(e) => e.key === 'Enter' && setSelectedUserId(user.id)}
        className={cn(
          'group cursor-pointer transition-all duration-200',
          'hover:shadow-lg hover:-translate-y-0.5',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'border-border/60 hover:border-border',
        )}
      >
        <CardContent className="p-5">
          <div className="flex items-start gap-3 mb-4">
            <Avatar className="h-12 w-12 shrink-0 ring-2 ring-border/50">
              <AvatarImage
                src={user.image}
                alt={fullName(user)}
                className="object-cover"
              />
              <AvatarFallback className="bg-linear-to-br from-blue-400 to-violet-500 text-white font-semibold text-sm">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                <h3 className="font-semibold text-sm truncate">
                  {fullName(user)}
                </h3>
                <span className="text-muted-foreground text-xs">
                  {genderIcon(user.gender)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                @{user.username}
              </p>
            </div>

            <Badge className={cn('text-xs shrink-0', roleColors(user.role))}>
              {user.role}
            </Badge>
          </div>

          <div className="space-y-1.5">
            <InfoRow icon={Mail} text={user.email} />
            <InfoRow icon={Phone} text={user.phone} />
            <InfoRow
              icon={Building2}
              text={`${user.company.name} · ${user.company.department}`}
            />
            <InfoRow
              icon={MapPin}
              text={`${user.address.city}, ${user.address.country}`}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-border/40">
            <Chip label="Age" value={user.age} />
            <Chip label="Blood" value={user.bloodGroup} />
            <Chip label="Hair" value={user.hair.color} />
            <Chip label="Eyes" value={user.eyeColor} />
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

function InfoRow({
  icon: Icon,
  text,
}: {
  icon: React.ElementType;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{text}</span>
    </div>
  );
}

function Chip({ label, value }: { label: string; value: string | number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs bg-muted rounded-full px-2 py-0.5">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium">{value}</span>
    </span>
  );
}
