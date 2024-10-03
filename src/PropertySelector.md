# PropertySelector Component Documentation

## Overview

The `PropertySelector` component is a React component that provides a modal interface for users to
select and customize properties of a building or structure. It's part of a larger project, likely
related to real estate or architectural visualization, as indicated by the project structure.

This component is defined in `src/PropertySelector.jsx` and uses Chakra UI components for its user
interface elements.

## Component Structure

The `PropertySelector` is a functional component that uses React hooks for state management. It
renders a modal with various form controls for selecting property attributes.

## Props

-   `isOpen` (boolean): Controls the visibility of the modal.
-   `onClose` (function): Callback function to close the modal.
-   `onGenerate` (function): Callback function to handle the generation of property details.

## State Variables

The component uses several state variables to manage the property details:

-   `propertyType` (string): Type of property (e.g., house, apartment).
-   `color` (string): Color of the property.
-   `style` (string): Architectural style of the property.
-   `size` (number): Size of the property (percentage).
-   `material` (string): Main material of the property.
-   `additionalDetails` (string): Any additional details or features.

## Main Functions

### `handleSubmit()`

This function is called when the user clicks the "Generate" button. It:

1. Collects all the property details from the state.
2. Calls the `onGenerate` prop function with the collected details.
3. Closes the modal by calling the `onClose` prop function.

## UI Components

The component uses various Chakra UI components to create the form:

-   `Modal`: The main container for the property selector.
-   `Select`: Dropdown menus for property type, color, style, and material.
-   `Slider`: For selecting the size of the property.
-   `Input`: For entering additional details.
-   `Button`: For submitting the form or canceling the operation.

## Usage Example

```jsx
import PropertySelector from './PropertySelector';

function ParentComponent() {
    const [isOpen, setIsOpen] = useState(false);

    const handleGenerate = (propertyDetails) => {
        console.log('Generated property details:', propertyDetails);
        // Process the property details...
    };

    return (
        <div>
            <Button onClick={() => setIsOpen(true)}>Open Property Selector</Button>
            <PropertySelector
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onGenerate={handleGenerate}
            />
        </div>
    );
}
```

## Project Context

Within the project structure, `PropertySelector.jsx` is located in the `src` directory alongside
other main components like `App.jsx` and `Landing.jsx`. This suggests that it's a key part of the
user interface, likely used for creating or customizing property visualizations.

The component's integration with Chakra UI and its modular design make it a flexible and reusable
part of the application, potentially used in various contexts where property customization is
needed.

## Notes

-   The component uses a controlled form pattern, where all form inputs are tied to state variables.
-   The design is responsive and accessible, leveraging Chakra UI's built-in features.
-   The component can be easily extended to include more property attributes or customization
    options.
