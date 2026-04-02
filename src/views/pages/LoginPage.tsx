// src/views/pages/LoginPage.tsx
import React from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { FiUser, FiLock } from 'react-icons/fi';
import { useAuthController } from '../../controllers/useAuthController';

const LoginPage = () => {
  const { username, setUsername, password, setPassword, loading, handleLogin } = useAuthController();

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f4f7fe' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={5}>
            <Card className="border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <div className="bg-primary text-white text-center py-4">
                <div className="bg-white text-primary rounded-circle d-inline-flex justify-content-center align-items-center fw-bold fs-2 mb-2 shadow-sm" style={{ width: '60px', height: '60px' }}>
                  T
                </div>
                <h3 className="fw-bold mb-0">tracky HRM</h3>
                <p className="mb-0 text-white-50" style={{ fontSize: '14px' }}>Hệ thống quản lý nhân sự</p>
              </div>
              
              <Card.Body className="p-5">
                <h5 className="fw-bold text-center mb-4 text-dark">Đăng nhập hệ thống</h5>
                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-muted">Tên đăng nhập</Form.Label>
                    <div className="position-relative">
                      <FiUser className="position-absolute text-muted" style={{ top: '12px', left: '15px' }} />
                      <Form.Control 
                        type="text" 
                        placeholder="Nhập username..." 
                        className="ps-5 py-2 shadow-none bg-light border-0" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="small fw-bold text-muted">Mật khẩu</Form.Label>
                    <div className="position-relative">
                      <FiLock className="position-absolute text-muted" style={{ top: '12px', left: '15px' }} />
                      <Form.Control 
                        type="password" 
                        placeholder="••••••••" 
                        className="ps-5 py-2 shadow-none bg-light border-0" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 py-2 fw-bold rounded-pill shadow-sm mb-3"
                    disabled={loading}
                  >
                    {loading ? <Spinner animation="border" size="sm" /> : 'Đăng nhập'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;