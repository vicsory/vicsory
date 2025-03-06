// components/logout-dialog.tsx
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOutDialogProps } from "@/types/DialogProps";
import CircularLoading from "../misc/CircularLoading";

export default function LogOutDialog({ 
  open, 
  handleLogOutClose, 
  logout, 
  isLoggingOut 
}: LogOutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={handleLogOutClose}>
      <DialogContent 
        className="sm:max-w-[425px]"
        style={{ 
          backgroundColor: 'var(--background-primary)',
          borderColor: 'var(--border-color)'
        }}
      >
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <Image 
              src="/assets/favicon.png" 
              alt="" 
              width={40} 
              height={40} 
            />
          </div>
          <DialogTitle 
            className="text-center"
            style={{ color: 'var(--active-mode)' }}
          >
            {isLoggingOut ? "Logging out..." : "Log out of Vicsory?"}
          </DialogTitle>
        </DialogHeader>
        <div 
          className="text-center text-muted-foreground py-4"
          style={{ color: 'var(--text-2)' }}
        >
          You can always log back in at any time.
        </div>
        {isLoggingOut ? (
          <CircularLoading />
        ) : (
          <div className="flex flex-col gap-4">
            <Button
              onClick={logout}
              className="w-full"
              style={{
                backgroundColor: 'var(--blue)',
                color: 'white',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-blue)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--blue)'}
              autoFocus
            >
              Log out
            </Button>
            <Button
              onClick={handleLogOutClose}
              variant="outline"
              className="w-full"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--active-mode)',
                backgroundColor: 'var(--grey)',
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}