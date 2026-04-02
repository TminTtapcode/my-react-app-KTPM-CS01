// src/views/pages/AttendancePage.tsx
import { Container, Card, Row, Col, Button, Table, Badge, Spinner } from 'react-bootstrap';
import { FiCheckCircle, FiLogOut, FiCalendar } from 'react-icons/fi';
import { useAttendanceController } from '../../controllers/useAttendanceController';

const AttendancePage = () => {
  const { 
    currentTime, logs, loading, isCheckedIn, 
    handleCheckIn, handleCheckOut 
  } = useAttendanceController();

  // Kiểm tra xem hôm nay đã hoàn thành ca làm chưa (đã check in & check out)
  const todayString = new Date().toLocaleDateString('vi-VN');
  const isDoneForToday = logs.some((log: any) => log.date === todayString && log.checkOut !== '--:--');

  return (
    <Container fluid className="p-0">
      <div className="mb-4">
        <h4 className="fw-bold mb-1" style={{ color: '#1a1d1f' }}>Chấm công (Attendance)</h4>
        <span className="text-muted" style={{ fontSize: '14px' }}>Theo dõi thời gian làm việc hàng ngày</span>
      </div>

      <Row className="mb-4">
        {/* KHỐI ĐỒNG HỒ & NÚT BẤM */}
        <Col md={5} className="mb-4 mb-md-0">
          <Card className="h-100 shadow-sm border-0 text-center py-4" style={{ borderRadius: '16px', backgroundColor: '#ffffff' }}>
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              <div className="mb-3 d-flex align-items-center gap-2 text-muted fw-medium">
                <FiCalendar /> {currentTime.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              
              <h1 className="fw-bold mb-4" style={{ fontSize: '56px', color: '#0d6efd', letterSpacing: '2px', fontFamily: 'monospace' }}>
                {currentTime.toLocaleTimeString('vi-VN', { hour12: false })}
              </h1>

              <div className="d-flex gap-3 w-100 px-4">
                <Button 
                  variant={isCheckedIn || isDoneForToday ? "light" : "primary"} 
                  className="flex-grow-1 py-3 rounded-4 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                  disabled={isCheckedIn || isDoneForToday}
                  onClick={handleCheckIn}
                >
                  <FiCheckCircle size={20} /> CHECK IN
                </Button>
                <Button 
                  variant={!isCheckedIn || isDoneForToday ? "light" : "danger"} 
                  className="flex-grow-1 py-3 rounded-4 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                  disabled={!isCheckedIn || isDoneForToday}
                  onClick={handleCheckOut}
                >
                  <FiLogOut size={20} /> CHECK OUT
                </Button>
              </div>
              
              <div className="mt-4 text-muted" style={{ fontSize: '14px' }}>
                Trạng thái: {' '}
                {isDoneForToday ? <span className="text-secondary fw-bold">✔️ Đã hoàn thành ca làm</span> :
                 isCheckedIn ? <span className="text-success fw-bold">🟢 Đang làm việc</span> : 
                 <span className="text-secondary fw-bold">⚪ Chưa vào ca</span>}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* KHỐI LỊCH SỬ CHẤM CÔNG */}
        <Col md={7}>
          <Card className="h-100 shadow-sm" style={{ border: '1px solid #ebebeb', borderRadius: '16px' }}>
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4" style={{ fontSize: '16px' }}>Lịch sử chấm công gần đây</h5>
              
              {loading ? (
                <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
              ) : (
                <Table responsive hover className="align-middle mb-0" style={{ fontSize: '14px' }}>
                  <thead className="table-light">
                    <tr>
                      <th className="fw-semibold text-muted py-2">Ngày</th>
                      <th className="fw-semibold text-muted py-2">Giờ vào (In)</th>
                      <th className="fw-semibold text-muted py-2">Giờ ra (Out)</th>
                      <th className="fw-semibold text-muted py-2">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.length > 0 ? logs.map((log: any) => (
                      <tr key={log.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                        <td className="py-3 fw-medium text-dark">{log.date}</td>
                        <td className="py-3 text-success fw-semibold">{log.checkIn}</td>
                        <td className="py-3 text-danger fw-semibold">{log.checkOut}</td>
                        <td className="py-3">
                          <Badge bg={log.status === 'Đúng giờ' ? 'success' : 'warning'} 
                                 className="px-2 py-1 fw-medium bg-opacity-10"
                                 style={{ borderRadius: '6px', color: log.status === 'Đúng giờ' ? '#15803d' : '#b45309', backgroundColor: 'transparent' }}>
                            {log.status}
                          </Badge>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={4} className="text-center py-4 text-muted">Chưa có dữ liệu chấm công.</td></tr>
                    )}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AttendancePage;