
export const Loading = ({ isLoading = false, message = "Lädt..." }) => {
  if (!isLoading) return null; // Komponente wird nur angezeigt, wenn isLoading true ist

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#ffffff2c] bg-opacity-50 z-50">
      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      {/* Text */}
      <p className="mt-4 text-lg text-black">{message}</p>
    </div>
  );
};