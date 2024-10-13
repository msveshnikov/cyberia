import { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    Text,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    UnorderedList,
    ListItem,
    Image,
    Flex,
    useDisclosure
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
    const [step, setStep] = useState(0);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();

    const steps = [
        {
            title: 'Welcome to Cyberia',
            content:
                'Cyberia is an innovative MMO game where you can create your own virtual property on an infinite map.',
            image: '/hero2.jpg'
        },
        {
            title: 'Create Your Property',
            content: 'Use AI-powered tools to generate unique 1024x1024 tile properties.',
            image: '/1_0.jpg'
        },
        {
            title: 'Explore the World',
            content:
                'Navigate the infinite isometric map and discover properties created by other players.',
            image: '/hero4.jpg'
        },
        {
            title: 'Build your property',
            content: 'Build your property.',
            image: '/build.png'
        },
        {
            title: 'Interact with Others',
            content: 'Chat with players, make friends, and collaborate on projects.',
            image: '/chat.png'
        },
        {
            title: 'Ready to Start?',
            content: 'Join Cyberia now and begin your adventure!',
            image: '/start.jpg'
        }
    ];

    useEffect(() => {
        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
        if (!hasSeenOnboarding) {
            onOpen();
        }
    }, [onOpen]);

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            handleFinish();
        }
    };

    const handleFinish = () => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        onClose();
        navigate('/app');
    };

    const handleSkip = () => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        onClose();
        navigate('/app');
    };

    return (
        <Modal isOpen={isOpen} onClose={handleSkip} size="xl" isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{steps[step].title}</ModalHeader>
                <ModalBody>
                    <VStack spacing={4}>
                        <Image src={steps[step].image} alt={steps[step].title} borderRadius="md" />
                        <Text>{steps[step].content}</Text>
                        {step === 0 && (
                            <Box>
                                <Text fontWeight="bold">Key Features:</Text>
                                <UnorderedList>
                                    <ListItem>AI-powered property generation</ListItem>
                                    <ListItem>Infinite map exploration</ListItem>
                                    <ListItem>Multiplayer interaction</ListItem>
                                    <ListItem>Real-time chat system</ListItem>
                                </UnorderedList>
                            </Box>
                        )}
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Flex width="100%" justifyContent="space-between">
                        <Button variant="ghost" onClick={handleSkip}>
                            Skip
                        </Button>
                        <Button colorScheme="blue" onClick={handleNext}>
                            {step === steps.length - 1 ? 'Get Started' : 'Next'}
                        </Button>
                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default Onboarding;
