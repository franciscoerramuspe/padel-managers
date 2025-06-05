interface ErrorMessageProps {
    message: string;
  }
  
  export const ErrorMessage = ({ message }: ErrorMessageProps) => {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 text-sm">
          {message}
        </p>
      </div>
    );
  };