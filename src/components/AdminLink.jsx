import React from 'react';
import { Box, IconButton, Tooltip } from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';

const AdminLink = () => {
  const handleAdminAccess = () => {
    window.location.href = '/admin/index.html';
  };

  return (
    <Box
      position="fixed"
      bottom="20px"
      right="20px"
      zIndex={1000}
      opacity={0.3}
      _hover={{
        opacity: 1,
        transform: 'scale(1.1)',
      }}
      transition="all 0.3s ease"
    >
      <Tooltip 
        label="管理后台" 
        placement="left"
        hasArrow
        bg="red.500"
        color="white"
      >
        <IconButton
          icon={<SettingsIcon />}
          onClick={handleAdminAccess}
          variant="ghost"
          size="sm"
          color="gray.400"
          _hover={{
            color: 'red.500',
            bg: 'red.50',
          }}
          aria-label="管理后台入口"
        />
      </Tooltip>
    </Box>
  );
};

export default AdminLink;