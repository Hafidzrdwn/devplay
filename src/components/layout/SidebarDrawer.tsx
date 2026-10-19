import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Menu, X } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/cn';
import type { Lang } from '@/i18n/config';

interface SidebarDrawerProps {
  lang: Lang;
  triggerLabel?: string;
  children: React.ReactNode;
}

export function SidebarDrawer({
  lang,
  triggerLabel,
  children,
}: SidebarDrawerProps): React.JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false);

  const defaultLabel = lang === 'id' ? 'Menu Konsep' : 'Concept Menu';
  const label = triggerLabel ?? defaultLabel;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className="inline-flex items-center gap-2 rounded-card border-2 border-ink bg-surface px-3 py-1.5 text-xs font-bold text-ink shadow-hard transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0_0_var(--ink)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Menu className="size-4 shrink-0 text-ink" aria-hidden="true" />
          <span>{label}</span>
        </button>
      </DialogTrigger>

      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex h-full w-[310px] max-w-[85vw] flex-col border-r-2 border-ink bg-surface p-4 shadow-hard duration-200 ease-in-out',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left'
          )}
        >
          <div className="flex items-center justify-between pb-3 mb-2 border-b-2 border-ink">
            <DialogTitle className="font-heading text-sm font-bold text-ink">
              {label}
            </DialogTitle>
            <DialogPrimitive.Close className="rounded-card border-2 border-ink bg-surface p-1 shadow-hard transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0_0_var(--ink)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
              <X className="size-4 text-ink" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            {children}
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
