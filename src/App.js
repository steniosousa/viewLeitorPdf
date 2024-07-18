import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [response, setResponse] = useState('')

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Selecione um arquivo PDF antes de enviar.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', selectedFile);

    try {
      const { data } = await axios.post('https://readerpdfandimage.onrender.com/api/v1/ler-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      exibirInformacoes(data);

    } catch (error) {
      console.error('Erro ao enviar PDF:', error);
      alert('Erro ao enviar PDF. Verifique o console para mais detalhes.');
    }
  };

  function exibirInformacoes(informacoes) {
    const terminalContent = document.getElementById('terminal-content');
    let formattedText = '';

    Object.keys(informacoes).forEach(key => {
      formattedText += `${key}: ${informacoes[key]}\n`;
    });

    terminalContent.textContent = formattedText;
  }


  return (
    <div className="centered-container">
      <h1>Envio de PDF para Backend</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="file" name="pdfFile" onChange={handleFileChange} accept=".pdf" />
        <button type="submit">Enviar PDF</button>
      </form>
      <div class="terminal-box">
        <pre id="terminal-content">
        </pre>
      </div>
    </div>
  );
};

export default App;
