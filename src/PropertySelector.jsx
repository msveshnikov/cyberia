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
    VStack,
    HStack,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Text
} from '@chakra-ui/react';

const PropertySelector = ({ isOpen, onClose, onGenerate }) => {
    const [propertyType, setPropertyType] = useState('house');
    const [color, setColor] = useState('white');
    const [style, setStyle] = useState('modern');
    const [size, setSize] = useState(50);
    const [material, setMaterial] = useState('brick');
    const [additionalDetails, setAdditionalDetails] = useState('');

    const handleSubmit = () => {
        const propertyDetails = {
            propertyType,
            color,
            style,
            size,
            material,
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
                            <FormLabel>Property Type</FormLabel>
                            <Select
                                value={propertyType}
                                onChange={(e) => setPropertyType(e.target.value)}
                            >
                                <option value="house">House</option>
                                <option value="apartment">Apartment</option>
                                <option value="skyscraper">Skyscraper</option>
                                <option value="castle">Castle</option>
                                <option value="shop">Shop</option>
                                <option value="office">Office</option>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Property Color</FormLabel>
                            <Select value={color} onChange={(e) => setColor(e.target.value)}>
                                <option value="white">White</option>
                                <option value="red">Red</option>
                                <option value="blue">Blue</option>
                                <option value="green">Green</option>
                                <option value="yellow">Yellow</option>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Style</FormLabel>
                            <Select value={style} onChange={(e) => setStyle(e.target.value)}>
                                <option value="modern">Modern</option>
                                <option value="rustic">Rustic</option>
                                <option value="futuristic">Futuristic</option>
                                <option value="medieval">Medieval</option>
                                <option value="minimalist">Minimalist</option>
                                <option value="victorian">Victorian</option>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Size</FormLabel>
                            <HStack spacing={4}>
                                <Slider
                                    value={size}
                                    onChange={(value) => setSize(value)}
                                    min={10}
                                    max={100}
                                    step={10}
                                >
                                    <SliderTrack>
                                        <SliderFilledTrack />
                                    </SliderTrack>
                                    <SliderThumb />
                                </Slider>
                                <Text>{size}%</Text>
                            </HStack>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Material</FormLabel>
                            <Select value={material} onChange={(e) => setMaterial(e.target.value)}>
                                <option value="brick">Brick</option>
                                <option value="wood">Wood</option>
                                <option value="concrete">Concrete</option>
                                <option value="glass">Glass</option>
                                <option value="stone">Stone</option>
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
