import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(!loading)

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
      setLoading(false)

      exibirInformacoes(data);

    } catch (error) {
      setLoading(false)
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


  async function health() {
    try {
      await axios.get('https://readerpdfandimage.onrender.com/ping')
    } catch {
      alert('O SISTEMA ESTÁ DESLIGADO, tente novamente em instantes');

    }

  }
  useEffect(() => {
    health()
  })


  return (
    <div className="centered-container">
      <h1>Envio de PDF para Backend</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="file" name="pdfFile" onChange={handleFileChange} accept=".pdf" />
        <button type="submit">Enviar PDF</button>
      </form>
      {loading ? (
        <p>Carregando...</p>
      ) : null}
      <div class="terminal-box">
        <pre id="terminal-content">
        </pre>
      </div>
    </div>
  );
};

export default App;
