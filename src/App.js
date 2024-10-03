import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false)
  const [contador, setContador] = useState(0)
  const [valueTotal, setValueTotal] = useState(0)
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
      const { data } = await axios.post('https://readerpdfandimage-production.up.railway.app/api/v1/ler-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setValueTotal(valueTotal + parseFloat(data['Valor da nota'].split(' ')[1]))

      setLoading(false)
      exibirInformacoes(data, contador + 1);

    } catch (error) {
      setLoading(false)
    }

  };


  function exibirInformacoes(informacoes, count) {
    setContador(count)
    const terminalContent = document.getElementById('terminal-content');

    const card = document.createElement('div');
    card.classList.add('card');

    let formattedText = '';
    Object.keys(informacoes).forEach(key => {
      formattedText += `${key}: ${informacoes[key]}\n`;
    });


    formattedText = `${count}. ${formattedText}`;
    card.textContent = formattedText;
    terminalContent.appendChild(card);
  }
 

  async function health() {
    try {
      await axios.get('https://readerpdfandimage-production.up.railway.app/ping')
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
      <h3>VALOR TOTAL DAS NOTAS ENVIADAS: {valueTotal}</h3>
      <h3>QUANTIDADE DE NOTAS ENVIADAS: {contador}</h3>
      <div class="terminal-box">
        <pre id="terminal-content">
        </pre>
      </div>
    </div>
  );
};

export default App;
