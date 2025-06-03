const AuthLayout = ({ children, title }) => {
  return (
    <main className="flex-grow flex items-center justify-center py-12 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">{title}</h2>
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;