import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [valueTotal, setValueTotal] = useState(0);
  const [contador, setContador] = useState(0);
  const [selectedModules, setSelectedModules] = useState([]);

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files)); // Armazena múltiplos arquivos
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
      formData.append('modules',JSON.stringify(selectedModules))
      try {
        const { data } = await axios.post('https://readerpdfandimage-production.up.railway.app/api/v1/ler-pdf',formData);

        exibirInformacoes(data, contador + 1);
        setContador((prevCount) => prevCount + 1);
        if(!data['Valor da nota']) continue
        setValueTotal((prevTotal) => prevTotal + parseFloat(data['Valor da nota'].split(' ')[1]));
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    setLoading(false);
  };

  const exibirInformacoes = (informacoes, count) => {
    const terminalContent = document.getElementById('terminal-content');
    const card = document.createElement('div');
    card.classList.add('card');

    let formattedText = '';
    Object.keys(informacoes).forEach((key) => {
      formattedText += `${key}: ${informacoes[key]}\n`;
    });

    formattedText = `${count}. ${formattedText}`;
    card.textContent = formattedText;
    terminalContent.appendChild(card);
  };

  async function health() {
    try {
      await axios.get('https://readerpdfandimage-production.up.railway.app/ping');
    } catch {
      alert('O SISTEMA ESTÁ DESLIGADO, tente novamente em instantes');
    }
  }

  useEffect(() => {
    health();
  }, []);

  const handleModuleChange = (event) => {
    const module = event.target.value;
    setSelectedModules((prev) =>
      prev.includes(module) ? prev.filter((m) => m !== module) : [...prev, module]
    );
  };

  return (
    <div className="centered-container">
      <h1>Envio de PDF para Backend</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="form-container">
        <div className="file-input">
          <input
            type="file"
            name="pdfFiles"
            id="pdfFiles"
            onChange={handleFileChange}
            accept=".pdf"
            multiple // Permite múltiplos arquivos
            className="file-upload"
          />
          <label htmlFor="pdfFiles" className="custom-file-upload">
            Escolher arquivos
          </label>
        </div>

        <div className="modules-selection">
  <h2>Selecione os Módulos:</h2>
  {['Peso bruto', 'Tipo', 'Localização', 'CNPJ', 'Inscrição estadual', 'Destinatário'].map((modulo) => (
    <label key={modulo} className="module-label">
      <input
        type="checkbox"
        value={modulo}
        onChange={handleModuleChange}
        checked={selectedModules.includes(modulo)}
        className="module-checkbox"
      />
      {modulo}
    </label>
  ))}
</div>


        <button type="submit">Enviar PDF</button>
      </form>

      {loading && <p className="loading-message">Carregando...</p>}

      <div className="summary">
        <h3>VALOR TOTAL DAS NOTAS ENVIADAS: {valueTotal}</h3>
        <h3>QUANTIDADE DE NOTAS ENVIADAS: {contador}</h3>
      </div>

      <div className="terminal-box">
        <pre id="terminal-content"></pre>
      </div>
    </div>
  );
};

export default App;
