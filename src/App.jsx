import React from 'react';
import { Box } from '@chakra-ui/react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Cases from './components/Cases';
import FormComponent from './components/Form';
import AdminLink from './components/AdminLink';
import ServicesPage from './components/ServicesPage';
import AdminLogin from './pages/Admin/AdminLogin';
import ContentManagement from './pages/Admin/ContentManagement';
import LeadsManagement from './pages/Admin/LeadsManagement';

const HomePage = () => {
  return (
    <>
      <Hero />
      <Cases />
      <FormComponent />
    </>
  );
};

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const [adminUsername, setAdminUsername] = React.useState('');
  const isAuthenticated = !!localStorage.getItem('adminToken');
  
  React.useEffect(() => {
    const username = localStorage.getItem('adminUsername');
    if (username) {
      setAdminUsername(username);
    }
  }, []);
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    navigate('/admin/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };
  
  return (
    <Box bg="gray.50" minH="100vh">
      <Box 
        as="nav" 
        bg="white" 
        borderBottom="1px" 
        borderColor="gray.200"
        px={6}
        py={4}
        position="sticky"
        top="0"
        zIndex="1000"
        shadow="sm"
      >
        <Box maxW="1400px" mx="auto">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={3}>
              <Box 
                fontSize="2xl" 
                fontWeight="bold" 
                bgGradient="linear(to-r, red.500, red.700)"
                bgClip="text"
              >
                新媒体运营
              </Box>
              <Box 
                px={3} 
                py={1} 
                bg="red.50" 
                borderRadius="md"
                fontSize="sm"
                fontWeight="medium"
                color="red.600"
              >
                管理后台
              </Box>
            </Box>

            <Box display={{ base: 'none', md: 'flex' }} gap={2}>
              <Box
                as="button"
                px={4}
                py={2}
                borderRadius="md"
                fontWeight="medium"
                fontSize="sm"
                transition="all 0.2s"
                bg={window.location.hash.includes('/admin/content') ? 'red.50' : 'transparent'}
                color={window.location.hash.includes('/admin/content') ? 'red.600' : 'gray.700'}
                _hover={{ bg: 'red.50', color: 'red.600' }}
                onClick={() => handleNavigation('/admin/content')}
              >
                内容管理
              </Box>
              <Box
                as="button"
                px={4}
                py={2}
                borderRadius="md"
                fontWeight="medium"
                fontSize="sm"
                transition="all 0.2s"
                bg={window.location.hash.includes('/admin/leads') ? 'red.50' : 'transparent'}
                color={window.location.hash.includes('/admin/leads') ? 'red.600' : 'gray.700'}
                _hover={{ bg: 'red.50', color: 'red.600' }}
                onClick={() => handleNavigation('/admin/leads')}
              >
                客户留咨
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={3}>
              <Box display={{ base: 'none', md: 'block' }}>
                <Box fontSize="sm" color="gray.600">
                  欢迎，<Box as="span" fontWeight="bold" color="gray.800">{adminUsername || '管理员'}</Box>
                </Box>
              </Box>
              <Box
                as="button"
                px={4}
                py={2}
                bg="white"
                border="1px"
                borderColor="red.500"
                color="red.600"
                borderRadius="md"
                fontSize="sm"
                fontWeight="medium"
                transition="all 0.2s"
                _hover={{ bg: 'red.50' }}
                onClick={handleLogout}
              >
                退出登录
              </Box>
            </Box>
          </Box>

          <Box display={{ base: 'flex', md: 'none' }} gap={2} mt={3}>
            <Box
              as="button"
              flex="1"
              px={3}
              py={2}
              borderRadius="md"
              fontWeight="medium"
              fontSize="sm"
              transition="all 0.2s"
              bg={window.location.hash.includes('/admin/content') ? 'red.50' : 'transparent'}
              color={window.location.hash.includes('/admin/content') ? 'red.600' : 'gray.700'}
              _hover={{ bg: 'red.50', color: 'red.600' }}
              onClick={() => handleNavigation('/admin/content')}
            >
              内容管理
            </Box>
            <Box
              as="button"
              flex="1"
              px={3}
              py={2}
              borderRadius="md"
              fontWeight="medium"
              fontSize="sm"
              transition="all 0.2s"
              bg={window.location.hash.includes('/admin/leads') ? 'red.50' : 'transparent'}
              color={window.location.hash.includes('/admin/leads') ? 'red.600' : 'gray.700'}
              _hover={{ bg: 'red.50', color: 'red.600' }}
              onClick={() => handleNavigation('/admin/leads')}
            >
              客户留咨
            </Box>
          </Box>
        </Box>
      </Box>

      <Box maxW="1400px" mx="auto" p={{ base: 4, md: 6 }}>
        {children}
      </Box>

      <Box
        position="fixed"
        bottom="20px"
        right="20px"
        zIndex="999"
      >
        <Box
          as="button"
          px={4}
          py={2}
          bg="white"
          border="1px"
          borderColor="gray.300"
          borderRadius="full"
          fontSize="sm"
          fontWeight="medium"
          color="gray.700"
          shadow="lg"
          transition="all 0.2s"
          _hover={{ 
            bg: 'gray.50',
            transform: 'translateY(-2px)',
            shadow: 'xl'
          }}
          onClick={() => navigate('/')}
        >
          返回主站
        </Box>
      </Box>
    </Box>
  );
};

const App = () => {
  return (
    <Router>
      <Box>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Box as="main">
                  <HomePage />
                </Box>
                <AdminLink />
              </>
            }
          />
          <Route
            path="/services"
            element={
              <>
                <Navbar />
                <Box as="main">
                  <ServicesPage />
                </Box>
                <AdminLink />
              </>
            }
          />

          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route
            path="/admin/content"
            element={
              <AdminLayout>
                <ContentManagement />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/leads"
            element={
              <AdminLayout>
                <LeadsManagement />
              </AdminLayout>
            }
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;