import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [valueTotal, setValueTotal] = useState(0);
  const [contador, setContador] = useState(0);

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files)); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (selectedFiles.length === 0) {
      alert('Selecione pelo menos um arquivo PDF antes de enviar.');
      setLoading(false);
      return;
    }

    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append('pdf', file);
      try {
        setContador(valueTotal+1)
        const {data}  = await axios.post('https://readerpdfandimage-production.up.railway.app/api/v1/ler-pdf',formData);
        const JsonFormated = data.split("json")[1].split("```")[0]
        exibirInformacoes(JSON.parse(JsonFormated));
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    setLoading(false);
  };

  const exibirInformacoes = (informacoes) => {
    const terminalContent = document.getElementById('terminal-content');
    const card = document.createElement('div');
    card.classList.add('card');
    setValueTotal(valueTotal + informacoes.valor_da_nota)

    let formattedText = '';
    
    Object.keys(informacoes).forEach((key) => {
        if (typeof informacoes[key] === 'object' && informacoes[key] !== null) {
            formattedText += `${key}:\n`;
            Object.keys(informacoes[key]).forEach((subKey) => {
                formattedText += `  ${subKey}: ${informacoes[key][subKey]}\n`;
            });
        } else {
            formattedText += `${key}: ${informacoes[key]}\n`;
        }
    });

    formattedText = `${formattedText}`;
    card.textContent = formattedText;
    terminalContent.appendChild(card);
};



  return (
    <div className="centered-container h-full">
    <h1 className="text-center text-2xl font-bold mb-6">Envio de PDF para Backend</h1>
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="form-container bg-white shadow-md rounded p-6">
      <div className="file-input mb-4">
        <input
          type="file"
          name="pdfFiles"
          id="pdfFiles"
          onChange={handleFileChange}
          accept=".pdf"
          multiple
          className="file-upload hidden"
        />
        <label htmlFor="pdfFiles" className="custom-file-upload block bg-blue-500 text-white text-center py-2 rounded cursor-pointer transition duration-300 ease-in-out hover:bg-blue-600">
          Escolher arquivos
        </label>
        <p className="text-gray-500 text-sm mt-1">Formato aceito: PDF</p>
      </div>
  
      <div className="modules-selection mb-4">
        {/* Adicione aqui os componentes de seleção de módulos */}
      </div>
  
      <button type="submit" className="w-full bg-green-500 text-white py-2 rounded transition duration-300 ease-in-out hover:bg-green-600">
        Enviar PDF
      </button>
    </form>
  
    {loading && <p className="loading-message text-center text-blue-500 mt-4">Carregando...</p>}
  
    <div className="summary mt-6 p-4 bg-gray-100 rounded shadow">
      <h3 className="text-lg font-semibold">
        VALOR TOTAL DAS NOTAS ENVIADAS: {valueTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
      </h3>
      <h3 className="text-lg font-semibold">QUANTIDADE DE NOTAS ENVIADAS: {contador}</h3>
    </div>
  
    <div className="terminal-box mt-4 p-4 bg-black text-white rounded">
      <pre id="terminal-content"></pre>
    </div>
  </div>
  
  );
};

export default App;
