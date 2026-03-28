import React from 'react';
import { AlertCircle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

const ErrorModal = ({
  isOpen,
  onClose,
  title,
  message,
  details
}) => {
  const footer = (
    <Button
      variant="primary"
      onClick={onClose}
      className="w-full sm:w-auto"
    >
      OK
    </Button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
    >
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <AlertCircle className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <div className="mt-2">
            <p className="text-sm text-gray-900 font-medium mb-2">
              {message}
            </p>
            {details && (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                <p className="text-xs text-gray-600">
                  <strong>Error Details:</strong>
                </p>
                <p className="text-xs text-gray-600 mt-1 font-mono">
                  {details}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ErrorModal;