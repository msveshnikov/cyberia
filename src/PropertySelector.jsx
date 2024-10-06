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

    const propertyTypes = [
        'house',
        'apartment',
        'skyscraper',
        'castle',
        'shop',
        'office',
        'villa',
        'bungalow',
        'mansion',
        'cottage',
        'townhouse',
        'warehouse',
        'factory',
        'school',
        'hospital'
    ];

    const colors = [
        'white',
        'red',
        'blue',
        'green',
        'yellow',
        'black',
        'gray',
        'brown',
        'orange',
        'purple',
        'pink',
        'teal',
        'navy',
        'maroon',
        'olive'
    ];

    const styles = [
        'modern',
        'rustic',
        'futuristic',
        'medieval',
        'minimalist',
        'victorian',
        'art deco',
        'industrial',
        'mediterranean',
        'colonial',
        'contemporary',
        'gothic',
        'baroque',
        'zen',
        'scandinavian'
    ];

    const materials = [
        'brick',
        'wood',
        'concrete',
        'glass',
        'stone',
        'steel',
        'marble',
        'titanium',
        'copper',
        'bamboo',
        'straw',
        'adobe',
        'recycled plastic',
        'carbon fiber',
        'smart glass'
    ];

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
                                {propertyTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Property Color</FormLabel>
                            <Select value={color} onChange={(e) => setColor(e.target.value)}>
                                {colors.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Style</FormLabel>
                            <Select value={style} onChange={(e) => setStyle(e.target.value)}>
                                {styles.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
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
                                    step={5}
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
                                {materials.map((m) => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))}
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
