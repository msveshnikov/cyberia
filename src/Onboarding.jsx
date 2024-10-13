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
                'Embark on a journey in Cyberia, an innovative MMO game where you can create and explore virtual properties on an infinite, AI-generated map.',
            image: '/hero2.jpg'
        },
        {
            title: 'Create Your Property',
            content:
                'Harness the power of AI to generate unique 1024x1024 tile properties. Design your dream space with cutting-edge Stable Diffusion SDXL & Flux technology.',
            image: '/1_0.jpg'
        },
        {
            title: 'Explore the World',
            content:
                'Navigate the vast, infinite isometric map and discover incredible properties created by players from around the globe. Uncover hidden gems and find inspiration for your own creations.',
            image: '/hero4.jpg'
        },
        {
            title: 'Build Your Legacy',
            content:
                'Transform your property into a masterpiece. Use intuitive tools to construct, decorate, and personalize your space. Let your creativity run wild in this boundless digital realm.',
            image: '/build.png'
        },
        {
            title: 'Connect with Others',
            content:
                'Engage in real-time conversations, forge new friendships, and collaborate on ambitious projects. Experience a truly social virtual world where ideas and creativity flourish.',
            image: '/chat.png'
        },
        {
            title: 'Your Adventure Awaits',
            content:
                'Are you ready to shape the future of Cyberia? Join now and become part of a revolutionary virtual experience!',
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
                                    <ListItem>
                                        AI-powered property generation using Stable Diffusion SDXL &
                                        Flux
                                    </ListItem>
                                    <ListItem>Infinite isometric map exploration</ListItem>
                                    <ListItem>Real-time multiplayer interaction</ListItem>
                                    <ListItem>
                                        Browser-based gameplay - no downloads required
                                    </ListItem>
                                    <ListItem>Customizable 1024x1024 property tiles</ListItem>
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
                            {step === steps.length - 1 ? 'Start Your Adventure' : 'Next'}
                        </Button>
                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default Onboarding;
