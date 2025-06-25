<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
const API_URL = 'http://localhost:4000/api/polizas';


const polizas = ref([]); 
const esEditando = ref(false); 


const formulario = ref({
  _id: null,
  numeroPoliza: '',
  tipoSeguro: 'Auto', 
  titular: '',
  monto: null
});


const obtenerPolizas = async () => {
  try {
    const { data } = await axios.get(API_URL);
    polizas.value = data; 
  } catch (error) {
    console.error("Error al obtener las pólizas:", error);
    alert('No se pudieron cargar las pólizas.');
  }
};


const guardarPoliza = async () => {
  try {
    if (esEditando.value) {
      
      if (!formulario.value._id) {
        console.error("Intento de actualizar sin un ID válido.");
        alert("Error: No se ha seleccionado una póliza para actualizar.");
        return; 
      }
      

      const { _id, ...datosParaActualizar } = formulario.value;
      await axios.put(`${API_URL}/${_id}`, datosParaActualizar);

    } else {

      const { _id, ...datosParaCrear } = formulario.value;
      await axios.post(API_URL, datosParaCrear);
    }
    

    resetFormulario();
    await obtenerPolizas();

  } catch (error) {
    const mensajeError = error.response?.data?.error || error.response?.data?.mensaje || 'Error desconocido al guardar.';
    console.error("Error al guardar la póliza:", error.response);
    alert(`Error al guardar: ${mensajeError}`);
  }
};


const editarPoliza = (poliza) => {
  window.scrollTo(0, 0); 
  esEditando.value = true;

  formulario.value = JSON.parse(JSON.stringify(poliza)); 
};

const resetFormulario = () => {
  esEditando.value = false;
  formulario.value = {
    _id: null,
    numeroPoliza: '',
    tipoSeguro: 'Auto',
    titular: '',
    monto: null
  };
};


onMounted(() => {
  obtenerPolizas();
});
</script>

<template>
  <div class="bg-gray-100 min-h-screen font-sans">
    <div class="container mx-auto p-4 sm:p-8 max-w-5xl">
      
      <header class="mb-10 text-center">
        <h1 class="text-4xl font-bold text-gray-800">Aseguradora CEUTEC</h1>
        <p class="text-gray-600">Gestión de Pólizas de Seguro</p>
      </header>

      <main class="bg-white rounded-xl shadow-lg p-6 sm:p-8">

        <section class="mb-10">
          <h2 class="text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">
            {{ esEditando ? '✏️ Editando Póliza' : '➕ Crear Nueva Póliza' }}
          </h2>
          <form @submit.prevent="guardarPoliza" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="numeroPoliza" class="block text-sm font-medium text-gray-600">Número de Póliza</label>
                <input id="numeroPoliza" v-model="formulario.numeroPoliza" type="text" placeholder="POL-12345" class="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required>
              </div>
              <div>
                <label for="titular" class="block text-sm font-medium text-gray-600">Nombre del Titular</label>
                <input id="titular" v-model="formulario.titular" type="text" placeholder="Juan Pérez" class="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required>
              </div>
              <div>
                <label for="monto" class="block text-sm font-medium text-gray-600">Monto (LPS)</label>
                <input id="monto" v-model="formulario.monto" type="number" step="0.01" placeholder="5000.00" class="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required>
              </div>
              <div>
                <label for="tipoSeguro" class="block text-sm font-medium text-gray-600">Tipo de Seguro</label>
                <select id="tipoSeguro" v-model="formulario.tipoSeguro" class="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm bg-white focus:ring-blue-500 focus:border-blue-500">
                  <option>Auto</option>
                  <option>Vida</option>
                  <option>Hogar</option>
                  <option>Salud</option>
                </select>
              </div>
            </div>
            <div class="flex items-center gap-4 pt-4">
              <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                {{ esEditando ? 'Actualizar Póliza' : 'Guardar Póliza' }}
              </button>
              <button v-if="esEditando" @click="resetFormulario" type="button" class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                Cancelar
              </button>
            </div>
          </form>
        </section>

        
        <section>
          <h2 class="text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">📋 Pólizas Registradas</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full bg-white">
              <thead class="bg-gray-50">
                <tr>
                  <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Póliza</th>
                  <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titular</th>
                  <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                  <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-if="polizas.length === 0">
                  <td colspan="5" class="text-center py-6 text-gray-500">No hay pólizas para mostrar. ¡Crea una nueva!</td>
                </tr>
                <tr v-for="poliza in polizas" :key="poliza._id" class="hover:bg-gray-50 transition-colors">
                  <td class="py-4 px-4 whitespace-nowrap font-medium text-gray-900">{{ poliza.numeroPoliza }}</td>
                  <td class="py-4 px-4 whitespace-nowrap text-gray-600">{{ poliza.titular }}</td>
                  <td class="py-4 px-4 whitespace-nowrap"><span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{{ poliza.tipoSeguro }}</span></td>
                  <td class="py-4 px-4 whitespace-nowrap text-gray-600">L. {{ Number(poliza.monto).toFixed(2) }}</td>
                  <td class="py-4 px-4 whitespace-nowrap">
                    <button @click="editarPoliza(poliza)" class="text-yellow-600 hover:text-yellow-900 font-medium">
                      Editar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>