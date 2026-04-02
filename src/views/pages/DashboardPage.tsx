// src/views/pages/DashboardPage.tsx
import React from 'react';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import { FiUsers, FiCheckCircle, FiDollarSign, FiBell, FiArrowRight, FiClock, FiCalendar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useDashboardController } from '../../controllers/useDashboardController';

const DashboardPage = () => {
  const { loading, stats, recentAnnouncements, currentUser } = useDashboardController();

  const formatMoney = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

  // Hiệu ứng chào hỏi theo buổi trong ngày
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><Spinner animation="grow" variant="primary" /></div>;

  return (
    <Container fluid className="p-0">
      {/* LỜI CHÀO & NGÀY THÁNG */}
      <div className="d-flex justify-content-between align-items-end mb-4 pb-3 border-bottom">
        <div>
          <h3 className="fw-bold mb-1">{greeting}, {currentUser?.full_name || currentUser?.username}! 👋</h3>
          <span className="text-muted">Chúc bạn một ngày làm việc tràn đầy năng lượng.</span>
        </div>
        <div className="text-end d-none d-md-block text-muted fw-medium bg-light px-3 py-2 rounded-3 shadow-sm">
          <FiCalendar className="me-2 mb-1" />
          Hôm nay: {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* THẺ THỐNG KÊ (Khác nhau tùy Role) */}
      <Row className="mb-4 g-4">
        {stats.type === 'Admin' ? (
          <>
            <Col md={4}>
              <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px', borderLeft: '5px solid #0d6efd' }}>
                <Card.Body className="p-4 d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-muted fw-bold mb-2">TỔNG NHÂN SỰ</h6>
                    <h2 className="fw-bold text-dark mb-0">{stats.totalEmployees} <span className="fs-6 text-muted fw-normal">người</span></h2>
                  </div>
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary"><FiUsers size={28} /></div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px', borderLeft: '5px solid #198754' }}>
                <Card.Body className="p-4 d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-muted fw-bold mb-2">ĐI LÀM HÔM NAY</h6>
                    <h2 className="fw-bold text-dark mb-0">{stats.presentToday} <span className="fs-6 text-muted fw-normal">người</span></h2>
                  </div>
                  <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success"><FiCheckCircle size={28} /></div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px', borderLeft: '5px solid #ffc107' }}>
                <Card.Body className="p-4 d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-muted fw-bold mb-2">QUỸ LƯƠNG THÁNG NÀY</h6>
                    <h2 className="fw-bold text-dark mb-0">{formatMoney(stats.totalPayroll)}</h2>
                  </div>
                  <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-warning"><FiDollarSign size={28} /></div>
                </Card.Body>
              </Card>
            </Col>
          </>
        ) : (
          <>
            <Col md={6}>
              <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px', borderLeft: '5px solid #198754' }}>
                <Card.Body className="p-4 d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-muted fw-bold mb-2">NGÀY CÔNG THÁNG NÀY</h6>
                    <h2 className="fw-bold text-dark mb-0">{stats.workDays} <span className="fs-6 text-muted fw-normal">ngày</span></h2>
                  </div>
                  <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success"><FiCheckCircle size={28} /></div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px', borderLeft: '5px solid #0d6efd' }}>
                <Card.Body className="p-4 d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-muted fw-bold mb-2">THU NHẬP ƯỚC TÍNH</h6>
                    <h2 className="fw-bold text-dark mb-0">{formatMoney(stats.estSalary)}</h2>
                  </div>
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary"><FiDollarSign size={28} /></div>
                </Card.Body>
              </Card>
            </Col>
          </>
        )}
      </Row>

      {/* KHU VỰC BẢNG TIN - ĐẬP VÀO MẮT NGƯỜI DÙNG */}
      <Row>
        <Col md={12}>
          <Card className="border-0 shadow-sm" style={{ borderRadius: '16px', backgroundColor: '#f8f9fa' }}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-dark mb-0"><FiBell className="text-danger me-2" /> Bảng tin & Thông báo mới</h5>
                <Link to="/announcements">
                  <Button variant="outline-primary" size="sm" className="rounded-pill px-3">
                    Xem tất cả <FiArrowRight className="ms-1" />
                  </Button>
                </Link>
              </div>

              <Row className="g-3">
                {recentAnnouncements.length > 0 ? (
                  recentAnnouncements.map(ann => (
                    <Col lg={4} md={6} key={ann.id}>
                      <Card className="h-100 border-0 shadow-sm hover-lift" style={{ borderRadius: '12px', transition: 'transform 0.2s' }}>
                        <Card.Body className="p-3 d-flex flex-column">
                          <h6 className="fw-bold text-primary mb-2 text-truncate" title={ann.title}>{ann.title}</h6>
                          <div className="text-muted small mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flexGrow: 1 }}>
                            {ann.content}
                          </div>
                          <div className="d-flex align-items-center text-muted" style={{ fontSize: '11px' }}>
                            <FiClock className="me-1" /> {new Date(ann.created_at).toLocaleDateString('vi-VN')}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <Col md={12}>
                    <div className="text-center text-muted py-4">Chưa có thông báo nào gần đây.</div>
                  </Col>
                )}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </Container>
  );
};

export default DashboardPage;