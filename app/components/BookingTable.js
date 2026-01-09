'use client';

export default function BookingTable({ bookings, onStatusChange, onDelete }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'approved':
        return '✅ อนุมัติ';
      case 'rejected':
        return '❌ ปฏิเสธ';
      default:
        return '⏳ รอตรวจสอบ';
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-gray-500 text-lg">ไม่มีการจองพื้นที่</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                ชื่อร้านค้า
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                เจ้าของ
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                เบอร์โทร
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                ประเภท
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                พื้นที่
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                สถานะ
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                การจัดการ
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {booking.storeName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {booking.ownerName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {booking.phone}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {booking.shopType}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {booking.stallNumber}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                    {getStatusLabel(booking.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    {booking.status !== 'approved' && (
                      <button
                        onClick={() => onStatusChange(booking._id, 'approved')}
                        className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition"
                      >
                        อนุมัติ
                      </button>
                    )}
                    {booking.status !== 'rejected' && (
                      <button
                        onClick={() => onStatusChange(booking._id, 'rejected')}
                        className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition"
                      >
                        ปฏิเสธ
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(booking._id)}
                      className="px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 transition"
                    >
                      ลบ
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
