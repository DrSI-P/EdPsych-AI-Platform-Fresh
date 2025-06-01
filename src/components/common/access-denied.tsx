import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';

interface AccessDeniedProps {
  message?: string;
  redirectPath?: string;
  redirectLabel?: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
  message = "You don't have permission to access this page.",
  redirectPath = "/",
  redirectLabel = "Return to Home"
}) => {
  return (
    <Box 
      className="flex flex-col items-centre justify-centre min-h-[50vh] p-8 text-centre"
      data-testid="access-denied-component"
    >
      <Heading as="h1" size="xl" mb={4} className="text-red-600">
        Access Denied
      </Heading>
      
      <Text mb={6} className="text-grey-700 max-w-md">
        {message}
      </Text>
      
      <Button 
        colorScheme="blue"
        onClick={() => window.location.href = redirectPath}
        className="px-6 py-2 rounded-md"
      >
        {redirectLabel}
      </Button>
    </Box>
  );
};

export default AccessDenied;
