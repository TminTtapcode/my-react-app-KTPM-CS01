// src/views/pages/EmployeePage.tsx
import React from 'react';
import { Container, Card, Table, Button, Spinner, Modal, Form, Badge, Row, Col } from 'react-bootstrap';
import { FiPlus, FiUsers, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useEmployeeController } from '../../controllers/useEmployeeController';

const EmployeePage = () => {
  const { employees, roles, departments, loading, showAddModal, setShowAddModal, formData, handleInputChange, handleSubmit, submitting } = useEmployeeController();

  return (
    <Container fluid className="p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Hồ sơ Nhân sự</h4>
          <span className="text-muted" style={{ fontSize: '14px' }}>Quản lý tài khoản và thông tin nhân viên</span>
        </div>
        <Button variant="primary" className="rounded-pill px-4 d-flex align-items-center shadow-sm" onClick={() => setShowAddModal(true)}>
          <FiPlus className="me-2" /> Thêm mới
        </Button>
      </div>

      <Card className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
          ) : (
            <Table hover responsive className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4 py-3 fw-medium text-muted">Nhân viên</th>
                  <th className="py-3 fw-medium text-muted">Phòng ban</th>
                  <th className="py-3 fw-medium text-muted">Chức vụ</th>
                  <th className="py-3 fw-medium text-muted">Lương cơ bản</th>
                  <th className="text-center py-3 fw-medium text-muted pe-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                    <td className="ps-4 py-3">
                      <div className="fw-bold text-dark">{emp.full_name}</div>
                      <div className="text-muted" style={{ fontSize: '12px' }}>@{emp.username}</div>
                    </td>
                    <td className="py-3">{departments.find(d => d.id === emp.department)?.name || 'Chưa phân bổ'}</td>
                    <td className="py-3">
                      <Badge bg="info" className="fw-normal">{roles.find(r => r.id === emp.role)?.name || 'N/A'}</Badge>
                    </td>
                    <td className="py-3">{Number(emp.base_salary).toLocaleString()} VNĐ</td>
                    <td className="text-center py-3 pe-4">
                      <Button variant="link" className="text-muted p-1"><FiEdit2 size={16} /></Button>
                      <Button variant="link" className="text-danger p-1"><FiTrash2 size={16} /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* MODAL TẠO MỚI NHÂN VIÊN */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0 px-4 pt-4">
          <Modal.Title className="fw-bold d-flex align-items-center"><FiUsers className="me-2 text-primary"/> Tạo hồ sơ mới</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="px-4 pb-4">
            <Row className="g-3">
              <Col md={6}>
                <Form.Label className="small fw-bold text-muted">Tên đăng nhập (Username)</Form.Label>
                <Form.Control name="username" value={formData.username} onChange={handleInputChange} required />
              </Col>
              <Col md={6}>
                <Form.Label className="small fw-bold text-muted">Mật khẩu</Form.Label>
                <Form.Control type="password" name="password" value={formData.password} onChange={handleInputChange} required />
              </Col>
              <Col md={12}>
                <Form.Label className="small fw-bold text-muted">Họ và tên đầy đủ</Form.Label>
                <Form.Control name="full_name" value={formData.full_name} onChange={handleInputChange} required />
              </Col>
              <Col md={6}>
                <Form.Label className="small fw-bold text-muted">Email liên hệ</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} />
              </Col>
              <Col md={6}>
                <Form.Label className="small fw-bold text-muted">Mức lương cơ bản</Form.Label>
                <Form.Control type="number" name="base_salary" value={formData.base_salary} onChange={handleInputChange} />
              </Col>
              <Col md={6}>
                <Form.Label className="small fw-bold text-muted">Phòng ban</Form.Label>
                <Form.Select name="department" value={formData.department} onChange={handleInputChange} required>
                  <option value="">-- Chọn phòng ban --</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label className="small fw-bold text-muted">Chức vụ (Role)</Form.Label>
                <Form.Select name="role" value={formData.role} onChange={handleInputChange} required>
                  <option value="">-- Cấp quyền --</option>
                  {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </Form.Select>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0 px-4 pb-4">
            <Button variant="light" className="rounded-pill px-4 fw-medium" onClick={() => setShowAddModal(false)}>Hủy bỏ</Button>
            <Button variant="primary" type="submit" className="rounded-pill px-4 fw-medium" disabled={submitting}>
              {submitting ? <Spinner size="sm" /> : 'Lưu hồ sơ'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default EmployeePage;