import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';

const Privacy = () => {
    return (
        <Container maxW="container.xl" py={10}>
            <VStack spacing={6} align="stretch">
                <Heading as="h1" size="2xl">
                    Privacy Policy
                </Heading>
                <Box>
                    <Heading as="h2" size="lg" mb={2}>
                        1. Introduction
                    </Heading>
                    <Text>
                        Welcome to Cyberia. We are committed to protecting your personal information
                        and your right to privacy. This Privacy Policy explains how we collect, use,
                        disclose, and safeguard your information when you use our game and services.
                    </Text>
                </Box>
                <Box>
                    <Heading as="h2" size="lg" mb={2}>
                        2. Information We Collect
                    </Heading>
                    <Text>
                        We collect information that you provide directly to us when registering for
                        an account, creating or modifying your profile, playing the game, or
                        communicating with us. This may include your name, email address, username,
                        and any other information you choose to provide.
                    </Text>
                </Box>
                <Box>
                    <Heading as="h2" size="lg" mb={2}>
                        3. How We Use Your Information
                    </Heading>
                    <Text>
                        We use the information we collect to operate, maintain, and provide you with
                        the features and functionality of Cyberia, to communicate with you, to
                        monitor and analyze trends and usage, and to improve and enhance the game.
                    </Text>
                </Box>
                <Box>
                    <Heading as="h2" size="lg" mb={2}>
                        4. Sharing of Your Information
                    </Heading>
                    <Text>
                        We do not share, sell, rent, or trade your personal information with third
                        parties for their commercial purposes. We may share your information with
                        third-party service providers that perform services on our behalf, such as
                        hosting and data analysis.
                    </Text>
                </Box>
                <Box>
                    <Heading as="h2" size="lg" mb={2}>
                        5. Data Security
                    </Heading>
                    <Text>
                        We use appropriate technical and organizational measures to protect the
                        personal information that we collect and process about you. However, no
                        security system is impenetrable, and we cannot guarantee the security of our
                        systems 100%.
                    </Text>
                </Box>
                <Box>
                    <Heading as="h2" size="lg" mb={2}>
                        6. Your Rights
                    </Heading>
                    <Text>
                        You have the right to access, update, or delete your personal information.
                        You can do this by logging into your account settings or by contacting us
                        directly.
                    </Text>
                </Box>
                <Box>
                    <Heading as="h2" size="lg" mb={2}>
                        7. Changes to This Privacy Policy
                    </Heading>
                    <Text>
                        We may update this Privacy Policy from time to time. We will notify you of
                        any changes by posting the new Privacy Policy on this page and updating the
                        Last Updated date.
                    </Text>
                </Box>
                <Box>
                    <Heading as="h2" size="lg" mb={2}>
                        8. Contact Us
                    </Heading>
                    <Text>
                        If you have any questions about this Privacy Policy, please contact us at
                        support@cyberia.fun.
                    </Text>
                </Box>
            </VStack>
        </Container>
    );
};

export default Privacy;
