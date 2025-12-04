export const LoadingState: React.FC = () => (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="text-lg">Загрузка данных о кофе...</div>
    </div>
  );
  
  export const ErrorState: React.FC<{ message: string }> = ({ message }) => (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <strong>Ошибка:</strong> {message}
    </div>
  );
  
  export const EmptyState: React.FC = () => (
    <div className="text-center py-8">
      <p className="text-gray-500">Нет доступных видов кофе</p>
    </div>
  );