/* eslint-disable react/prop-types */
import { Accordion, Button, Select } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import AutocompleteInput from './AutoCompleteCuisine';

const CreateRecipeForm = ({userData, handleClose}) => {
    console.log(userData)
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    description: '',
    steps: [''],
    is_draft: false,
    tags: [''],
    cuisine: '',
    meal_type: '',
    dish_type: '',
    time: '',
    user_id: userData.id, 
    ingredients: [{ text: '', food: '', quantity: '', unit: '' }]
  });

  const [isFormValid, setIsFormValid] = useState(false); 

  useEffect(() => {
    // Update isFormValid based on formData
    const isFormDataValid = formData.name && formData.image && formData.description 
                            && formData.steps.every(step => step.trim() !== '') 
                            && formData.tags;
    setIsFormValid(isFormDataValid);
  }, [formData]);

  const handleChange = (e) => {
    if (e.target.name.startsWith('ingredients')) {
      const index = parseInt(e.target.dataset.index);
      const newIngredients = formData.ingredients.map((ingredient, i) => {
        if (i === index) {
          return { ...ingredient, [e.target.dataset.field]: e.target.value };
        }
        return ingredient;
      });
      setFormData({ ...formData, ingredients: newIngredients });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const processedTags = formData.tags
    .split('#')
    .filter(tag => tag.trim() !== '') // Remove empty tags
    .map(tag => tag.trim().replace(/_/g, ' ').replace(/,/g, '')); // Replace underscores with spaces and remove commas

  // Create the final form data object for submission
    const finalFormData = {
    ...formData,
    tags: processedTags
  };
  console.log(finalFormData);
    const server = import.meta.env.VITE_BACK_END_SERVE
    try {
      const response = await fetch(`${server}/create_recipe`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(finalFormData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Handle response
      console.log('Recipe created successfully');
    } catch (error) {
      console.error('Error creating recipe:', error);
    }
  };

  const handleAddIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { text: '', food: '', quantity: '', unit: '' }]
    });
  };
  const handleChangeStep = (index, value) => {
    const newSteps = formData.steps.map((step, i) => (
      i === index ? value : step
    ));
    setFormData({ ...formData, steps: newSteps });
  };

  const handleAddStep = () => {
    setFormData({ ...formData, steps: [...formData.steps, ''] });
  };
  

  return (
    <form className="h-96 overflow-y-auto" onSubmit={handleSubmit}>
        <Accordion>
            <Accordion.Panel>
                <Accordion.Title>Basic Info?</Accordion.Title>
                <Accordion.Content>
                <input className='rounded-lg mb-2 mr-1' type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name"  required/>
                <input className='rounded-lg mb-2 mr-1' type="text" name="image" value={formData.image} onChange={handleChange} placeholder="Image URL"  required/>
                <input className='rounded-lg mb-2 mr-1' type="number" name="time" value={formData.time} onChange={handleChange} placeholder="Est. Cook Time" required />
                <input className='rounded-lg mb-2 mr-1' type="text" name="meal_type" value={formData.meal_type} onChange={handleChange} placeholder="Meal Type"  required/>
                <AutocompleteInput type="text" name="cuisine" value={formData.cuisine} onChange={handleChange} placeholder="Cuisine" required />
                <div className="max-w-md">
                <div className="mb-2 block">
                    </div>
                <Select name="dish_type" value={formData.dish_type} onChange={handleChange}  required> 
                    <option className='text-white hover:text-blue-400'>Dish Type</option>
                    <option>Breakfast</option>
                    <option>Lunch/Dinner</option>
                    <option>Teatime</option>
                    <option>Snack</option>
                </Select>
                </div>            
                </Accordion.Content>
            </Accordion.Panel>
            <Accordion.Panel>
                <Accordion.Title>Description and Tags?</Accordion.Title>
                <Accordion.Content>
                    <div className='flex flex-col'>
                <textarea className='rounded-lg mb-2 mr-1' name="description" value={formData.description} onChange={handleChange} placeholder="Description"  required/>
                <label className='text-gray-500' htmlFor='tags'>add tags for better searchability (format: #veggie_soup) </label>
                <input className='rounded-lg mb-2 mr-1' type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags"  required />
                </div>
                </Accordion.Content>
            </Accordion.Panel>
            <Accordion.Panel>
                <Accordion.Title>Ingredients?</Accordion.Title>
                <Accordion.Content>
                
                {formData.ingredients.map((ingredient, index) => (
                <div key={index}>
                <input className='rounded-lg mb-2 mr-1' type="text" name={`ingredients[${index}].text`} data-index={index} data-field="text" value={ingredient.text} onChange={handleChange} placeholder="Extra Details"  required/>
                <input className='rounded-lg mb-2 mr-1' type="text" name={`ingredients[${index}].food`} data-index={index} data-field="food" value={ingredient.food} onChange={handleChange} placeholder="Food"  required/>
                <input className='rounded-lg mb-2 mr-1' type="text" name={`ingredients[${index}].quantity`} data-index={index} data-field="quantity" value={ingredient.quantity} onChange={handleChange} placeholder="Quantity"  required/>
                <input className='rounded-lg mb-2 mr-1' type="text" name={`ingredients[${index}].unit`} data-index={index} data-field="unit" value={ingredient.unit} onChange={handleChange} placeholder="Unit"  required/>
                </div>
            ))}
            <button className='border bg-blue-400  px-2 p-0.5 rounded-lg mb-2 mr-1' type="button" onClick={handleAddIngredient}>Add Ingredient</button>
                </Accordion.Content>
            </Accordion.Panel>
            <Accordion.Panel>
                <Accordion.Title>Steps?</Accordion.Title>
                <Accordion.Content >
                {formData.steps.map((step, index) => (
                        <div key={index}>
                        <input 
                            type="text" 
                            value={step} 
                            onChange={(e) => handleChangeStep(index, e.target.value)} 
                            placeholder={`Step ${index + 1}`} 
                            className="border border-gray-400 rounded p-2 my-1"
                            required
                        />
                        </div>
                    ))}
                   
                    <button  className='border  bg-blue-400  px-2 p-0.5 rounded-lg mb-2 mr-1' type="button" onClick={handleAddStep}>Add Step</button>
                </Accordion.Content>
            </Accordion.Panel>
            </Accordion>

        <div className='flex flex-row justify-between'> 
            <Button  disabled={!isFormValid} gradientMonochrome="success"  className={`mt-4 px-4 py-2 ${isFormValid ? '': 'bg-gray-500 text-gray-200'}` } type="submit">Create Recipe</Button>
            <Button gradientMonochrome="failure" onClick={handleClose} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Cancel</Button>
        </div>
    </form>
    
  );
};

export default CreateRecipeForm; 
