'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; 
import STLViewer from '@/components/STLViewer'; // Verifica se este caminho está correto
import RegisterModal from '@/components/RegisterModal'; // Verifica se este caminho está correto

export default function STLMakerPro() {
  const [shape, setShape] = useState('Osso');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [stlUrl, setStlUrl] = useState<string | null>(null);
  const [showDownload, setShowDownload] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Efeito para carregar a forma "em branco" inicial
  useEffect(() => {
    setStlUrl(`/models/blank_${shape.toLowerCase()}.stl`);
  }, [shape]);

  const handlePreview = async () => {
    setIsGenerating(true);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    try {
      const response = await fetch(`${backendUrl}/gerar-stl-pro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: name, telefone: phone, forma: shape, tamanho: 'M' }),
      });

      const data = await response.json();
      if (data.url) setStlUrl(data.url); 
      else alert("Erro no motor: " + (data.error || "Desconhecido"));
    } catch (err) {
      console.error(err);
      alert("Erro ao ligar ao servidor.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        setIsModalOpen(true);
        return;
    }

    const { error } = await supabase.from('downloads_log').insert([{ 
      email: user.email, 
      rating,
      feedback: comment,
      shape_type: shape, 
      custom_name: name, 
      file_url: stlUrl 
    }]);

    if (!error) setShowDownload(true);
    else alert("Erro ao gravar dados.");
  };

  return (
    <div className="container">
      <RegisterModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            setShowDownload(true);
          }} 
      />

      <style jsx>{`
        .container { display: flex; flex-direction: row; min-height: 100vh; background-color: #0f172a; color: #f1f5f9; font-family: sans-serif; }
        .sidebar { width: 400px; background-color: #1e293b; padding: 40px; border-right: 1px solid #334155; }
        .viewer { flex: 1; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle, #1e293b 0%, #0f172a 100%); position: relative; }
        .grid-buttons { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
        .btn-shape { padding: 12px; background: #0f172a; border: 2px solid #334155; color: #94a3b8; border-radius: 8px; cursor: pointer; }
        .btn-shape.active { border-color: #3b82f6; background: #1e3a8a; color: white; }
        .btn-main { width: 100%; padding: 16px; background: #2563eb; color: white; border: none; border-radius: 12px; margin-top: 10px; cursor: pointer; }
      `}</style>

      <div className="sidebar">
        <h1>STL MAKER <span>PRO</span></h1>
        
        <div className="section">
          <span className="label">1. Forma</span>
          <div className="grid-buttons">
            {['Osso', 'Redondo', 'Hexagono', 'Coração'].map(s => (
              <button key={s} className={`btn-shape ${shape === s ? 'active' : ''}`} onClick={() => setShape(s)}>{s}</button>
            ))}
          </div>
        </div>

        <input type="text" placeholder="Nome" onChange={(e) => setName(e.target.value)} />
        <button className="btn-main" onClick={handlePreview}>VISUALIZAR</button>
      </div>

      <div className="viewer">
        {isGenerating && <div className="loading-overlay">Gerando...</div>}
        {stlUrl && <STLViewer key={stlUrl} url={stlUrl} />}
      </div>
    </div>
  );
}