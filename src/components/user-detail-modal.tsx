'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Mail,
  MapPin,
  Building2,
  CreditCard,
  User as UserIcon,
  Globe,
  AlertCircle,
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { fetchUserById } from '@/api/api';
import { useDashboardStore } from '@/store/dashboardStore';
import {
  fullName,
  getInitials,
  roleColors,
  formatDate,
  maskCard,
  genderIcon,
  cn,
} from '@/lib/utils';
import type { User } from '@/types/user';

export function UserDetailModal() {
  const { selectedUserId, setSelectedUserId } = useDashboardStore();
  const isOpen = selectedUserId !== null;

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user', selectedUserId],
    queryFn: () => fetchUserById(selectedUserId!),
    enabled: isOpen,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && setSelectedUserId(null)}
    >
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        {isLoading && <ModalSkeleton />}
        {isError && <ModalError />}
        {user && <ModalContent user={user} />}
      </DialogContent>
    </Dialog>
  );
}

function ModalContent({ user }: { user: User }) {
  return (
    <ScrollArea className="max-h-[80vh]">
      <div className="px-6 py-6">
        <div className="flex items-end gap-4 mb-5">
          <Avatar className="h-20 w-20 ring-4 ring-background shadow-lg">
            <AvatarImage
              src={user.image}
              alt={fullName(user)}
              className="object-cover"
            />
            <AvatarFallback className="text-xl font-bold bg-linear-to-br from-blue-400 to-violet-500 text-white">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 pb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <DialogTitle className="text-xl font-bold">
                {fullName(user)}
              </DialogTitle>
              <Badge className={cn('text-xs', roleColors(user.role))}>
                {user.role}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              @{user.username} · {genderIcon(user.gender)} {user.gender} ·{' '}
              {user.age} yo
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Section icon={UserIcon} title="Personal">
            <Field label="Birth date" value={formatDate(user.birthDate)} />
            <Field label="Blood group" value={user.bloodGroup} />
            <Field
              label="Height / Weight"
              value={`${user.height} cm / ${user.weight} kg`}
            />
            <Field label="Eye color" value={user.eyeColor} />
            <Field
              label="Hair"
              value={`${user.hair.color}, ${user.hair.type}`}
            />
            <Field label="University" value={user.university} />
          </Section>

          <Section icon={Mail} title="Contact">
            <Field label="Email" value={user.email} />
            <Field label="Phone" value={user.phone} />
            <Field label="Username" value={user.username} />
            <Field label="IP address" value={user.ip} />
            <Field label="MAC" value={user.macAddress} />
          </Section>

          <Section icon={MapPin} title="Address">
            <Field label="Street" value={user.address.address} />
            <Field label="City" value={user.address.city} />
            <Field
              label="State"
              value={`${user.address.state} (${user.address.stateCode})`}
            />
            <Field label="Postal code" value={user.address.postalCode} />
            <Field label="Country" value={user.address.country} />
          </Section>

          <Section icon={Building2} title="Company">
            <Field label="Name" value={user.company.name} />
            <Field label="Department" value={user.company.department} />
            <Field label="Title" value={user.company.title} />
            <Field label="Office city" value={user.company.address.city} />
            <Field
              label="Office country"
              value={user.company.address.country}
            />
          </Section>

          <Section icon={CreditCard} title="Banking">
            <Field label="Card type" value={user.bank.cardType} />
            <Field label="Card number" value={maskCard(user.bank.cardNumber)} />
            <Field label="Expires" value={user.bank.cardExpire} />
            <Field label="Currency" value={user.bank.currency} />
            <Field label="IBAN" value={user.bank.iban} />
          </Section>

          <Section icon={Globe} title="Crypto">
            <Field label="Coin" value={user.crypto.coin} />
            <Field label="Network" value={user.crypto.network} />
            <Field
              label="Wallet"
              value={`${user.crypto.wallet.slice(0, 16)}…`}
            />
          </Section>
        </div>
      </div>
    </ScrollArea>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border/60 p-4 space-y-2.5">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h4>
      </div>
      <Separator className="opacity-50" />
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-3 text-sm">
      <span className="text-muted-foreground text-xs shrink-0">{label}</span>
      <span className="font-medium text-xs text-right break-all">{value}</span>
    </div>
  );
}

function ModalSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-24 w-full rounded-lg" />
      <div className="flex gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2 flex-1 pt-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

function ModalError() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 text-center px-6">
      <AlertCircle className="h-10 w-10 text-destructive/70" />
      <p className="font-semibold">Failed to load user details</p>
      <p className="text-sm text-muted-foreground">Please try again later.</p>
    </div>
  );
}
