// src/views/pages/PayrollPage.tsx
import React from 'react';
import { Container, Card, Table, Button, Spinner, Modal, Badge, Row, Col, Form } from 'react-bootstrap';
import { FiDollarSign, FiTrendingUp, FiCheckCircle, FiAlertCircle, FiFilter } from 'react-icons/fi';
import { usePayrollController } from '../../controllers/usePayrollController';

const PayrollPage = () => {
  const { 
    payrolls, employees, loading, showModal, setShowModal, currentEstimate, 
    handleGeneratePayroll, handleMarkAsPaid, currentUser, submitting,
    filterMonth, setFilterMonth, filterYear, setFilterYear // Lấy bộ lọc từ Controller
  } = usePayrollController();

  const getEmpName = (id: number) => (employees || []).find(e => e.id === id)?.full_name || 'Không xác định';
  const formatMoney = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  return (
    <Container fluid className="p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Bảng Lương (Payroll)</h4>
          <span className="text-muted" style={{ fontSize: '14px' }}>Quản lý thu nhập và lịch sử thanh toán</span>
        </div>
        {(currentUser?.role === 'Admin' || currentUser?.role === 'HR') && (
          <Button variant="success" className="rounded-pill px-4 shadow-sm" onClick={() => setShowModal(true)}>
            <FiCheckCircle className="me-2" /> Chốt lương tháng này
          </Button>
        )}
      </div>

      {/* THẺ TẠM TÍNH GIỮ NGUYÊN */}
      {!loading && currentEstimate && (
        <Card className="border-0 shadow-sm mb-4 bg-primary text-white" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <Card.Body className="p-4">
            <Row className="align-items-center">
              <Col md={8}>
                <h6 className="text-white-50 fw-bold mb-1">
                  <FiTrendingUp className="me-2" /> THU NHẬP TẠM TÍNH - THÁNG {currentEstimate.month}/{currentEstimate.year}
                </h6>
                <h1 className="display-5 fw-bold mb-3">{formatMoney(currentEstimate.netPay)}</h1>
                <div className="d-flex gap-4">
                  <div><small className="text-white-50 d-block">Lương cơ bản</small> <span className="fw-medium">{formatMoney(currentEstimate.baseSalary)}</span></div>
                  <div><small className="text-white-50 d-block">Ngày công</small> <span className="fw-medium">{currentEstimate.actualWorkDays} ngày</span></div>
                  <div><small className="text-white-50 d-block">Nghỉ có lương</small> <span className="fw-medium">{currentEstimate.paidLeaveDays} ngày</span></div>
                  <div><small className="text-warning d-block">Phạt đi trễ ({currentEstimate.lateDays} lần)</small> <span className="fw-medium text-warning">- {formatMoney(currentEstimate.penalty)}</span></div>
                </div>
              </Col>
              <Col md={4} className="text-end d-none d-md-block">
                <FiDollarSign size={120} className="text-white opacity-25" />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* === BỘ LỌC TRA CỨU === */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">Lịch sử nhận lương</h5>
        <div className="d-flex gap-2 align-items-center">
          <FiFilter className="text-muted" />
          <Form.Select size="sm" style={{ width: '120px' }} value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
            <option value="">Tất cả tháng</option>
            {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>Tháng {i+1}</option>)}
          </Form.Select>
          <Form.Select size="sm" style={{ width: '120px' }} value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
            <option value="">Tất cả năm</option>
            <option value="2025">Năm 2025</option>
            <option value="2026">Năm 2026</option>
          </Form.Select>
        </div>
      </div>

      {/* BẢNG LỊCH SỬ */}
      <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
          ) : (
            <Table hover responsive className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4 py-3 text-muted">Kỳ lương</th>
                  <th className="py-3 text-muted">Nhân viên</th>
                  <th className="py-3 text-muted">Ngày công chuẩn</th>
                  <th className="py-3 text-muted">Thực tế (Công + Phép)</th>
                  <th className="py-3 text-muted">Thực lãnh (Net Pay)</th>
                  <th className="py-3 text-muted">Trạng thái</th>
                  <th className="text-center py-3 text-muted pe-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {(payrolls || []).map(pay => (
                  <tr key={pay.id}>
                    <td className="ps-4 py-3 fw-bold">Tháng {pay.month}/{pay.year}</td>
                    <td className="py-3 text-dark">{getEmpName(pay.user)}</td>
                    <td className="py-3">{pay.standard_work_days} ngày</td>
                    <td className="py-3">{pay.actual_work_days} + {pay.paid_leave_days} ngày</td>
                    <td className="py-3 text-success fw-bold">{formatMoney(Number(pay.net_pay))}</td>
                    <td className="py-3">
                      <Badge bg={pay.status === 'Paid' ? 'success' : 'warning'} className="fw-normal px-2 py-1">
                        {pay.status === 'Paid' ? 'Đã thanh toán' : 'Chờ chuyển khoản'}
                      </Badge>
                    </td>
                    <td className="text-center py-3 pe-4">
                      {pay.status !== 'Paid' && (currentUser?.role === 'Admin' || currentUser?.role === 'HR') ? (
                        <Button variant="outline-success" size="sm" onClick={() => handleMarkAsPaid(pay.id)}>Xác nhận chi</Button>
                      ) : (
                        <span className="text-muted small">--</span>
                      )}
                    </td>
                  </tr>
                ))}
                {(!payrolls || payrolls.length === 0) && <tr><td colSpan={7} className="text-center py-4 text-muted">Không tìm thấy dữ liệu lương.</td></tr>}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* MODAL CHỐT LƯƠNG GIỮ NGUYÊN */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0 px-4 pt-4">
          <Modal.Title className="fw-bold text-success"><FiAlertCircle className="me-2"/> Xác nhận chốt lương</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pb-4">
          <p>Bạn có chắc chắn muốn chốt bảng lương cho <strong>Tháng {currentEstimate?.month}/{currentEstimate?.year}</strong> không?</p>
          <p className="text-muted small">Hệ thống sẽ dựa vào dữ liệu chấm công và đơn xin nghỉ phép đã duyệt để tạo bảng tính tự động.</p>
        </Modal.Body>
        <Modal.Footer className="border-0 px-4 pb-4">
          <Button variant="light" onClick={() => setShowModal(false)}>Hủy</Button>
          <Button variant="success" onClick={handleGeneratePayroll} disabled={submitting}>
            {submitting ? <Spinner size="sm" /> : 'Đồng ý chốt lương'}
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default PayrollPage;