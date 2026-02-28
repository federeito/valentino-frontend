export default function OrderTracking({ order }) {
  const { _id, line_items = [], statusHistory = [], createdAt } = order;
  
  // Sort status history by timestamp (oldest first to show progression)
  const sortedHistory = [...statusHistory].sort((a, b) => 
    new Date(a.timestamp) - new Date(b.timestamp)
  );

  // Calculate total
  const total = line_items.reduce((sum, item) => sum + (item.total_price || 0), 0);

  // Function to get emoji/symbol based on status
  const getStatusIcon = (status) => {
    const normalizedStatus = status?.trim();
    
    if (normalizedStatus === 'Pendiente') return '⏰';
    if (normalizedStatus === 'Pago confirmado') return '💰';
    if (normalizedStatus === 'En preparacion' || normalizedStatus === 'En preparación') return '📦';
    if (normalizedStatus === 'Despachado') return '🚚';
    if (normalizedStatus === 'Entregado') return '✅';
    if (normalizedStatus === 'Anulado') return '❌';
    return '🕐';
  };

  // Get status color based on status text
  const getStatusColor = (status, isLatest) => {
    if (!isLatest) return 'bg-gray-300';
    
    const normalizedStatus = status?.trim();
    
    if (normalizedStatus === 'Pendiente') return 'bg-yellow-500';
    if (normalizedStatus === 'Pago confirmado') return 'bg-green-500';
    if (normalizedStatus === 'En preparacion' || normalizedStatus === 'En preparación') return 'bg-blue-500';
    if (normalizedStatus === 'Despachado') return 'bg-purple-500';
    if (normalizedStatus === 'Entregado') return 'bg-green-600';
    if (normalizedStatus === 'Anulado') return 'bg-red-500';
    
    return 'bg-gray-500';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Order Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0 mb-4 pb-4 border-b border-gray-200">
        <div className="flex-1">
          <h4 className="text-base sm:text-lg font-semibold text-gray-900">
            Pedido #{_id?.slice(-8).toUpperCase()}
          </h4>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {new Date(createdAt).toLocaleDateString('es-AR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs sm:text-sm text-gray-600">Total</p>
          <p className="text-lg sm:text-xl font-bold text-gray-900">
            ${total.toLocaleString('es-AR')}
          </p>
        </div>
      </div>

      {/* Order Items */}
      {line_items.length > 0 && (
        <div className="mb-4 pb-4 border-b border-gray-200">
          <h5 className="text-sm font-semibold text-gray-700 mb-2">Productos</h5>
          <div className="space-y-2">
            {line_items.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 text-xs sm:text-sm">
                <span className="text-gray-600 break-words">
                  {item.quantity}x {item.title || item.originalTitle}
                  {item.color?.name && (
                    <span className="block sm:inline sm:ml-1">- Color: {item.color.name}</span>
                  )}
                </span>
                <span className="text-gray-900 font-medium whitespace-nowrap">
                  ${item.total_price?.toLocaleString('es-AR')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status Timeline */}
      <div>
        <h5 className="text-sm font-semibold text-gray-700 mb-4">Estado del Pedido</h5>
        <div className="space-y-3 sm:space-y-4">
          {sortedHistory.length > 0 ? (
            sortedHistory.map((item, index) => {
              const isLatest = index === sortedHistory.length - 1;
              return (
                <div key={index} className="flex gap-3 sm:gap-4 relative pl-6 sm:pl-8">
                  {/* Timeline Line */}
                  {index !== sortedHistory.length - 1 && (
                    <div className="absolute left-1.5 sm:left-2 top-7 sm:top-8 bottom-0 w-0.5 bg-gray-200" />
                  )}
                  
                  {/* Status Indicator */}
                  <div className={`absolute left-0 top-1.5 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 sm:border-4 border-white shadow-sm ${getStatusColor(item.status, isLatest)}`} />
                  
                  {/* Status Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-xl sm:text-2xl flex-shrink-0">{getStatusIcon(item.status)}</span>
                      <p className={`font-semibold break-words ${isLatest ? 'text-gray-900 text-sm sm:text-base' : 'text-gray-700 text-xs sm:text-sm'}`}>
                        {item.status}
                      </p>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 ml-7 sm:ml-10">
                      {new Date(item.timestamp).toLocaleString('es-AR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {item.note && (
                      <p className="text-xs sm:text-sm text-gray-700 mt-1 ml-7 sm:ml-10 italic break-words">
                        {item.note}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex items-center gap-2 sm:gap-3 text-gray-500">
              <span className="text-2xl sm:text-3xl flex-shrink-0">⏰</span>
              <p className="text-xs sm:text-sm italic break-words">
                Pendiente - No hay actualizaciones de estado disponibles
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
