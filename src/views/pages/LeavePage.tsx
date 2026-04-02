// src/views/pages/LeavePage.tsx
import React from 'react';
import { Container, Card, Table, Button, Spinner, Modal, Form, Badge, Row, Col } from 'react-bootstrap';
import { FiCalendar, FiPlus, FiCheck, FiX } from 'react-icons/fi';
import { useLeaveController } from '../../controllers/useLeaveController';

const LeavePage = () => {
  const { leaves, employees, loading, showModal, setShowModal, formData, handleInputChange, handleSubmit, handleUpdateStatus, currentUser, submitting } = useLeaveController();

  const getEmpName = (id: number) => employees.find(e => e.id === id)?.full_name || 'N/A';

  // Dịch loại nghỉ phép
  const typeMap: any = { 'SICK': 'Nghỉ ốm', 'ANNUAL': 'Phép năm', 'UNPAID': 'Không lương' };
  
  // Màu sắc trạng thái
  const statusColor: any = { 'Pending': 'warning', 'Approved': 'success', 'Rejected': 'danger' };

  // Dịch trạng thái
  const statusText: any = { 'Pending': 'Chờ duyệt', 'Approved': 'Đã duyệt', 'Rejected': 'Từ chối' };

  return (
    <Container fluid className="p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Quản lý Nghỉ phép</h4>
          <span className="text-muted" style={{ fontSize: '14px' }}>Theo dõi và phê duyệt đơn xin nghỉ</span>
        </div>
        <Button variant="primary" className="rounded-pill px-4 shadow-sm" onClick={() => setShowModal(true)}>
          <FiPlus className="me-2" /> Tạo đơn xin nghỉ
        </Button>
      </div>

      <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
          ) : (
            <Table hover responsive className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4 py-3 text-muted">Nhân viên</th>
                  <th className="py-3 text-muted">Loại nghỉ</th>
                  <th className="py-3 text-muted">Thời gian</th>
                  <th className="py-3 text-muted">Lý do</th>
                  <th className="py-3 text-muted">Trạng thái</th>
                  <th className="text-center py-3 text-muted pe-4">Phê duyệt (HR/Admin)</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map(leave => (
                  <tr key={leave.id}>
                    <td className="ps-4 py-3 fw-bold text-dark">{getEmpName(leave.user)}</td>
                    <td className="py-3">
                      <Badge bg="info" className="fw-normal">{typeMap[leave.leave_type] || leave.leave_type}</Badge>
                    </td>
                    <td className="py-3 small">
                      {new Date(leave.start_date).toLocaleDateString('vi-VN')} <br/> 
                      <span className="text-muted">đến</span> <br/>
                      {new Date(leave.end_date).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3 text-muted" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {leave.reason}
                    </td>
                    <td className="py-3">
                      <Badge bg={statusColor[leave.status] || 'secondary'}>{statusText[leave.status] || leave.status}</Badge>
                      {leave.approved_by && <div className="text-muted mt-1" style={{ fontSize: '11px' }}>Bởi: {getEmpName(leave.approved_by)}</div>}
                    </td>
                    
                    <td className="text-center py-3 pe-4">
                      {/* CHỈ HIỂN THỊ NÚT DUYỆT NẾU LÀ ADMIN HOẶC HR VÀ ĐƠN ĐANG CHỜ */}
                      {leave.status === 'Pending' && (currentUser?.role === 'Admin' || currentUser?.role === 'HR') ? (
                        <div className="d-flex justify-content-center gap-2">
                          <Button variant="outline-success" size="sm" onClick={() => handleUpdateStatus(leave.id, 'Approved')}>
                            <FiCheck /> Duyệt
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleUpdateStatus(leave.id, 'Rejected')}>
                            <FiX /> Từ chối
                          </Button>
                        </div>
                      ) : (
                        <span className="text-muted small">--</span>
                      )}
                    </td>
                  </tr>
                ))}
                {leaves.length === 0 && <tr><td colSpan={6} className="text-center py-4 text-muted">Chưa có đơn xin nghỉ phép nào.</td></tr>}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* MODAL TẠO ĐƠN */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0 px-4 pt-4">
          <Modal.Title className="fw-bold text-primary"><FiCalendar className="me-2"/> Đơn xin nghỉ phép</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="px-4 pb-4">
            <Row className="g-3">
              <Col md={12}>
                <Form.Label className="small fw-bold">Loại nghỉ phép</Form.Label>
                <Form.Select name="leave_type" value={formData.leave_type} onChange={handleInputChange} required>
                  <option value="ANNUAL">Nghỉ phép năm (Có lương)</option>
                  <option value="SICK">Nghỉ ốm (Có giấy khám)</option>
                  <option value="UNPAID">Nghỉ không lương</option>
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label className="small fw-bold">Từ ngày</Form.Label>
                <Form.Control type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} required />
              </Col>
              <Col md={6}>
                <Form.Label className="small fw-bold">Đến ngày</Form.Label>
                <Form.Control type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} required />
              </Col>
              <Col md={12}>
                <Form.Label className="small fw-bold">Lý do xin nghỉ</Form.Label>
                <Form.Control as="textarea" rows={3} name="reason" value={formData.reason} onChange={handleInputChange} required placeholder="Ghi rõ lý do xin nghỉ..." />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0 px-4 pb-4">
            <Button variant="light" onClick={() => setShowModal(false)}>Hủy</Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? <Spinner size="sm" /> : 'Gửi đơn'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default LeavePage;