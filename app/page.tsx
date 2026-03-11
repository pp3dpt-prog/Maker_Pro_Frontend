'use client';

import { useState, useEffect } from 'react';
// Use APENAS esta linha para o supabase
import { supabase } from '@/lib/supabase'; 
import { Ticket, Users, CreditCard, Activity, Plus } from 'lucide-react';
import CreateCouponForm from '@/components/admin/CreateCouponForm';
import STLViewer from '@/components/STLViewer';
import RegisterModal from '@/components/RegisterModal';

// APAGUE as linhas que usam createClient, supabaseUrl e supabaseKey aqui!


export default function STLMakerPro() {
  const [shape, setShape] = useState('Osso');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [stlUrl, setStlUrl] = useState(null);
  const [showDownload, setShowDownload] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para o Modal

    // Efeito para carregar a forma "em branco" inicial
  useEffect(() => {
    setStlUrl(`/models/blank_${shape.toLowerCase()}.stl`);
  }, [shape]);

  const handlePreview = async () => {
    setIsGenerating(true);
    setStlUrl(null);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    try {
      const response = await fetch(`${backendUrl}/gerar-stl-pro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: name, telefone: phone, forma: shape }),
      });

      const data = await response.json();
      if (data.url) setStlUrl(data.url); 
      else alert("Erro no motor: " + (data.error || "Desconhecido"));
    } catch (err) {
      alert("Erro ao ligar ao servidor. Reporta o erro para o suporte.");
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. Submissão Final (Bloqueia se não houver Login)
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        setIsModalOpen(true); // Abre o modal se não estiver logado
        return;
    }

    // Se logado, grava no Supabase e liberta download
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
      {/* Aqui chamas o teu Modal de Registo fora das tags de estilo */}
      { <RegisterModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            setShowDownload(true);
          }} 
      /> }

      <style jsx>{`
        .container { display: flex; flex-direction: row; min-height: 100vh; background-color: #0f172a; color: #f1f5f9; font-family: sans-serif; }
        .sidebar { width: 400px; background-color: #1e293b; padding: 40px; border-right: 1px solid #334155; display: flex; flex-direction: column; gap: 30px; }
        .viewer { flex: 1; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle, #1e293b 0%, #0f172a 100%); position: relative; }
        h1 { font-size: 2rem; font-weight: 900; margin: 0; letter-spacing: -1px; }
        h1 span { color: #3b82f6; }
        .label { font-size: 11px; text-transform: uppercase; font-weight: bold; color: #64748b; margin-bottom: 10px; display: block; }
        .grid-buttons { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .btn-shape { padding: 12px; background: #0f172a; border: 2px solid #334155; color: #94a3b8; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.3s; }
        .btn-shape.active { border-color: #3b82f6; background: #1e3a8a; color: white; }
        input, textarea { width: 100%; padding: 12px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: white; margin-bottom: 15px; box-sizing: border-box; }
        .btn-main { width: 100%; padding: 16px; background: #2563eb; color: white; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; transition: 0.3s; }
        .btn-main:hover { background: #3b82f6; transform: translateY(-2px); }
        .feedback-box { background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); padding: 20px; border-radius: 16px; margin-top: 20px; }
        .stars { display: flex; gap: 5px; justify-content: center; margin-bottom: 15px; }
        .star { font-size: 24px; cursor: pointer; background: none; border: none; color: #334155; }
        .star.active { color: #facc15; }
        .loading-overlay { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.8); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10; }
        .spinner { width: 40px; height: 40px; border: 4px solid #3b82f6; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 15px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .model-placeholder { width: 80%; height: 60%; background: #0f172a; border: 1px dashed #334155; border-radius: 40px; display: flex; align-items: center; justify-content: center; font-style: italic; color: #475569; }
        @media (max-width: 768px) { .container { flex-direction: column; } .sidebar { width: 100%; } }
      `}</style>

      {/* PAINEL LATERAL */}
      <div className="sidebar">
        <div>
          <h1>STL MAKER <span>PRO</span></h1>
          <p style={{color: '#64748b', fontSize: '14px'}}>Customização 3D Industrial</p>
        </div>

        <div className="section">
          <span className="label">1. Escolha a Forma</span>
          <div className="grid-buttons">
            {['Osso', 'Redondo', 'Hexagono', 'Coração'].map(s => (
              <button key={s} className={`btn-shape ${shape === s ? 'active' : ''}`} onClick={() => setShape(s)}>{s}</button>
            ))}
          </div>
        </div>

        <div className="section">
          <span className="label">2. Dados da Peça</span>
          
          {/* ADICIONA O value={name} e value={phone} */}
          <input 
            type="text" 
            placeholder="Nome (Frente)" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
          
          <input 
            type="text" 
            placeholder="Telemóvel (Verso)" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
          />
          
          <button className="btn-main" onClick={handlePreview}>VISUALIZAR AGORA</button>
        </div>

        {stlUrl && (
          <div className="feedback-box">
            <span className="label" style={{color: '#3b82f6'}}>3. Feedback & Download</span>
            <div className="stars">
              {[1,2,3,4,5].map(s => (
                <button key={s} className={`star ${rating >= s ? 'active' : ''}`} onClick={() => setRating(s)}>★</button>
              ))}
            </div>
            <textarea placeholder="Comentário (opcional)" onChange={(e) => setComment(e.target.value)} />
            
            {!showDownload ? (
              <button className="btn-main" style={{background: '#059669'}} onClick={handleFinalSubmit}>LIBERTAR FICHEIRO</button>
            ) : (
              <a href={stlUrl} download className="btn-main" style={{display: 'block', textAlign: 'center', textDecoration: 'none', background: 'linear-gradient(to right, #f59e0b, #d97706)'}}>
                BAIXAR .STL
              </a>
            )}
          </div>
        )}
      </div>

      {/* VISUALIZADOR */}
      <div className="viewer">
        {isGenerating && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p style={{color: '#ecedee', letterSpacing: '2px', fontSize: '12px'}}>GERANDO...</p>
          </div>
        )}
      
        {/* AQUI ESTÁ A MUDANÇA: Usamos o componente STLViewer se houver stlUrl */}
        {stlUrl ? (
          <STLViewer url={stlUrl} />
        ) : (
          <div className="model-placeholder">
            <span>A carregar visualizador...</span>
          </div>
        )}
      </div>
    </div>
  );
}