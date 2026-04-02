// src/views/pages/AnnouncementPage.tsx
import React from 'react';
import { Container, Card, Button, Spinner, Modal, Form, Row, Col } from 'react-bootstrap';
import { FiBell, FiPlus, FiTrash2, FiClock, FiUser, FiMaximize2 } from 'react-icons/fi';
import { useAnnouncementController } from '../../controllers/useAnnouncementController';

const AnnouncementPage = () => {
  const { 
    announcements, employees, loading, showModal, setShowModal, formData, 
    handleInputChange, handleSubmit, handleDelete, currentUser, submitting,
    selectedAnnouncement, showDetailModal, setShowDetailModal, handleViewDetail // Lấy hàm xem chi tiết
  } = useAnnouncementController();

  const getEmpName = (id: number) => (employees || []).find(e => e.id === id)?.full_name || 'Hệ thống';

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN') + ' lúc ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container fluid className="p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Thông báo nội bộ</h4>
          <span className="text-muted" style={{ fontSize: '14px' }}>Cập nhật tin tức và sự kiện từ công ty</span>
        </div>
        {(currentUser?.role === 'Admin' || currentUser?.role === 'HR') && (
          <Button variant="primary" className="rounded-pill px-4 shadow-sm" onClick={() => setShowModal(true)}>
            <FiPlus className="me-2" /> Đăng thông báo
          </Button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
      ) : (
        <Row>
          {announcements.length > 0 ? (
            announcements.map(ann => (
              <Col md={12} key={ann.id} className="mb-4">
                <Card className="border-0 shadow-sm" style={{ borderRadius: '16px', borderLeft: '5px solid #0d6efd', cursor: 'pointer' }} onClick={() => handleViewDetail(ann)}>
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="fw-bold text-primary mb-2">{ann.title}</h5>
                        <div className="d-flex gap-3 text-muted small">
                          <span><FiUser className="me-1" /> {getEmpName(ann.created_by)}</span>
                          <span><FiClock className="me-1" /> {formatDateTime(ann.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* BÍ QUYẾT LÀ Ở ĐÂY: CSS cắt văn bản thành 3 dòng */}
                    <div style={{ 
                      whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#4a5568',
                      display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' 
                    }}>
                      {ann.content}
                    </div>
                    
                    <div className="mt-3 text-primary fw-medium small d-flex align-items-center">
                      <FiMaximize2 className="me-1" /> Bấm để xem chi tiết
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col md={12}>
              <Card className="border-0 shadow-sm text-center py-5" style={{ borderRadius: '16px' }}>
                <FiBell size={50} className="text-muted opacity-25 mx-auto mb-3" />
                <h6 className="text-muted">Hiện chưa có thông báo nào.</h6>
              </Card>
            </Col>
          )}
        </Row>
      )}

      {/* MODAL TẠO THÔNG BÁO (Giữ nguyên) */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0 px-4 pt-4">
          <Modal.Title className="fw-bold text-primary"><FiBell className="me-2"/> Đăng thông báo mới</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="px-4 pb-4">
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Tiêu đề thông báo</Form.Label>
              <Form.Control type="text" name="title" value={formData.title} onChange={handleInputChange} required placeholder="Nhập tiêu đề ngắn gọn..." />
            </Form.Group>
            <Form.Group>
              <Form.Label className="small fw-bold">Nội dung chi tiết</Form.Label>
              <Form.Control as="textarea" rows={6} name="content" value={formData.content} onChange={handleInputChange} required placeholder="Nhập nội dung thông báo..." />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0 px-4 pb-4">
            <Button variant="light" onClick={() => setShowModal(false)}>Hủy</Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? <Spinner size="sm" /> : 'Đăng ngay'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* ========================================================= */}
      {/* MODAL MỚI: HIỂN THỊ CHI TIẾT THÔNG BÁO KHI BẤM VÀO THẺ */}
      {/* ========================================================= */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered size="lg" scrollable>
        <Modal.Header closeButton className="border-0 px-4 pt-4 pb-0">
          <Modal.Title className="fw-bold text-dark">{selectedAnnouncement?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 py-3">
          <div className="d-flex gap-4 text-muted small mb-4 pb-3 border-bottom">
            <span><FiUser className="me-1 text-primary" /> <strong>{getEmpName(selectedAnnouncement?.created_by)}</strong></span>
            <span><FiClock className="me-1 text-primary" /> {formatDateTime(selectedAnnouncement?.created_at)}</span>
          </div>
          
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', color: '#2d3748', fontSize: '16px' }}>
            {selectedAnnouncement?.content}
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 px-4 pb-4 d-flex justify-content-between">
          <div>
             {/* Chỉ Admin/HR mới thấy nút Xóa ở góc trái bảng chi tiết */}
             {(currentUser?.role === 'Admin' || currentUser?.role === 'HR') && (
                <Button variant="outline-danger" onClick={() => handleDelete(selectedAnnouncement?.id)}>
                  <FiTrash2 className="me-1" /> Xóa bài này
                </Button>
             )}
          </div>
          <Button variant="primary" onClick={() => setShowDetailModal(false)}>Đã hiểu</Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default AnnouncementPage;