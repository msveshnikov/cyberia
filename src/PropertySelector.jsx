import { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Select,
    Input,
    VStack
} from '@chakra-ui/react';

const PropertySelector = ({ isOpen, onClose, onGenerate }) => {
    const [houseType, setHouseType] = useState('');
    const [color, setColor] = useState('');
    const [style, setStyle] = useState('');
    const [additionalDetails, setAdditionalDetails] = useState('');

    const handleSubmit = () => {
        const propertyDetails = {
            houseType,
            color,
            style,
            additionalDetails
        };
        onGenerate(propertyDetails);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Generate Property</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4}>
                        <FormControl>
                            <FormLabel>House Type</FormLabel>
                            <Select
                                placeholder="Select house type"
                                value={houseType}
                                onChange={(e) => setHouseType(e.target.value)}
                            >
                                <option value="cottage">Cottage</option>
                                <option value="mansion">Mansion</option>
                                <option value="skyscraper">Skyscraper</option>
                                <option value="castle">Castle</option>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Color</FormLabel>
                            <Input
                                type="text"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                placeholder="e.g. Red, Blue, Green"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Style</FormLabel>
                            <Select
                                placeholder="Select style"
                                value={style}
                                onChange={(e) => setStyle(e.target.value)}
                            >
                                <option value="modern">Modern</option>
                                <option value="rustic">Rustic</option>
                                <option value="futuristic">Futuristic</option>
                                <option value="medieval">Medieval</option>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Additional Details</FormLabel>
                            <Input
                                type="text"
                                value={additionalDetails}
                                onChange={(e) => setAdditionalDetails(e.target.value)}
                                placeholder="Any specific features or elements"
                            />
                        </FormControl>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                        Generate
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default PropertySelector;
