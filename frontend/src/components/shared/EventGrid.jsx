export const EventGrid = ({ children }) => {
  return (
    <div
      className={
        "grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
      }
    >
      {children}
    </div>
  );
};
