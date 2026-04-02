// src/views/pages/HrReportPage.tsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Spinner, ProgressBar, Table, Badge, Button } from 'react-bootstrap';
import { FiPieChart, FiUsers, FiUserPlus, FiBarChart2, FiAward, FiDownload } from 'react-icons/fi';
import { useHrReportController } from '../../controllers/useHrReportController';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

const HrReportPage = () => {
  const { loading, stats } = useHrReportController();
  const [isExporting, setIsExporting] = useState(false);

  // === HÀM XUẤT PDF SIÊU XỊN ===
  const handleExportPDF = async () => {
    const input = document.getElementById('report-content');
    if (!input) return;

    setIsExporting(true);
    toast.loading('Đang tạo file PDF...', { id: 'pdf-toast' });

    try {
      // Chụp ảnh khu vực báo cáo (scale: 2 để ảnh nét hơn)
      const canvas = await html2canvas(input, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      
      // Tạo khung PDF khổ A4
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Nhét ảnh vào PDF và Tải về
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Bao_Cao_Nhan_Su_T${new Date().getMonth() + 1}_${new Date().getFullYear()}.pdf`);
      
      toast.success('Xuất báo cáo PDF thành công!', { id: 'pdf-toast' });
    } catch (error) {
      toast.error('Có lỗi khi xuất PDF!', { id: 'pdf-toast' });
    } finally {
      setIsExporting(false);
    }
  };

  if (loading || !stats) {
    return <div className="vh-100 d-flex justify-content-center align-items-center"><Spinner animation="border" variant="primary" /></div>;
  }

  return (
    <Container fluid className="p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Báo cáo Nhân sự</h4>
          <span className="text-muted" style={{ fontSize: '14px' }}>Thống kê và phân bổ nguồn nhân lực</span>
        </div>
        {/* NÚT BẤM KÍCH HOẠT HÀM XUẤT PDF */}
        <Button 
          variant="primary" 
          className="shadow-sm rounded-pill px-4" 
          onClick={handleExportPDF}
          disabled={isExporting}
        >
          {isExporting ? <Spinner size="sm" className="me-2" /> : <FiDownload className="me-2" />}
          {isExporting ? 'Đang xuất...' : 'Xuất báo cáo (PDF)'}
        </Button>
      </div>

      {/* GẮN ID VÀO ĐÂY ĐỂ THƯ VIỆN BIẾT CẦN CHỤP CHỖ NÀO */}
      <div id="report-content" className="p-3 bg-white" style={{ borderRadius: '16px' }}>
        
        <Row className="mb-4 g-4">
          <Col md={6}>
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px', backgroundColor: '#eef2ff' }}>
              <Card.Body className="p-4 d-flex align-items-center">
                <div className="bg-primary text-white p-3 rounded-circle me-4"><FiUsers size={32} /></div>
                <div>
                  <h6 className="text-primary fw-bold mb-1">TỔNG QUÂN SỐ HIỆN TẠI</h6>
                  <h1 className="fw-bold text-dark mb-0 display-5">{stats.totalEmp} <span className="fs-5 text-muted fw-normal">nhân sự</span></h1>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px', backgroundColor: '#f0fdf4' }}>
              <Card.Body className="p-4 d-flex align-items-center">
                <div className="bg-success text-white p-3 rounded-circle me-4"><FiUserPlus size={32} /></div>
                <div>
                  <h6 className="text-success fw-bold mb-1">NHÂN SỰ MỚI THÁNG NÀY</h6>
                  <h1 className="fw-bold text-dark mb-0 display-5">+{stats.newHiresCount} <span className="fs-5 text-muted fw-normal">người</span></h1>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4 mb-4">
          <Col md={6}>
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-4"><FiBarChart2 className="text-primary me-2" /> Phân bổ theo Phòng ban</h5>
                {stats.depStats.map((dep: any, index: number) => (
                  <div key={index} className="mb-3">
                    <div className="d-flex justify-content-between mb-1 small fw-medium">
                      <span>{dep.name}</span>
                      <span className="text-primary">{dep.count} người ({dep.percent}%)</span>
                    </div>
                    <ProgressBar now={dep.percent} variant="primary" style={{ height: '8px' }} />
                  </div>
                ))}
                {stats.depStats.length === 0 && <div className="text-muted small">Chưa có dữ liệu phòng ban.</div>}
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-4"><FiPieChart className="text-warning me-2" /> Cơ cấu theo Chức vụ</h5>
                {stats.roleStats.map((role: any, index: number) => (
                  <div key={index} className="mb-3">
                    <div className="d-flex justify-content-between mb-1 small fw-medium">
                      <span>{role.name}</span>
                      <span className="text-warning">{role.count} người ({role.percent}%)</span>
                    </div>
                    <ProgressBar now={role.percent} variant={index % 2 === 0 ? "warning" : "info"} style={{ height: '8px' }} />
                  </div>
                ))}
                {stats.roleStats.length === 0 && <div className="text-muted small">Chưa có dữ liệu chức vụ.</div>}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
          <Card.Body className="p-4">
            <h5 className="fw-bold mb-4"><FiAward className="text-success me-2" /> Chào mừng nhân sự mới (Tháng này)</h5>
            <Table hover responsive className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="py-3 text-muted">Họ và tên</th>
                  <th className="py-3 text-muted">Tài khoản</th>
                  <th className="py-3 text-muted">Chức vụ</th>
                  <th className="py-3 text-muted">Ngày gia nhập</th>
                </tr>
              </thead>
              <tbody>
                {stats.newHiresList.map((emp: any) => (
                  <tr key={emp.id}>
                    <td className="py-3 fw-bold text-dark">{emp.full_name || 'Chưa cập nhật'}</td>
                    <td className="py-3">@{emp.username}</td>
                    <td className="py-3"><Badge bg="info" className="fw-normal">{emp.role_name || 'Chưa phân quyền'}</Badge></td>
                    <td className="py-3 text-success fw-medium">{emp.hire_date ? new Date(emp.hire_date).toLocaleDateString('vi-VN') : '--'}</td>
                  </tr>
                ))}
                {stats.newHiresList.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-4 text-muted">Chưa có nhân sự mới nào trong tháng này.</td></tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

      </div>
    </Container>
  );
};

export default HrReportPage;