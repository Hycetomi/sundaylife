import { useState } from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
}

export const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
}: ConfirmDialogProps) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const Icon = variant === 'danger' ? AlertTriangle : Info;
  const iconColor = variant === 'danger' ? 'text-hot-red' : 'text-waxy-corn';
  const iconBg = variant === 'danger' ? 'bg-hot-red/10' : 'bg-waxy-corn/10';

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      showClose={false}
      closeOnBackdrop={!loading}
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}>
          <Icon size={22} className={iconColor} />
        </div>

        <div>
          <p className="font-cabinet font-bold text-base text-pink-swirl">{title}</p>
          {description && (
            <p className="font-general text-sm text-pink-swirl/50 mt-1.5 leading-relaxed">{description}</p>
          )}
        </div>

        <div className="flex gap-3 w-full pt-1">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            className="flex-1"
            loading={loading}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
