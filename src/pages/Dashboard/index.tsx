import { useState, useEffect } from 'react'

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import {ModalAddFood} from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodType } from '../../Interface';

import { FoodsContainer } from './styles';

export function Dashboard() {
  const [foods, setFoods] = useState<FoodType[]>([])
  const [editingFood, setEditingFood] = useState<FoodType>({} as FoodType)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalOpenEdit, setModalOpenEdit] = useState(false)

  useEffect(() => {
    async function loadFoods() {
      const resp = await api.get("/foods");
      setFoods(resp.data);
    }
    loadFoods();
  }, []);

  const handleAddFood = async (food: FoodType) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods(foods => [...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: FoodType) => {

    try {
      if (editingFood) {
        const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
          ...editingFood,
          ...food,
        })

        const foodsUpdated = foods.map((f) =>
          f.id !== foodUpdated.data.id ? f : foodUpdated.data
        )

        setFoods(foodsUpdated)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleDeleteFood = async (id: Number) => {

    await api.delete(`/foods/${id}`)

    const foodsFiltered = foods.filter((food) => food.id !== Number(id))

    setFoods(foodsFiltered)
  }

  const toggleModal = () => {

    setModalOpen(!modalOpen)
  }

  const toggleEditModal = () => {

    setModalOpenEdit(!modalOpenEdit)
  }

  const handleEditFood = (food: FoodType) => {
    setModalOpenEdit(true)
    setEditingFood(food)
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={modalOpenEdit}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
